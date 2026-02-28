'use client'

import { Input } from '@propet/ui'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export default function DiscoverPage() {
  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6">
          <h1 className="text-xl font-semibold shrink-0">发现</h1>
          <div className="relative max-w-md flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
            />
            <Input placeholder="搜索宠物、话题..." className="h-9 pl-9 text-sm" />
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="text-muted-foreground text-center text-sm">探索更多内容</p>
      </div>
    </div>
  )
}
