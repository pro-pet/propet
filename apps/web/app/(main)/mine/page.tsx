'use client'

import { Copy01Icon, Edit02Icon, MoreHorizontalIcon, Settings01Icon, Share08Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button } from '@propet/ui'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@propet/ui/components/dropdown-menu'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
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
  const { user } = useAuth()
  const profileId = user?.id ?? UID
  const profileName = user ? user.name || '用户' : mockUser.name
  const profileAvatar = user ? user.avatar : mockUser.avatar
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('笔记')
  const copyUid = useCallback(() => {
    navigator.clipboard.writeText(profileId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [profileId])

  return (
    <div className="bg-background min-h-svh">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <header className="sticky top-0 z-[120] flex h-24 items-center">
          <PageSearch />
        </header>

        <section
          className="relative mx-auto max-w-3xl py-10 sm:py-14"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
            <Avatar
              key={profileAvatar ?? profileName}
              src={profileAvatar}
              name={profileName}
              className="size-28 after:border-0 sm:size-32"
            />
            <div className="flex min-w-0 flex-col items-center sm:items-start">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{profileName}</h1>
              <button
                onClick={copyUid}
                className="text-muted-foreground mt-1 inline-flex items-center gap-1 text-xs tabular-nums transition-colors hover:text-foreground"
              >
                {profileId}
                <HugeiconsIcon
                  icon={copied ? Tick02Icon : Copy01Icon}
                  size={12}
                  className={copied ? 'text-primary' : ''}
                />
              </button>
              <p className="text-muted-foreground mt-3 max-w-md text-center text-sm leading-relaxed sm:text-left">
                {mockUser.bio}
              </p>
              <div className="mt-5 flex items-center gap-7">
                <span className="text-center">
                  <strong className="block text-base">{formatCount(mockUser.posts)}</strong>
                  <small className="text-muted-foreground text-xs">笔记</small>
                </span>
                <span className="text-center">
                  <strong className="block text-base">{formatCount(mockUser.followers)}</strong>
                  <small className="text-muted-foreground text-xs">粉丝</small>
                </span>
                <span className="text-center">
                  <strong className="block text-base">{formatCount(mockUser.following)}</strong>
                  <small className="text-muted-foreground text-xs">关注</small>
                </span>
              </div>
            </div>
          </div>

          <div className="absolute top-6 right-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-lg" className="rounded-full" aria-label="更多" title="更多">
                  <HugeiconsIcon icon={MoreHorizontalIcon} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Edit02Icon} />
                    编辑资料
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Share08Icon} />
                    分享主页
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <HugeiconsIcon icon={Settings01Icon} />
                      设置
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        <div>
          <div className="flex items-center justify-center gap-1 pb-3">
            {['笔记', '收藏', '喜欢'].map(tab => (
              <button
                key={tab}
                type="button"
                aria-pressed={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-28 pt-6">
          <WaterfallFeed posts={mockPosts} />
        </div>
      </div>
    </div>
  )
}
