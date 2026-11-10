# ShadeFinder — AI Eyewear Product Search Chatbot

A working RAG demo built with TanStack Start on Cloudflare Workers. Ask about
sunglasses, eyeglasses, or blue-light glasses and ShadeFinder answers from a
D1 product catalog, ranked with Vectorize semantic search and Workers AI
embeddings + LLM.

Stack: TanStack Start + TanStack Router + TanStack Query · Tailwind v4 ·
Cloudflare Workers AI (via AI Gateway), Vectorize, D1 · TypeScript strict.

## Prerequisites

- Node.js LTS
- A Cloudflare account and `wrangler login` (AI + Vectorize run remotely; D1 is local)
- Cloudflare resources created once (see setup below)

## One-time setup

```sh
pnpm exec wrangler login
pnpm exec wrangler vectorize create rag-search-db-product-index --dimensions=768 --metric=cosine
pnpm install
pnpm cf-typegen   # regenerate worker-configuration.d.ts from wrangler.jsonc
pnpm seed         # create + fill the local D1 products table
```

`d1_databases.database_id` in `wrangler.jsonc` must match your D1 database —
create it with `pnpm exec wrangler d1 create rag-search-db` if you don't have one.

## Run the demo

```sh
pnpm dev
```

Then open http://localhost:3000 and chat, or load the vector index first:

```sh
curl -X POST http://localhost:3000/api/ingest
# {"inserted":27,"count":27}
```

`/api/ingest` is idempotent — it reads all products from D1, embeds
`name. brand category shape color material. description` with
`@cf/baai/bge-base-en-v1.5` (768 dims) and upserts them into the
`rag-search-db-product-index` Vectorize index with `{ productId }` metadata.
Note: after the first-ever ingest into an index, Vectorize merges staged
vectors asynchronously — chats may return no matches for up to a minute.
Subsequent ingests are searchable immediately.

Chat over HTTP:

```sh
curl -X POST http://localhost:3000/api/chat \
  -H 'content-type: application/json' \
  -d '{"query":"best polarized sunglasses for driving"}'
```

Returns `{ "reply": "...", "products": [...] }` — the reply comes from
`@cf/meta/llama-3.3-70b-instruct-fp8-fast`, constrained to the matched
products. Both AI calls route through the `rag-search-demo-gateway`
AI Gateway (caching, logs, analytics):

```sh
# inspect recent gateway requests (model, tokens, cost, cache hits)
cf ai-gateway logs list --gateway-id rag-search-demo-gateway
```

## Architecture

Query journey — what happens when a user asks "best polarized sunglasses for driving":

```
Browser                Worker (src/server-entry.ts)          Cloudflare
───────                ───────────────────────────           ──────────
1. useMutation ──POST /api/chat──▶ handleChat (api.ts)
                          │
                          ▼ 2. embed query
                    AI.run(bge-base-en-v1.5) ── gateway ─▶  Workers AI → 768-dim vector
                          │        ("driving…polarized…glare" as 768 floats)
                          ▼ 3. semantic search
                    VECTORIZE.query(vec, topK: 6) ────────▶  Vectorize → cosine nearest
                          │         neighbors: [ray-ban-chromance…, oakley-holbrook…]
                          ▼ 4. hydrate rows
                    DB.prepare("…WHERE id IN (?,?,?,?,?,?)")▶ D1 → full product rows
                          │
                          ▼ 5. build prompt + call LLM
                    AI.run(llama-3.3-70b, {messages}) ─ gateway ─▶  Workers AI → natural reply
                          │
6. renders reply  ◀──JSON {reply, products}──┘
   + product cards
```

The LLM only sees the 6 retrieved products — it cannot invent SKUs, and the
system prompt instructs it to say so if nothing fits. Ingestion path:

```
POST /api/chat
  query → embed (Workers AI bge-base-en-v1.5)
        → Vectorize rag-search-db-product-index topK=6
        → map vector ids → D1 products lookup
        → prompt (ShadeFinder system prompt + up to 6 history messages + product lines)
        → LLM (llama-3.3-70b-instruct-fp8-fast, non-streaming, via AI Gateway)
        → { reply, products }

POST /api/ingest
  D1 products → embed in batches of 16 → VECTORIZE.upsert (idempotent)
```

- `src/server-entry.ts` — worker entry; routes `/api/*` to handlers, everything
  else falls through to TanStack Start's handler
- `src/server/rag.ts` — embeddings, Vectorize query, D1 lookups, LLM answer
  (uses `env` from `cloudflare:workers`)
- `src/server/api.ts` — HTTP handlers (JSON in/out, validation, errors)
- `src/components/ShadeFinder.tsx` — chat UI (TanStack Query `useMutation`)
- `d1/seed.sql` — 27 products, applied locally via `pnpm seed`

Cloudflare bindings (see `wrangler.jsonc`): `DB` (D1), `VECTORIZE`
(rag-search-db-product-index), `AI` (Workers AI). AI + Vectorize are marked `remote: true`
because neither is simulated locally; D1 runs on Miniflare.

## Useful commands

```sh
pnpm typecheck                # tsc --noEmit
pnpm build                    # vite build (worker + client)
pnpm preview                  # build + vite preview
pnpm seed                     # re-apply seed data (idempotent)
pnpm exec wrangler d1 execute rag-search-db --local --command "SELECT COUNT(*) FROM products"
```

## Cleanup

```sh
pnpm exec wrangler vectorize delete rag-search-db-product-index
pnpm exec wrangler d1 delete rag-search-db
cf ai-gateway gateways delete rag-search-demo-gateway --force
```
