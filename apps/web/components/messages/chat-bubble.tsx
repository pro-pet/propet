import type { ChatMessage } from './types'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { CommentBubble } from '@/components/comment-bubble'

interface ChatBubbleProps {
  message: ChatMessage
  avatar: string
  name: string
}

export function ChatBubble({ message, avatar, name }: ChatBubbleProps) {
  const isMine = message.from === 'me'

  return (
    <CommentBubble
      author={name}
      content={message.text}
      time={message.time}
      isReply={isMine}
      avatarSrc={avatar}
      showAuthor={false}
      bubbleClassName={`inline-block max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${isMine ? 'rounded-tr-none bg-primary text-primary-foreground' : 'rounded-tl-none bg-muted text-foreground'}`}
      meta={isMine && message.read ? <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className="text-primary" /> : undefined}
    />
  )
}
