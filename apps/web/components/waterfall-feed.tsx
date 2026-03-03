'use client'

import { AnimatePresence, LayoutGroup } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ExpandedPostCard } from '@/components/expanded-post-card'
import { PostCard } from '@/components/post-card'

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
  likeCount: number
  commentCount: number
  isReply: boolean
}

function createComments(post: WaterfallPost): PostComment[] {
  const seed = Number.parseInt(post.id, 10) || 0

  return Array.from({ length: 10 }).map((_, index) => {
    const author = COMMENT_AUTHORS[(seed + index) % COMMENT_AUTHORS.length]!
    const content = COMMENT_TEXTS[(seed + index * 2) % COMMENT_TEXTS.length]!
    const time = COMMENT_TIMES[(seed + index * 3) % COMMENT_TIMES.length]!
    const likeCount = (seed * 3 + index * 7) % 99
    const commentCount = (seed + index * 5) % 16
    const isReply = index % 3 === 2

    return {
      id: `${post.id}-comment-${index}`,
      author,
      content,
      time,
      likeCount,
      commentCount,
      isReply,
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
            className="mb-4"
          />
        ))}
      </div>

      <AnimatePresence>
        {activePost
          ? (
              <ExpandedPostCard
                post={activePost}
                comments={activeComments}
                publishTime={activePublishTime}
                onClose={() => setActivePost(null)}
              />
            )
          : null}
      </AnimatePresence>
    </LayoutGroup>
  )
}
