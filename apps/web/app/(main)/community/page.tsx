'use client'

import { Add01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Tabs, TabsList, TabsTrigger } from '@propet/ui'
import { WaterfallFeed } from '@/components/waterfall-feed'

const communityTags = ['萌宠日常', '宠物穿搭', '健康养护', '洗护测评', '领养故事', '周末探店']
const petPic = (tags: string, lock: number) => `https://loremflickr.com/720/1080/${tags}?lock=${lock}`

const communityPosts = [
  {
    id: '201',
    title: '周末带崽去草地撒欢，回家直接秒睡',
    author: '团子麻麻',
    likes: '1.2k',
    coverHeight: 220,
    coverImage: petPic('dog', 201),
    badge: '推荐',
  },
  {
    id: '202',
    title: '第一次给猫咪剪指甲，居然全程超配合',
    author: '奶糕',
    likes: '846',
    coverHeight: 280,
    coverImage: petPic('cat', 202),
    badge: '教程',
  },
  {
    id: '203',
    title: '新入的宠物推车太实用了，轻松遛两只',
    author: '柚子',
    likes: '578',
    coverHeight: 200,
    coverImage: petPic('puppy', 203),
  },
  {
    id: '204',
    title: '狗狗洗澡前后对比，真的像换了一只',
    author: '阿椰',
    likes: '902',
    coverHeight: 260,
    coverImage: petPic('dog', 204),
  },
  {
    id: '205',
    title: '这家宠物友好咖啡店拍照太出片了',
    author: '眠眠',
    likes: '2.1k',
    coverHeight: 310,
    coverImage: petPic('pet', 205),
    badge: '探店',
  },
  {
    id: '206',
    title: '幼猫换粮记录：一周过渡没有软便',
    author: '鱼饼',
    likes: '634',
    coverHeight: 210,
    coverImage: petPic('kitten', 206),
  },
  {
    id: '207',
    title: '分享一个超省心的居家驱虫节奏',
    author: 'Momo',
    likes: '719',
    coverHeight: 240,
    coverImage: petPic('dog', 207),
  },
  {
    id: '208',
    title: '领养第 100 天，胆小狗狗终于愿意贴贴了',
    author: '风铃',
    likes: '3.0k',
    coverHeight: 300,
    coverImage: petPic('cat', 208),
    badge: '故事',
  },
]

export default function CommunityPage() {
  return (
    <div className="bg-background min-h-svh">
      <header className="bg-background/85 sticky top-0 z-40 backdrop-blur-lg">
        <div className="mx-auto max-w-5xl px-4 pt-3 pb-3 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <Tabs defaultValue="recommend">
              <TabsList>
                <TabsTrigger value="recommend">推荐</TabsTrigger>
                <TabsTrigger value="follow">关注</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="ghost" size="icon" className="rounded-full">
              <HugeiconsIcon icon={Add01Icon} size={20} />
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {communityTags.map(tag => (
              <button
                key={tag}
                className="bg-muted text-muted-foreground hover:text-foreground shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 sm:px-6">
        <WaterfallFeed posts={communityPosts} />
      </main>
    </div>
  )
}
