'use client'

import { Button } from '@propet/ui'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export default function CommunityPage() {
  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <h1 className="text-xl font-semibold">社区</h1>
          <Button variant="ghost" size="icon">
            <HugeiconsIcon icon={Add01Icon} size={20} />
          </Button>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="text-muted-foreground text-center text-sm">暂无动态</p>
      </div>
    </div>
  )
}
