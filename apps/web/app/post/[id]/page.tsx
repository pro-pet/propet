'use client'

import { Button } from '@propet/ui'
import { ArrowLeft02Icon, FavouriteIcon, Comment01Icon, Share01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function PostDetailPage({
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
          <h1 className="text-base font-semibold">帖子详情</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <p className="text-muted-foreground text-sm">帖子 ID: {id}</p>
      </div>

      {/* 底部操作栏 */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-6">
        <div className="bg-background/70 ring-border/50 pointer-events-auto flex items-center gap-2 rounded-2xl px-4 py-2 shadow-lg ring-1 backdrop-blur-xl">
          <Button variant="ghost" size="sm">
            <HugeiconsIcon icon={FavouriteIcon} size={18} />
            <span className="ml-1">点赞</span>
          </Button>
          <Button variant="ghost" size="sm">
            <HugeiconsIcon icon={Comment01Icon} size={18} />
            <span className="ml-1">评论</span>
          </Button>
          <Button variant="ghost" size="sm">
            <HugeiconsIcon icon={Share01Icon} size={18} />
            <span className="ml-1">分享</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
