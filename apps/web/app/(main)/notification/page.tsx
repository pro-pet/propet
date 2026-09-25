'use client'

import type { IconSvgElement } from '@hugeicons/react'
import { AtIcon, Bookmark01Icon, Comment01Icon, FavouriteIcon, UserAdd01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button } from '@propet/ui'
import { useState } from 'react'

type NotificationTab = '评论与@' | '赞与收藏' | '新增关注'

interface NotificationItem {
  id: string
  name: string
  avatar: string
  time: string
  message: string
  detail?: string
  postTitle?: string
  icon: IconSvgElement
  followed?: boolean
}

const tabs: NotificationTab[] = ['评论与@', '赞与收藏', '新增关注']

const notificationItems: Record<NotificationTab, NotificationItem[]> = {
  '评论与@': [
    {
      id: 'comment-1',
      name: '柚子家的毛球',
      avatar: 'https://i.pravatar.cc/160?u=propet-comment-1',
      time: '刚刚',
      message: '评论了你的笔记',
      detail: '团子今天的状态也太好了吧，求同款遛弯路线！',
      postTitle: '今天带团子去公园啦',
      icon: Comment01Icon,
    },
    {
      id: 'mention-1',
      name: '奶盖和薯条',
      avatar: 'https://i.pravatar.cc/160?u=propet-mention-1',
      time: '昨天',
      message: '在评论中@了你',
      detail: '下次一起带毛孩子去新开的宠物友好咖啡店呀～',
      postTitle: '这家宠物友好咖啡店拍照太出片了',
      icon: AtIcon,
    },
    {
      id: 'comment-2',
      name: '风铃的小窝',
      avatar: 'https://i.pravatar.cc/160?u=propet-comment-2',
      time: '周一',
      message: '回复了你的评论',
      detail: '驱虫确实要按时做，已经把你的清单收藏啦。',
      postTitle: '分享一个超省心的居家驱虫节奏',
      icon: Comment01Icon,
    },
  ],
  '赞与收藏': [
    {
      id: 'like-1',
      name: '阿椰的日常',
      avatar: 'https://i.pravatar.cc/160?u=propet-like-1',
      time: '10分钟前',
      message: '赞了你的笔记',
      postTitle: '今天带团子去公园啦',
      icon: FavouriteIcon,
    },
    {
      id: 'bookmark-1',
      name: '鱼饼妈妈',
      avatar: 'https://i.pravatar.cc/160?u=propet-bookmark-1',
      time: '昨天',
      message: '收藏了你的笔记',
      postTitle: '奶盖的新衣服',
      icon: Bookmark01Icon,
    },
    {
      id: 'like-2',
      name: '眠眠',
      avatar: 'https://i.pravatar.cc/160?u=propet-like-2',
      time: '周一',
      message: '赞了你的笔记',
      postTitle: '周末遛弯日记',
      icon: FavouriteIcon,
    },
  ],
  '新增关注': [
    {
      id: 'follow-1',
      name: '风铃',
      avatar: 'https://i.pravatar.cc/160?u=propet-follow-1',
      time: '刚刚',
      message: '关注了你',
      icon: UserAdd01Icon,
      followed: false,
    },
    {
      id: 'follow-2',
      name: '小橘的铲屎官',
      avatar: 'https://i.pravatar.cc/160?u=propet-follow-2',
      time: '昨天',
      message: '关注了你',
      icon: UserAdd01Icon,
      followed: false,
    },
    {
      id: 'follow-3',
      name: 'Momo 和两只狗',
      avatar: 'https://i.pravatar.cc/160?u=propet-follow-3',
      time: '周日',
      message: '关注了你',
      icon: UserAdd01Icon,
      followed: false,
    },
  ],
}

function NotificationRow({
  item,
  isFollowed,
  onToggleFollow,
}: {
  item: NotificationItem
  isFollowed: boolean
  onToggleFollow: () => void
}) {
  return (
    <article className="group flex items-start gap-3 rounded-2xl px-2 py-4 transition-colors hover:bg-muted/50 sm:gap-4 sm:px-4">
      <div className="relative shrink-0">
        <Avatar src={item.avatar} name={item.name} className="size-11 sm:size-12" />
        <span className="bg-primary text-primary-foreground ring-background absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full ring-2">
          <HugeiconsIcon icon={item.icon} size={12} />
        </span>
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm leading-6 sm:text-[15px]">
              <strong className="font-semibold">{item.name}</strong>
              <span className="text-muted-foreground">
                {' '}
                {item.message}
              </span>
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">{item.time}</p>
          </div>
          {item.followed !== undefined && (
            <Button
              type="button"
              size="sm"
              variant={isFollowed ? 'secondary' : 'outline'}
              className="shrink-0 rounded-full px-3"
              onClick={onToggleFollow}
            >
              {isFollowed ? '已关注' : '回关'}
            </Button>
          )}
        </div>

        {item.detail && (
          <p className="text-foreground/80 mt-2 line-clamp-2 text-sm leading-6">{item.detail}</p>
        )}
        {item.postTitle && (
          <div className="bg-muted/60 text-muted-foreground mt-2 truncate rounded-lg px-3 py-2 text-xs">
            {item.postTitle}
          </div>
        )}
      </div>
    </article>
  )
}

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('评论与@')
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set())
  const currentItems = notificationItems[activeTab]

  function toggleFollow(id: string) {
    setFollowedIds((current) => {
      const next = new Set(current)
      if (next.has(id))
        next.delete(id)
      else
        next.add(id)
      return next
    })
  }

  return (
    <div className="bg-background min-h-svh">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <main className="mx-auto max-w-3xl pb-28 pt-6">
          <div className="flex items-center justify-center gap-1 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map(tab => (
              <button
                key={tab}
                type="button"
                aria-pressed={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <section aria-label={activeTab} className="divide-border/70 divide-y">
            {currentItems.map(item => (
              <NotificationRow
                key={item.id}
                item={item}
                isFollowed={followedIds.has(item.id)}
                onToggleFollow={() => toggleFollow(item.id)}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}
