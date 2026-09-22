'use client'

import { Bookmark01Icon, Copy01Icon, GridIcon, HeartCheckIcon, Settings01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button } from '@propet/ui'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { PageSearch } from '@/components/page-search'
import { WaterfallFeed } from '@/components/waterfall-feed'

const UID = 'PP-83927461'
const mockUser = {
  name: '团子麻麻',
  avatar: 'https://i.pravatar.cc/200?u=propet-me',
  bio: '三只毛孩子的快乐铲屎官 🐾 分享日常养宠心得',
  followers: 1283,
  following: 526,
  posts: 47,
}
const petPic = (tag: string, lock: number) => `https://loremflickr.com/720/1080/${tag}?lock=${lock}`
const mockPosts = [
  { id: 'p1', title: '今天带团子去公园啦', author: '团子麻麻', likes: '1.2k', coverHeight: 210, coverImage: petPic('dog', 301) },
  { id: 'p2', title: '奶盖的新衣服', author: '团子麻麻', likes: '846', coverHeight: 280, coverImage: petPic('cat', 302) },
  { id: 'p3', title: '薯条学会了握手！', author: '团子麻麻', likes: '578', coverHeight: 200, coverImage: petPic('puppy', 303) },
  { id: 'p4', title: '周末遛弯日记', author: '团子麻麻', likes: '902', coverHeight: 260, coverImage: petPic('dog', 304) },
  { id: 'p5', title: '午睡中的奶盖', author: '团子麻麻', likes: '2.1k', coverHeight: 240, coverImage: petPic('cat', 305) },
  { id: 'p6', title: '团子 vs 薯条大战', author: '团子麻麻', likes: '634', coverHeight: 220, coverImage: petPic('puppy', 306) },
]

function formatCount(n: number) {
  if (n >= 10000)
    return `${(n / 10000).toFixed(1)}w`
  if (n >= 1000)
    return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default function MinePage() {
  const [copied, setCopied] = useState(false)
  const copyUid = useCallback(() => {
    navigator.clipboard.writeText(UID).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [])

  return (
    <div className="bg-background min-h-svh">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <header className="sticky top-0 z-[120] flex h-24 items-center">
          <PageSearch />
        </header>

        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="pt-7 pb-5">
          <div className="flex items-start gap-4 sm:gap-6">
            <Avatar src={mockUser.avatar} name={mockUser.name} className="ring-primary/20 size-[82px] ring-4 sm:size-24" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{mockUser.name}</h1>
              <button onClick={copyUid} className="text-muted-foreground mt-1 inline-flex items-center gap-1 text-xs tabular-nums transition-colors hover:text-foreground">
                {UID}
                <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} className={copied ? 'text-primary' : ''} />
              </button>
              <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-relaxed">{mockUser.bio}</p>
            </div>
          </div>
          <div className="bg-muted/50 mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl py-3 text-center">
            <span>
              <strong className="block text-base">
                {formatCount(mockUser.posts)}
              </strong>
              <small className="text-muted-foreground text-xs">笔记</small>
            </span>
            <span>
              <strong className="block text-base">
                {formatCount(mockUser.followers)}
              </strong>
              <small className="text-muted-foreground text-xs">粉丝</small>
            </span>
            <span>
              <strong className="block text-base">
                {formatCount(mockUser.following)}
              </strong>
              <small className="text-muted-foreground text-xs">关注</small>
            </span>
          </div>
        </motion.section>

        <div className="flex justify-end pb-3">
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="size-9 rounded-full">
              <HugeiconsIcon icon={Settings01Icon} size={19} />
              <span className="sr-only">设置</span>
            </Button>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.3 }} className="flex gap-2 pb-5">
          <Button className="h-10 flex-1 rounded-full text-sm font-semibold">编辑资料</Button>
          <Button variant="outline" className="h-10 flex-1 rounded-full text-sm font-semibold">分享主页</Button>
        </motion.div>

        <div className="border-y border-border/60">
          <div className="grid grid-cols-3">
            <button className="relative flex h-12 items-center justify-center gap-1.5 text-sm font-semibold after:absolute after:bottom-0 after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
              <HugeiconsIcon icon={GridIcon} size={16} />
              笔记
            </button>
            <button className="text-muted-foreground hover:text-foreground flex h-12 items-center justify-center gap-1.5 text-sm">
              <HugeiconsIcon icon={Bookmark01Icon} size={16} />
              收藏
            </button>
            <button className="text-muted-foreground hover:text-foreground flex h-12 items-center justify-center gap-1.5 text-sm">
              <HugeiconsIcon icon={HeartCheckIcon} size={16} />
              喜欢
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pb-28 pt-5">
          <WaterfallFeed posts={mockPosts} />
        </motion.div>
      </div>
    </div>
  )
}
