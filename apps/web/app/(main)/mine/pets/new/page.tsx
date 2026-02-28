'use client'

import { Button, Input } from '@propet/ui'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'

export default function NewPetPage() {
  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
          <Link href="/mine/pets">
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
            </Button>
          </Link>
          <h1 className="text-base font-semibold">添加宠物</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-xl space-y-6 px-6 py-10">
        <div className="space-y-2">
          <label className="text-sm font-medium">宠物名称</label>
          <Input placeholder="给你的宠物起个名字" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">品种</label>
          <Input placeholder="例如：金毛、英短" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">年龄</label>
          <Input placeholder="例如：2岁" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">简介</label>
          <Input placeholder="介绍一下你的宠物" />
        </div>
        <Button className="w-full">添加宠物</Button>
      </div>
    </div>
  )
}
