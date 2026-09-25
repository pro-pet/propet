'use client'

import { Agreement01Icon, ComputerIcon, Copy01Icon, CustomerService01Icon, Edit02Icon, Logout01Icon, Moon01Icon, MoreHorizontalIcon, Share08Icon, Sun01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button } from '@propet/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@propet/ui/components/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@propet/ui/components/dropdown-menu'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
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
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const profileId = user?.id ?? UID
  const profileName = user ? user.name || '用户' : mockUser.name
  const profileAvatar = user ? user.avatar : mockUser.avatar
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('笔记')
  const [infoDialog, setInfoDialog] = useState<'privacy' | 'support' | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const copyUid = useCallback(() => {
    navigator.clipboard.writeText(profileId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [profileId])

  const handleSignOut = useCallback(async () => {
    if (isSigningOut)
      return
    setIsSigningOut(true)
    try {
      await signOut()
      router.replace('/login')
    }
    catch {
      setIsSigningOut(false)
    }
  }, [isSigningOut, router, signOut])

  return (
    <div className="bg-background min-h-svh">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
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
              <div className="flex max-w-full min-w-0 items-center gap-2">
                <h1 className="max-w-[calc(100vw-8rem)] min-w-0 truncate text-2xl font-bold tracking-tight sm:max-w-sm sm:text-3xl">{profileName}</h1>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" className="shrink-0 rounded-full" aria-label="更多设置" title="更多设置" />}>
                    <HugeiconsIcon icon={MoreHorizontalIcon} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={8} className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <HugeiconsIcon icon={Edit02Icon} />
                        编辑资料
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HugeiconsIcon icon={Share08Icon} />
                        分享主页
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setInfoDialog('privacy')}>
                        <HugeiconsIcon icon={Agreement01Icon} />
                        隐私协议
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setInfoDialog('support')}>
                        <HugeiconsIcon icon={CustomerService01Icon} />
                        帮助与客服
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <HugeiconsIcon icon={Sun01Icon} />
                          主题
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup value={theme ?? 'system'} onValueChange={setTheme}>
                            <DropdownMenuRadioItem value="system">
                              <HugeiconsIcon icon={ComputerIcon} />
                              跟随系统
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="light">
                              <HugeiconsIcon icon={Sun01Icon} />
                              浅色模式
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                              <HugeiconsIcon icon={Moon01Icon} />
                              深色模式
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" disabled={isSigningOut} onClick={() => void handleSignOut()}>
                      <HugeiconsIcon icon={Logout01Icon} />
                      {isSigningOut ? '正在退出…' : '退出登录'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
        </section>

        <Dialog open={infoDialog === 'privacy'} onOpenChange={open => !open && setInfoDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>隐私协议</DialogTitle>
              <DialogDescription>我们会在服务所需范围内使用账号信息，为你提供登录、个人主页和内容互动功能。</DialogDescription>
            </DialogHeader>
            <div className="text-muted-foreground space-y-3 text-sm leading-6">
              <p>我们不会出售你的个人信息。你可以在需要时联系平台，了解或申请处理与你的账号相关的数据。</p>
              <p>隐私协议的完整版本会在服务正式上线前更新，并在这里持续提供查看入口。</p>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={infoDialog === 'support'} onOpenChange={open => !open && setInfoDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>帮助与客服</DialogTitle>
              <DialogDescription>遇到登录、内容发布或账号使用问题，可以联系我们。</DialogDescription>
            </DialogHeader>
            <div className="text-muted-foreground space-y-3 text-sm leading-6">
              <p>请准备好问题描述和相关页面信息，我们会尽快协助你处理。</p>
              <p>客服入口正在完善，当前版本可以通过应用反馈渠道联系我们。</p>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mx-auto flex max-w-3xl justify-end pt-4"><Button type="button" variant="ghost" size="sm" onClick={() => router.push('/following')}>查看我的关注</Button></div>

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
