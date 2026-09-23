'use client'

import { SentIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Input, Textarea } from '@propet/ui'
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
          <Input placeholder="标题" className="h-12" />
          <Textarea placeholder="分享你的故事..." aria-label="分享内容" className="min-h-52 resize-none" />
          <div className="flex justify-end">
            <Button className="rounded-full h-12 px-4 gap-2">
              <HugeiconsIcon icon={SentIcon} />
              发布
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
