'use client'

import { PageSearch } from '@/components/page-search'

export default function MessagePage() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-[120]">
        <div className="mx-auto flex h-24 max-w-5xl items-center px-6">
          <PageSearch />
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="text-muted-foreground text-center text-sm">暂无消息</p>
      </div>
    </div>
  )
}
