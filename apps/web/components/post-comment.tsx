import { Comment01Icon, FavouriteIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { CommentBubble } from '@/components/comment-bubble'

interface PostCommentItemProps {
  author: string
  content: string
  time: string
  likeCount: number
  commentCount: number
  isReply?: boolean
}

export function PostComment({
  author,
  content,
  time,
  likeCount,
  commentCount,
  isReply = false,
}: PostCommentItemProps) {
  return (
    <CommentBubble
      author={author}
      content={content}
      time={time}
      isReply={isReply}
      meta={(
        <>
          <span className="inline-flex items-center gap-1">
            <HugeiconsIcon icon={Comment01Icon} size={12} />
            {commentCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <HugeiconsIcon icon={FavouriteIcon} size={12} />
            {likeCount}
          </span>
        </>
      )}
    />
  )
}
