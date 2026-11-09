export interface Product {
  id: string
  name: string
  brand: string
  category: string
  shape: string
  color: string
  material: string
  price: number
  rating: number
  description: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequestBody {
  query: string
  history?: ChatMessage[]
}

export interface ChatResponseBody {
  reply: string
  products: Product[]
}

export interface IngestResponseBody {
  inserted: number
  count: number
}

export interface ApiError {
  error: string
}
