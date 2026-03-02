'use client'

import { Add01Icon, Comment01Icon, FavouriteIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Input } from '@propet/ui'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { getPostLayoutIds, PostCard } from '@/components/post-card'

export interface WaterfallPost {
  id: string
  title: string
  author: string
  likes: string
  coverHeight: number
  coverImage?: string
  coverClassName?: string
  badge?: string
}

interface WaterfallFeedProps {
  posts: WaterfallPost[]
}

const COMMENT_AUTHORS = ['露露', '白桃', '饼干', '阿暖', 'Kiki', '元元']
const COMMENT_TEXTS = [
  '这个角度拍得太好了，收藏了。',
  '按你这个方法试了，确实更顺手。',
  '信息量很大，感谢分享。',
  '封面就已经很想点进来了。',
  '我家毛孩子也有同款反应，太真实了。',
  '想看后续更新，蹲一个系列。',
]
const COMMENT_TIMES = ['刚刚', '2 分钟前', '9 分钟前', '24 分钟前', '1 小时前', '今天']
const PUBLISH_TIMES = [
  '2026-02-28 21:14',
  '2026-02-27 18:42',
  '2026-02-26 10:36',
  '2026-02-25 23:08',
  '2026-02-24 08:55',
  '2026-02-23 15:20',
]

interface PostComment {
  id: string
  author: string
  content: string
  time: string
}

function createComments(post: WaterfallPost): PostComment[] {
  const seed = Number.parseInt(post.id, 10) || 0

  return Array.from({ length: 10 }).map((_, index) => {
    const author = COMMENT_AUTHORS[(seed + index) % COMMENT_AUTHORS.length]!
    const content = COMMENT_TEXTS[(seed + index * 2) % COMMENT_TEXTS.length]!
    const time = COMMENT_TIMES[(seed + index * 3) % COMMENT_TIMES.length]!

    return {
      id: `${post.id}-comment-${index}`,
      author,
      content,
      time,
    }
  })
}

function getPublishTime(post: WaterfallPost): string {
  const seed = Number.parseInt(post.id, 10) || 0
  return PUBLISH_TIMES[seed % PUBLISH_TIMES.length]!
}

export function WaterfallFeed({ posts }: WaterfallFeedProps) {
  const router = useRouter()
  const [activePost, setActivePost] = useState<WaterfallPost | null>(null)

  const activeComments = useMemo(
    () => (activePost ? createComments(activePost) : []),
    [activePost],
  )
  const activePublishTime = useMemo(
    () => (activePost ? getPublishTime(activePost) : ''),
    [activePost],
  )

  useEffect(() => {
    if (!activePost)
      return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [activePost])

  useEffect(() => {
    if (!activePost)
      return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape')
        setActivePost(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activePost])

  return (
    <LayoutGroup id="waterfall-posts">
      <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {posts.map(post => (
          <PostCard
            key={post.id}
            {...post}
            onOpen={() => setActivePost(post)}
            onAuthorClick={() => router.push(`/user/${encodeURIComponent(post.author)}`)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activePost
          ? (
              <>
                <motion.div
                  aria-hidden
                  className="fixed inset-0 z-320 bg-black/50 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActivePost(null)}
                />
                <div className="pointer-events-none fixed inset-0 z-330 flex items-center justify-center p-3 sm:p-6">
                  <motion.section
                    layoutId={getPostLayoutIds(activePost.id).card}
                    className="bg-background pointer-events-auto flex h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl"
                    onClick={event => event.stopPropagation()}
                  >
                    <div className="grid h-full w-full md:grid-cols-[1.1fr_1fr]">
                      <motion.div
                        layoutId={getPostLayoutIds(activePost.id).cover}
                        className={`relative min-h-[280px] md:min-h-full ${activePost.coverImage ? 'bg-muted' : activePost.coverClassName ?? 'bg-background'}`}
                        style={activePost.coverImage
                          ? {
                              backgroundImage: `url(${activePost.coverImage})`,
                              backgroundPosition: 'center',
                              backgroundSize: 'cover',
                            }
                          : undefined}
                      >
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                      </motion.div>

                      <div className="flex min-h-0 flex-col">
                        <div className="border-border/70 border-b py-4 px-4">
                          <div className="flex items-center justify-between gap-3">
                            <motion.div
                              layoutId={getPostLayoutIds(activePost.id).meta}
                              className="flex min-w-0 items-center gap-2"
                            >
                              <span className="bg-primary text-primary-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                                {activePost.author.slice(0, 1)}
                              </span>
                              <span className="truncate text-base font-semibold">{activePost.author}</span>
                            </motion.div>

                            <Button size="lg" className="rounded-full">
                              <HugeiconsIcon icon={Add01Icon} size={14} />
                              关注
                            </Button>
                          </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
                          <div className="space-y-6">
                            <section>
                              <div className="mb-3 flex items-center gap-2">
                                {activePost.badge
                                  ? (
                                      <motion.span
                                        layoutId={getPostLayoutIds(activePost.id).badge}
                                        className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-xs font-medium"
                                      >
                                        {activePost.badge}
                                      </motion.span>
                                    )
                                  : null}
                                <motion.h2 layoutId={getPostLayoutIds(activePost.id).title} className="text-xl leading-tight font-semibold">
                                  {activePost.title}
                                </motion.h2>
                              </div>

                              <p className="text-muted-foreground text-sm leading-6">
                                这是展开后的帖子详情区域。你可以在这里放正文、图文步骤、购买清单或遛狗路线笔记，
                                保持信息完整但阅读轻盈。
                              </p>
                              <p className="text-muted-foreground mt-3 text-xs">
                                发布于
                                {' '}
                                {activePublishTime}
                              </p>
                            </section>

                            <section>
                              <h3 className="mb-3 text-sm font-semibold">
                                评论（
                                {activeComments.length}
                                ）
                              </h3>
                              <div className="space-y-4">
                                {activeComments.map(comment => (
                                  <article key={comment.id} className="bg-muted/45 rounded-2xl px-4 py-3">
                                    <div className="mb-1 flex items-center justify-between gap-2">
                                      <span className="text-sm font-medium">{comment.author}</span>
                                      <span className="text-muted-foreground text-xs">{comment.time}</span>
                                    </div>
                                    <p className="text-sm leading-6">{comment.content}</p>
                                  </article>
                                ))}
                              </div>
                            </section>
                          </div>
                        </div>

                        <div className="border-border/70 bg-muted/30 border-t px-5 py-3 sm:px-6">
                          <div className="flex items-center gap-3">
                            <Input
                              placeholder="写评论，分享你的经验..."
                              className="h-10 flex-1 rounded-full bg-background px-4 text-sm"
                            />
                            <div className="text-muted-foreground flex shrink-0 items-center gap-3 text-sm">
                              <span className="inline-flex items-center gap-1">
                                <HugeiconsIcon icon={FavouriteIcon} size={16} />
                                {activePost.likes}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <HugeiconsIcon icon={Comment01Icon} size={16} />
                                {activeComments.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                </div>
              </>
            )
          : null}
      </AnimatePresence>
    </LayoutGroup>
  )
}
