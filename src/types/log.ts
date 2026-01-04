export interface Log {
  id: string
  source: string
  timestamp: string
  content: Record<string, any>
}

export interface SearchLogRequest {
  page: number
  page_size: number
  source?: string
  keyword?: string
  metadata?: string // JSON string
}

export interface SearchLogResponse {
  logs: Log[]
  total: number
}

export interface WriteLogRequest {
  source: string
  level: string
  content: string
  metadata?: Record<string, any>
}

export interface WriteLogResponse {
  ok: boolean
}
