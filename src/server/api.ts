import { ingestProducts, searchProducts } from './rag'

import type { ApiError, ChatRequestBody, ChatResponseBody, IngestResponseBody } from './types'

const API_PATHS = ['/api/chat', '/api/ingest'] as const

export function isApiPath(pathname: string): boolean {
  return (API_PATHS as readonly string[]).includes(pathname)
}

export async function handleApiRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url)
  if (pathname === '/api/chat' && request.method === 'POST') {
    return handleChat(request)
  }
  if (pathname === '/api/ingest' && request.method === 'POST') {
    return handleIngest()
  }
  return json({ error: 'Not found' }, 404)
}

function json(data: ChatResponseBody | IngestResponseBody | ApiError, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

async function handleChat(request: Request): Promise<Response> {
  let body: ChatRequestBody
  try {
    body = (await request.json()) as ChatRequestBody
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }
  const query = body.query?.trim()
  if (!query) {
    return json({ error: 'query is required' }, 400)
  }
  const history = Array.isArray(body.history) ? body.history : []
  try {
    const result = await searchProducts(query, history)
    return json(result)
  } catch (error) {
    console.error('chat failed:', error)
    return json({ error: 'Chat request failed' }, 500)
  }
}

async function handleIngest(): Promise<Response> {
  try {
    const result = await ingestProducts()
    return json(result)
  } catch (error) {
    console.error('ingest failed:', error)
    return json({ error: 'Ingest request failed' }, 500)
  }
}
