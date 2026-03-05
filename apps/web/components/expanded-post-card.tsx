'use client'

import { Add01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button } from '@propet/ui'
import { motion } from 'motion/react'
import { getPostLayoutIds } from '@/components/post-card'
import { PostComment } from '@/components/post-comment'
import { PostEngagementBar } from '@/components/post-engagement-bar'

interface ExpandedPostCardPost {
  id: string
  title: string
  author: string
  likes: string
  coverImage?: string
  coverClassName?: string
  badge?: string
}

interface ExpandedPostCardComment {
  id: string
  author: string
  content: string
  time: string
  likeCount: number
  commentCount: number
  isReply: boolean
}

interface ExpandedPostCardProps {
  post: ExpandedPostCardPost
  comments: ExpandedPostCardComment[]
  publishTime: string
  onClose: () => void
}

export function ExpandedPostCard({
  post,
  comments,
  publishTime,
  onClose,
}: ExpandedPostCardProps) {
  const layoutIds = getPostLayoutIds(post.id)

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-0 z-320 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className="pointer-events-none fixed inset-0 z-330 flex items-center justify-center p-3 sm:p-6">
        <motion.section
          layoutId={layoutIds.card}
          className="bg-background pointer-events-auto flex h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl"
          onClick={event => event.stopPropagation()}
        >
          <div className="grid h-full w-full md:grid-cols-[1.1fr_1fr]">
            <motion.div
              layoutId={layoutIds.cover}
              className={`relative z-30 min-h-[280px] md:min-h-full ${post.coverImage ? 'bg-muted' : post.coverClassName ?? 'bg-background'}`}
              style={post.coverImage
                ? {
                    backgroundImage: `url(${post.coverImage})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }
                : undefined}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>

            <div className="relative min-h-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
                <div className="border-border/70 bg-background/70 supports-backdrop-filter:bg-background/55 pointer-events-auto border-b px-4 py-3 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3">
                    <motion.div
                      layoutId={layoutIds.meta}
                      className="flex min-w-0 items-center gap-2"
                    >
                      <Avatar
                        size="lg"
                        name={post.author}
                        fallback={post.author.slice(0, 1)}
                      />
                      <span className="truncate text-base font-semibold">{post.author}</span>
                    </motion.div>

                    <Button size="lg" className="rounded-full">
                      <HugeiconsIcon icon={Add01Icon} size={14} />
                      关注
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-full overflow-y-auto px-5 pt-20 pb-40 sm:px-6">
                <div className="space-y-6">
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      {post.badge && (
                        <motion.span
                          layoutId={layoutIds.badge}
                          className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {post.badge}
                        </motion.span>
                      )}
                      <motion.h2 layoutId={layoutIds.title} className="text-xl leading-tight font-semibold">
                        {post.title}
                      </motion.h2>
                    </div>

                    <p className="text-muted-foreground text-sm leading-6">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum aperiam qui explicabo eveniet nobis! Quisquam aperiam cupiditate, nulla sit nisi exercitationem a asperiores est iste molestiae architecto laboriosam, officia ducimus?
                    </p>
                    <p className="text-muted-foreground mt-3 text-xs">
                      发布于
                      {' '}
                      {publishTime}
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-3 text-sm font-semibold">{`${comments.length}条评论`}</h3>
                    {comments.map(comment => (
                      <PostComment
                        key={comment.id}
                        author={comment.author}
                        content={comment.content}
                        time={comment.time}
                        likeCount={comment.likeCount}
                        commentCount={comment.commentCount}
                        isReply={comment.isReply}
                      />
                    ))}
                  </section>
                </div>
              </div>

              <PostEngagementBar
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
                likes={post.likes}
                commentCount={comments.length}
                bookmarkCount={post.likes}
              />
            </div>
          </div>
        </motion.section>
      </div>
    </>
  )
}
