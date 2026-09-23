export interface ChatMessage {
  id: string
  text: string
  time: string
  from: 'them' | 'me'
  read?: boolean
}

export interface Chat {
  id: string
  name: string
  handle: string
  avatar: string
  preview: string
  time: string
  unread?: number
  online?: boolean
  messages: ChatMessage[]
}
