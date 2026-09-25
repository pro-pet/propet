'use client'

import type { Pet } from '@/lib/api/pets'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button } from '@propet/ui'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { useToggleFollow } from '@/lib/api/follows'

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [profile, setProfile] = useState<{ id: string, name: string | null, avatar: string | null, pets: Pet[], followerCount: number, followingCount: number, postCount: number } | null>(null)
  const [following, setFollowing] = useState(false)
  const toggleFollow = useToggleFollow()

  useEffect(() => {
    apiClient.get<typeof profile>(`/users/${encodeURIComponent(id)}`).then(setProfile).catch(() => setProfile(null))
  }, [id])

  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
          </Button>
          <h1 className="text-base font-semibold">用户主页</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center gap-5">
          <Avatar src={profile?.avatar} name={profile?.name || '用户'} fallback={(profile?.name || '用').slice(0, 1)} className="size-24" />
          <h2 className="text-xl font-semibold">{profile?.name || '用户'}</h2>
          <p className="text-muted-foreground text-sm">{profile ? `${profile.postCount} 条帖子 · ${profile.followerCount} 位粉丝 · ${profile.followingCount} 人关注` : `用户 ID: ${id}`}</p>
          <Button
            variant={following ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => {
              setFollowing(current => !current)
              toggleFollow.mutate({ type: 'users', id, following })
            }}
          >
            {following ? '已关注' : '关注'}
          </Button>
          {profile?.pets && profile.pets.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {profile.pets.map(pet => (
                <button key={pet.id} type="button" className="bg-muted/60 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm" onClick={() => router.push(`/pet/${pet.id}`)}>
                  <Avatar src={pet.avatar} name={pet.nickname} fallback={pet.nickname.slice(0, 1)} size="sm" />
                  {pet.nickname}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
