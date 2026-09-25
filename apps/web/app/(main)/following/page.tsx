'use client'

import { Avatar, Button } from '@propet/ui'
import { useState } from 'react'
import { useFollowing, useToggleFollow } from '@/lib/api/follows'

type Tab = 'users' | 'pets'

export default function FollowingPage() {
  const [tab, setTab] = useState<Tab>('users')
  const query = useFollowing(tab)
  const toggleFollow = useToggleFollow()
  const [removed, setRemoved] = useState<Set<string>>(new Set())

  const unfollow = (id: string) => {
    setRemoved(current => new Set(current).add(id))
    toggleFollow.mutate({ type: tab, id, following: true })
  }

  const visibleItems = (query.data ?? []).filter(item => !removed.has(item.id))

  return (
    <div className="bg-background min-h-svh">
      <main className="mx-auto w-full max-w-3xl px-5 pb-28 pt-8 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">我的关注</h1>
            <p className="text-muted-foreground mt-1 text-sm">管理你关注的主人和宠物</p>
          </div>
          <div className="bg-muted flex rounded-full p-1">
            <button type="button" className={`rounded-full px-4 py-1.5 text-sm ${tab === 'users' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`} onClick={() => setTab('users')}>主人</button>
            <button type="button" className={`rounded-full px-4 py-1.5 text-sm ${tab === 'pets' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`} onClick={() => setTab('pets')}>宠物</button>
          </div>
        </div>
        <section className="mt-6 divide-y">
          {query.isPending && <p className="text-muted-foreground py-16 text-center text-sm">正在加载…</p>}
          {query.isError && <p className="text-destructive py-16 text-center text-sm">关注列表暂时无法加载</p>}
          {visibleItems.map((item) => {
            const isPet = tab === 'pets'
            const user = item as Extract<typeof item, { name: string | null }>
            const pet = item as Extract<typeof item, { nickname: string }>
            return (
              <article key={item.id} className="flex items-center gap-3 py-4">
                <Avatar src={isPet ? pet.avatar : user.avatar} name={isPet ? pet.nickname : user.name || '用户'} fallback={(isPet ? pet.nickname : user.name || '用').slice(0, 1)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{isPet ? pet.nickname : user.name || '用户'}</p>
                  <p className="text-muted-foreground truncate text-xs">{isPet ? `${pet.species}${pet.breed ? ` · ${pet.breed}` : ''} · ${pet.owner.name || '用户'} 的宠物` : `${user.postCount} 条帖子 · ${user.followerCount} 位粉丝`}</p>
                </div>
                <Button type="button" variant="secondary" size="sm" className="rounded-full" onClick={() => unfollow(item.id)}>已关注</Button>
              </article>
            )
          })}
          {!query.isPending && !query.isError && visibleItems.length === 0 && (
            <p className="text-muted-foreground py-16 text-center text-sm">
              还没有关注
              {tab === 'users' ? '主人' : '宠物'}
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
