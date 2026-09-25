'use client'

import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button } from '@propet/ui'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { useToggleFollow } from '@/lib/api/follows'
import { usePet } from '@/lib/api/pets'

export default function PetProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const petQuery = usePet(id)
  const toggleFollow = useToggleFollow()
  const [following, setFollowing] = useState(false)
  const pet = petQuery.data

  return (
    <div className="flex min-h-svh flex-col">
      <header className="bg-background/80 sticky top-0 z-40 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="返回">
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
          </Button>
          <h1 className="text-base font-semibold">宠物主页</h1>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-12 text-center">
        {petQuery.isPending && <p className="text-muted-foreground text-sm">正在加载…</p>}
        {petQuery.isError && <p className="text-destructive text-sm">宠物资料不存在</p>}
        {pet && (
          <>
            <Avatar src={pet.avatar} name={pet.nickname} fallback={pet.nickname.slice(0, 1)} className="size-28" />
            <h2 className="mt-5 text-2xl font-semibold">{pet.nickname}</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {pet.species}
              {pet.breed ? ` · ${pet.breed}` : ''}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              主人：
              {pet.owner.name || '用户'}
              {' · '}
              {pet.followerCount}
              {' 位关注'}
            </p>
            <div className="mt-6 flex gap-2">
              <Button
                variant={following ? 'secondary' : 'default'}
                className="rounded-full"
                onClick={() => {
                  setFollowing(current => !current)
                  toggleFollow.mutate({ type: 'pets', id, following })
                }}
              >
                {following ? '已关注' : '关注宠物'}
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => router.push(`/user/${pet.ownerId}`)}>查看主人</Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
