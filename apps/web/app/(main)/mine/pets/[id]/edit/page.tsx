'use client'

import { Button, Input } from '@propet/ui'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { use } from 'react'

export default function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
          <Link href={`/mine/pets/${id}`}>
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
            </Button>
          </Link>
          <h1 className="text-base font-semibold">编辑宠物</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-xl space-y-6 px-6 py-10">
        <div className="space-y-2">
          <label className="text-sm font-medium">宠物名称</label>
          <Input placeholder="宠物名称" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">品种</label>
          <Input placeholder="品种" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">年龄</label>
          <Input placeholder="年龄" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">简介</label>
          <Input placeholder="简介" />
        </div>
        <Button className="w-full">保存修改</Button>
      </div>
    </div>
  )
}
