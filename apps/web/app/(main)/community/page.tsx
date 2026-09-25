'use client'

import { useState } from 'react'
import { WaterfallFeed } from '@/components/waterfall-feed'

const communityTags = ['萌宠日常', '宠物穿搭', '健康养护', '洗护测评', '领养故事', '周末探店']
const communityFilters = ['推荐', '关注', ...communityTags]
const petPic = (tags: string, lock: number) => `https://loremflickr.com/720/1080/${tags}?lock=${lock}`

const communityPosts = [
  { id: '201', title: '周末带崽去草地撒欢，回家直接秒睡', author: '团子麻麻', likes: '1.2k', coverHeight: 220, coverImage: petPic('dog', 201), badge: '推荐' },
  { id: '202', title: '第一次给猫咪剪指甲，居然全程超配合', author: '奶糕', likes: '846', coverHeight: 280, coverImage: petPic('cat', 202), badge: '教程' },
  { id: '203', title: '新入的宠物推车太实用了，轻松遛两只', author: '柚子', likes: '578', coverHeight: 200, coverImage: petPic('puppy', 203) },
  { id: '204', title: '狗狗洗澡前后对比，真的像换了一只', author: '阿椰', likes: '902', coverHeight: 260, coverImage: petPic('dog', 204) },
  { id: '205', title: '这家宠物友好咖啡店拍照太出片了', author: '眠眠', likes: '2.1k', coverHeight: 310, coverImage: petPic('pet', 205), badge: '探店' },
  { id: '206', title: '幼猫换粮记录：一周过渡没有软便', author: '鱼饼', likes: '634', coverHeight: 210, coverImage: petPic('kitten', 206) },
  { id: '207', title: '分享一个超省心的居家驱虫节奏', author: 'Momo', likes: '719', coverHeight: 240, coverImage: petPic('dog', 207) },
  { id: '208', title: '领养第 100 天，胆小狗狗终于愿意贴贴了', author: '风铃', likes: '3.0k', coverHeight: 300, coverImage: petPic('cat', 208), badge: '故事' },
]

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState('推荐')

  return (
    <div className="bg-background min-h-svh">
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 sm:px-7 sm:pt-6">
        <nav aria-label="内容分类" className="mb-5 flex items-center justify-start gap-2 overflow-x-auto py-1 sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {communityFilters.map((filter, index) => (
            <span key={filter} className="flex shrink-0 items-center gap-2">
              {index === 2 && <span aria-hidden className="bg-border h-5 w-px" />}
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
        <WaterfallFeed posts={communityPosts} />
      </main>
    </div>
  )
}
