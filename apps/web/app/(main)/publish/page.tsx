'use client'

import { SentIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Input } from '@propet/ui'
import { PageSearch } from '@/components/page-search'

export default function PublishPage() {
  return (
    <div className="bg-background min-h-svh">
      <header className="sticky top-0 z-[120]">
        <div className="mx-auto flex h-24 max-w-2xl items-center px-5">
          <PageSearch />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 pb-28 pt-6">
        <div className="space-y-4">
          <Input placeholder="给笔记起个标题吧" className="h-12 rounded-none border-0 border-b border-border bg-transparent px-0 text-lg font-semibold shadow-none focus-visible:ring-0" />
          <textarea placeholder="分享你和毛孩子的故事..." className="text-foreground min-h-52 w-full resize-none border-0 bg-transparent text-sm leading-7 outline-none" />
          <div className="flex justify-end">
            <Button size="lg" className="rounded-full">
              <HugeiconsIcon icon={SentIcon} size={16} />
              发布
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
