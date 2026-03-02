import { Comment01Icon, FavouriteIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface PostCommentItemProps {
  author: string
  content: string
  time: string
  likeCount: number
  commentCount: number
  isReply?: boolean
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

export function PostCommentItem({
  author,
  content,
  time,
  likeCount,
  commentCount,
  isReply = false,
}: PostCommentItemProps) {
  const bubbleClass = isReply
    ? 'relative inline-block max-w-[95%] rounded-2xl rounded-tr-none bg-background px-3 py-2 ring-1 ring-border/70'
    : 'relative inline-block max-w-[95%] rounded-2xl rounded-tl-none bg-primary text-primary-foreground px-3 py-2'

  return (
    <article className="py-1">
      <div className={`flex items-start gap-3 ${isReply ? 'flex-row-reverse' : ''}`}>
        <span className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarStyle(author)}`}>
          {author.slice(0, 1)}
        </span>

        <div className={`min-w-0 flex-1 ${isReply ? 'flex flex-col items-end' : ''}`}>
          <div className={`mb-1 flex w-full items-center gap-2 ${isReply ? 'justify-end' : ''}`}>
            <span className="truncate text-sm font-medium">{author}</span>
          </div>
          <div className={bubbleClass}>
            <p className="text-sm leading-6">{content}</p>
          </div>
          <div className={`text-muted-foreground mt-1 flex items-center gap-3 text-xs ${isReply ? 'justify-end' : ''}`}>
            <span>{time}</span>
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon icon={Comment01Icon} size={12} />
              {commentCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon icon={FavouriteIcon} size={12} />
              {likeCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
