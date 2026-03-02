'use client'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Add01Icon, AtIcon, Bookmark01Icon, Comment01Icon, FavouriteIcon, Navigation03Icon, Share01Icon, SmileIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Input } from '@propet/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@propet/ui/components/popover'
import { motion } from 'motion/react'
import { useState } from 'react'
import { getPostLayoutIds } from '@/components/post-card'
import { PostCommentItem } from '@/components/post-comment-item'

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleEmojiSelect = (emoji: { native?: string }) => {
    if (!emoji.native)
      return
    setCommentText(prev => prev + emoji.native)
    setShowEmojiPicker(false)
  }

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
                      <span className="bg-primary text-primary-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                        {post.author.slice(0, 1)}
                      </span>
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
                      {post.badge
                        ? (
                            <motion.span
                              layoutId={layoutIds.badge}
                              className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-xs font-medium"
                            >
                              {post.badge}
                            </motion.span>
                          )
                        : null}
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
                    <div className="space-y-4">
                      {comments.map(comment => (
                        <PostCommentItem
                          key={comment.id}
                          author={comment.author}
                          content={comment.content}
                          time={comment.time}
                          likeCount={comment.likeCount}
                          commentCount={comment.commentCount}
                          isReply={comment.isReply}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
                <div className="border-border/70 bg-background/70 supports-backdrop-filter:bg-background/55 pointer-events-auto border-t px-4 py-3 backdrop-blur-xl">
                  <div className="space-y-2.5">
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <HugeiconsIcon icon={FavouriteIcon} size={24} />
                        {post.likes}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <HugeiconsIcon icon={Comment01Icon} size={24} />
                        {comments.length}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <HugeiconsIcon icon={Bookmark01Icon} size={20} />
                        {post.likes}
                      </span>
                      <span>
                        <HugeiconsIcon icon={Share01Icon} size={20} />
                        <span className="sr-only">分享</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                          >
                            <HugeiconsIcon icon={SmileIcon} size={20} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          align="start"
                          sideOffset={8}
                          className="z-340 w-auto gap-0 overflow-hidden rounded-2xl border p-0 shadow-xl"
                          onOpenAutoFocus={event => event.preventDefault()}
                        >
                          <Picker
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                            previewPosition="none"
                            skinTonePosition="none"
                          />
                        </PopoverContent>
                      </Popover>
                      <Button size="icon" variant="ghost">
                        <HugeiconsIcon icon={AtIcon} size={20} />
                      </Button>
                      <div className="min-w-0 flex-1">
                        <Input
                          placeholder="写评论"
                          className="h-10 rounded-full bg-background px-4 text-sm"
                          value={commentText}
                          onChange={event => setCommentText(event.target.value)}
                        />
                      </div>
                      <Button className="size-10 rounded-full">
                        <HugeiconsIcon icon={Navigation03Icon} size={16} />
                        <span className="sr-only">发送</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  )
}
