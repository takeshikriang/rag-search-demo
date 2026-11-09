import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import type { ChatMessage, ChatResponseBody, Product } from '../server/types'

interface ShadeFinderMessage extends ChatMessage {
  products: Product[]
}

const SUGGESTED_QUERIES = [
  'Best polarized sunglasses for driving',
  'Blue-light glasses under $100',
  'Lightweight titanium frames',
  'Sport sunglasses for running',
]

async function sendChat(query: string, history: ChatMessage[]): Promise<ChatResponseBody> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, history }),
  })
  if (!response.ok) {
    throw new Error(`Chat request failed (${response.status})`)
  }
  return (await response.json()) as ChatResponseBody
}

export default function ShadeFinder() {
  const [messages, setMessages] = useState<ShadeFinderMessage[]>([
    {
      role: 'assistant',
      content:
        'Hi, I am ShadeFinder! Ask me about sunglasses, eyeglasses, or blue-light glasses and I will find your perfect pair.',
      products: [],
    },
  ])
  const [input, setInput] = useState('')

  const mutation = useMutation({
    mutationFn: ({ query, history }: { query: string; history: ChatMessage[] }) =>
      sendChat(query, history),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, products: data.products },
      ])
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong while searching. Please try again.',
          products: [],
        },
      ])
    },
  })

  function submit(text: string) {
    const query = text.trim()
    if (!query || mutation.isPending) return
    const history: ChatMessage[] = messages.slice(-6).map(({ role, content }) => ({ role, content }))
    setMessages((prev) => [...prev, { role: 'user', content: query, products: [] }])
    setInput('')
    mutation.mutate({ query, history })
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    submit(input)
  }

  return (
    <main className="mx-auto flex h-screen max-w-3xl flex-col px-4">
      <header className="flex items-center gap-3 border-b border-slate-200 py-4">
        <span className="text-2xl">🕶️</span>
        <div>
          <h1 className="text-lg font-bold text-slate-900">ShadeFinder</h1>
          <p className="text-xs text-slate-500">AI eyewear shopping assistant</p>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto py-6">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {mutation.isPending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-400 shadow-sm ring-1 ring-slate-200">
              Searching the collection…
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 pb-3">
          {SUGGESTED_QUERIES.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => submit(suggestion)}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 py-4">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Try “polarized aviators for driving”…"
          className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-900"
        />
        <button
          type="submit"
          disabled={mutation.isPending || input.trim().length === 0}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </main>
  )
}

function MessageBubble({ message }: { message: ShadeFinderMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={
          isUser
            ? 'max-w-[80%] rounded-2xl rounded-br-md bg-slate-900 px-4 py-3 text-sm text-white'
            : 'max-w-[80%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200'
        }
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.products.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">{product.name}</p>
        <p className="text-sm font-bold text-slate-900">${product.price.toFixed(2)}</p>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">
        {product.brand} · {product.category} · ★ {product.rating.toFixed(1)}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{product.description}</p>
    </div>
  )
}
