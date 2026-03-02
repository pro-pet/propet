'use client'

import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Input } from '@propet/ui'
import { WaterfallFeed } from '@/components/waterfall-feed'

const discoverTabs = ['推荐', '狗狗', '猫咪', '穿搭', '探店', '摄影', '清洁', '旅行']
const recentSearches = ['幼猫喂养', '狗狗零食', '猫咪洗护', '宠物友好露营']
const petPic = (tags: string, lock: number) => `https://loremflickr.com/720/1080/${tags}?lock=${lock}`

const discoverPosts = [
  {
    id: '301',
    title: '奶油小狗出门穿搭合集，拍照超乖',
    author: '元气桃',
    likes: '988',
    coverHeight: 250,
    coverImage: petPic('dog', 301),
    badge: '穿搭',
  },
  {
    id: '302',
    title: '这份猫咪主食罐头对比表太实用了',
    author: '西瓜皮',
    likes: '1.4k',
    coverHeight: 300,
    coverImage: petPic('cat', 302),
    badge: '测评',
  },
  {
    id: '303',
    title: '周末宠物市集打卡，周边都超可爱',
    author: '米团',
    likes: '673',
    coverHeight: 220,
    coverImage: petPic('pet', 303),
  },
  {
    id: '304',
    title: '新手猫家长必看：日常清洁清单整理',
    author: '小栗',
    likes: '2.0k',
    coverHeight: 290,
    coverImage: petPic('kitten', 304),
    badge: '干货',
  },
  {
    id: '305',
    title: '宠物友好民宿分享，带狗狗也能住得舒服',
    author: 'Nori',
    likes: '812',
    coverHeight: 320,
    coverImage: petPic('dog', 305),
  },
  {
    id: '306',
    title: '猫抓板摆放位置这样选，家里少掉渣',
    author: '林夏',
    likes: '531',
    coverHeight: 210,
    coverImage: petPic('cat', 306),
  },
  {
    id: '307',
    title: '狗狗社交课记录：从怕生到主动打招呼',
    author: '豆芽',
    likes: '1.1k',
    coverHeight: 260,
    coverImage: petPic('puppy', 307),
  },
  {
    id: '308',
    title: '把宠物零食柜整理成展示墙，太治愈了',
    author: '雪团',
    likes: '759',
    coverHeight: 280,
    coverImage: petPic('pet', 308),
    badge: '收纳',
  },
  {
    id: '309',
    title: '猫咪体检前准备事项，一张图全看懂',
    author: '阿柒',
    likes: '648',
    coverHeight: 230,
    coverImage: petPic('cat', 309),
  },
  {
    id: '310',
    title: '适合春天的轻量遛狗路线，空气很好',
    author: '丸子酱',
    likes: '905',
    coverHeight: 300,
    coverImage: petPic('dog', 310),
    badge: '路线',
  },
]

export default function DiscoverPage() {
  return (
    <div className="bg-background min-h-svh">
      <header className="bg-background/85 sticky top-0 z-40 backdrop-blur-lg">
        <div className="mx-auto max-w-5xl px-4 pt-3 pb-3 sm:px-6">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2"
            />
            <Input
              placeholder="搜一搜今天的宠物灵感"
              className="bg-muted/50 h-12 rounded-full border pr-4 pl-11 text-[15px]"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {discoverTabs.map((tab, index) => (
              <button
                key={tab}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  index === 0
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/10 text-primary hover:bg-primary/15'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pt-4 pb-28 sm:px-6">
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-muted-foreground shrink-0 text-xs">最近搜索</span>
          {recentSearches.map(keyword => (
            <button
              key={keyword}
              className="bg-primary/10 text-primary hover:bg-primary/15 shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors"
            >
              {keyword}
            </button>
          ))}
        </div>

        <WaterfallFeed posts={discoverPosts} />
      </main>
    </div>
  )
}
