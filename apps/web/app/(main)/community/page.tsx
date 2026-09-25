'use client'

import { useState } from 'react'
import { WaterfallFeed } from '@/components/waterfall-feed'
import { usePosts } from '@/lib/api/posts'

const communityTags = ['萌宠日常', '宠物穿搭', '健康养护', '洗护测评', '领养故事', '周末探店']
const communityFilters = ['推荐', '关注', ...communityTags]
export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState('推荐')
  const postsQuery = usePosts({ pageIndex: 0, pageSize: 24 })
  const posts = (postsQuery.data?.items ?? []).map((post, index) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.author.name || '用户',
    authorId: post.author.id,
    authorAvatar: post.author.avatar,
    pets: post.pets,
    likes: '0',
    coverHeight: 200 + (index % 4) * 35,
    coverImage: post.images[0],
  }))

  return (
    <div className="bg-background min-h-svh">
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 sm:px-7 sm:pt-6">
        <nav aria-label="内容分类" className="mb-5 flex items-center justify-start gap-2 overflow-x-auto py-1 sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {communityFilters.map((filter, index) => (
            <span key={filter} className="flex shrink-0 items-center gap-2">
              {index === 2 && <span aria-hidden className="bg-border h-5 w-0.5 rounded-full" />}
              <button
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${activeFilter === filter ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                {filter}
              </button>
            </span>
          ))}
        </nav>
        {postsQuery.isPending && <p className="text-muted-foreground py-16 text-center text-sm">正在加载社区内容…</p>}
        {postsQuery.isError && <p className="text-destructive py-16 text-center text-sm">社区内容暂时无法加载</p>}
        {!postsQuery.isPending && posts.length === 0 && <p className="text-muted-foreground py-16 text-center text-sm">还没有帖子，去发布第一条分享吧</p>}
        {posts.length > 0 && <WaterfallFeed posts={posts} />}
      </main>
    </div>
  )
}
