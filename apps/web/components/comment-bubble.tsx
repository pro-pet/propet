import type { ReactNode } from 'react'
import { Avatar } from '@propet/ui'

interface CommentBubbleProps {
  author: string
  content: ReactNode
  time?: ReactNode
  isReply?: boolean
  avatarSrc?: string | null
  bubbleClassName?: string
  meta?: ReactNode
  showAuthor?: boolean
}

const AVATAR_STYLES = [
  'bg-primary/15 text-primary',
  'bg-emerald-500/15 text-emerald-700',
  'bg-orange-500/15 text-orange-700',
  'bg-sky-500/15 text-sky-700',
  'bg-rose-500/15 text-rose-700',
  'bg-violet-500/15 text-violet-700',
]

function getAvatarStyle(author: string) {
  const seed = Array.from(author).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return AVATAR_STYLES[seed % AVATAR_STYLES.length]!
}

export function CommentBubble({
  author,
  content,
  time,
  isReply = false,
  avatarSrc,
  bubbleClassName,
  meta,
  showAuthor = true,
}: CommentBubbleProps) {
  const defaultBubbleClass = isReply
    ? 'relative inline-block max-w-[95%] rounded-2xl rounded-tr-none bg-background px-3 py-2 ring-1 ring-border/70'
    : 'relative inline-block max-w-[95%] rounded-2xl rounded-tl-none bg-primary text-primary-foreground px-3 py-2'

  return (
    <article className="py-1">
      <div className={`flex items-start gap-3 ${isReply ? 'flex-row-reverse' : ''}`}>
        {avatarSrc
          ? <Avatar src={avatarSrc} name={author} className="size-8 shrink-0" />
          : <span className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarStyle(author)}`}>{author.slice(0, 1)}</span>}

        <div className={`min-w-0 flex-1 ${isReply ? 'flex flex-col items-end' : ''}`}>
          {showAuthor && (
            <div className={`mb-1 flex w-full items-center gap-2 ${isReply ? 'justify-end' : ''}`}>
              <span className="truncate text-sm font-medium">{author}</span>
            </div>
          )}
          <div className={bubbleClassName ?? defaultBubbleClass}>
            <p className="text-sm leading-6">{content}</p>
          </div>
          {(time || meta) && (
            <div className={`text-muted-foreground mt-1 flex items-center gap-3 text-xs ${isReply ? 'justify-end' : ''}`}>
              {time && <span>{time}</span>}
              {meta}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
