import { env } from 'cloudflare:workers'

import type { ChatMessage, Product } from './types'

const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5'
const LLM_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'
const AI_GATEWAY = {
  id: 'rag-search-demo-gateway',
  skipCache: false,
  cacheTtl: 3600,
}
const TOP_K = 6
const MAX_HISTORY = 6
const EMBED_BATCH_SIZE = 16

const SYSTEM_PROMPT = [
  'You are ShadeFinder, a friendly eyewear shopping assistant.',
  'Recommend ONLY from the provided product list.',
  'Always cite product names and prices when recommending.',
  'If nothing in the list fits the request, say so honestly and suggest the closest alternatives from the list.',
  'Keep answers short and helpful.',
].join(' ')

export function toProductText(product: Product): string {
  return `${product.name}. ${product.brand} ${product.category} ${product.shape} ${product.color} ${product.material}. ${product.description}`
}

export async function getAllProducts(): Promise<Product[]> {
  const { results } = await env.DB.prepare(
    'SELECT id, name, brand, category, shape, color, material, price, rating, description FROM products',
  ).all<Product>()
  if (!results) throw new Error('D1 query returned no results object')
  return results
}

async function embed(texts: string[]): Promise<number[][]> {
  const batches: number[][] = []
  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const chunk = texts.slice(i, i + EMBED_BATCH_SIZE)
    const response = await env.AI.run(EMBEDDING_MODEL, { text: chunk }, { gateway: AI_GATEWAY })
    if (!('data' in response) || !response.data) {
      throw new Error(`Embedding model returned no data for batch at offset ${i}`)
    }
    batches.push(...response.data)
  }
  return batches
}

async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return []
  const placeholders = ids.map(() => '?').join(', ')
  const { results } = await env.DB.prepare(
    `SELECT id, name, brand, category, shape, color, material, price, rating, description FROM products WHERE id IN (${placeholders})`,
  )
    .bind(...ids)
    .all<Product>()
  if (!results) throw new Error('D1 query returned no results object')
  return results
}

export async function ingestProducts(): Promise<{ inserted: number; count: number }> {
  const products = await getAllProducts()
  const texts = products.map(toProductText)
  const vectors = await embed(texts)
  const points = products.map((product, index) => ({
    id: product.id,
    values: vectors[index] ?? [],
    metadata: { productId: product.id },
  }))
  await env.VECTORIZE.upsert(points)
  return { inserted: points.length, count: products.length }
}

export async function searchProducts(
  query: string,
  history: ChatMessage[],
): Promise<{ reply: string; products: Product[] }> {
  const [queryVector] = await embed([query])
  if (!queryVector) throw new Error('Query embedding failed')
  const result = await env.VECTORIZE.query(queryVector, {
    topK: TOP_K,
    returnValues: false,
    returnMetadata: 'none',
  })
  const rankedIds = result.matches.map((match) => match.id)
  const rows = await getProductsByIds(rankedIds)
  const byId = new Map(rows.map((row) => [row.id, row]))
  const products = rankedIds.flatMap((id) => {
    const row = byId.get(id)
    return row ? [row] : []
  })
  const reply = await generateReply(query, history, products)
  return { reply, products }
}

function formatProducts(products: Product[]): string {
  return products
    .map(
      (p) =>
        `- ${p.name} by ${p.brand} | ${p.category}, ${p.shape}, ${p.color}, ${p.material} | $${p.price.toFixed(2)} | rating ${p.rating}/5 | ${p.description}`,
    )
    .join('\n')
}

async function generateReply(query: string, history: ChatMessage[], products: Product[]): Promise<string> {
  const recent = history.slice(-MAX_HISTORY)
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...recent.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: `Customer question: ${query}\n\nAvailable products:\n${formatProducts(products)}` },
  ]
  const result = await env.AI.run(LLM_MODEL, { messages }, { gateway: AI_GATEWAY })
  const raw = typeof result === 'string' ? result : 'response' in result ? result.response : undefined
  const reply = raw?.trim()
  if (!reply) throw new Error('LLM returned an empty response')
  return reply
}
