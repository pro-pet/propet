'use client'

import {
  Copy01Icon,
  GridIcon,
  Settings01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button } from '@propet/ui'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
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
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-5xl px-5">
        {/* Profile header */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex gap-5 pt-6 pb-5"
        >
          <div className="relative shrink-0 self-center">
            <div className="from-primary/50 via-primary/20 to-primary/50 rounded-full bg-gradient-to-br p-[3px]">
              <Avatar
                src={mockUser.avatar}
                name={mockUser.name}
                className="size-[86px] ring-[3px] ring-background"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h1 className="truncate text-xl font-bold tracking-tight">{mockUser.name}</h1>
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="size-8 rounded-full">
                  <HugeiconsIcon icon={Settings01Icon} size={18} />
                </Button>
              </Link>
            </div>
            <button
              onClick={copyUid}
              className="mt-0.5 inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="text-xs tabular-nums">{UID}</span>
              <HugeiconsIcon
                icon={copied ? Tick02Icon : Copy01Icon}
                size={12}
                className={copied ? 'text-primary' : ''}
              />
            </button>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm">
                <span className="font-bold tabular-nums">{formatCount(mockUser.posts)}</span>
                <span className="text-muted-foreground ml-0.5">帖子</span>
              </span>
              <span className="text-sm">
                <span className="font-bold tabular-nums">{formatCount(mockUser.followers)}</span>
                <span className="text-muted-foreground ml-0.5">粉丝</span>
              </span>
              <span className="text-sm">
                <span className="font-bold tabular-nums">{formatCount(mockUser.following)}</span>
                <span className="text-muted-foreground ml-0.5">关注</span>
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed">{mockUser.bio}</p>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex gap-2 pb-6"
        >
          <Button
            variant="secondary"
            className="h-9 flex-1 rounded-full text-sm font-medium"
          >
            编辑资料
          </Button>
          <Button
            variant="secondary"
            className="h-9 flex-1 rounded-full text-sm font-medium"
          >
            分享主页
          </Button>
        </motion.div>

        <div className="my-5 h-px bg-border/60" />

        <div className="flex items-center justify-center gap-8 pb-4">
          <div className="inline-flex items-center gap-1.5 pb-1 text-sm font-medium text-foreground border-b-2 border-foreground">
            <HugeiconsIcon icon={GridIcon} size={16} />
            帖子
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="pb-28"
        >
          <WaterfallFeed posts={mockPosts} />
        </motion.div>
      </div>
    </div>
  )
}
