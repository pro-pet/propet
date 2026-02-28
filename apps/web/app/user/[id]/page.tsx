'use client'

import { Button } from '@propet/ui'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
          </Button>
          <h1 className="text-base font-semibold">用户主页</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center gap-5">
          <div className="bg-muted flex size-24 items-center justify-center rounded-full text-3xl">
            ?
          </div>
          <p className="text-muted-foreground text-sm">用户 ID: {id}</p>
          <Button variant="outline" size="sm">关注</Button>
        </div>
      </div>
    </div>
  )
}
