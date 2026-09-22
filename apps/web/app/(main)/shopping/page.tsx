'use client'

import { PageSearch } from '@/components/page-search'

export default function ShoppingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-[120]">
        <div className="mx-auto flex h-24 w-full max-w-5xl items-center px-6">
          <PageSearch />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 pb-24">
        <p className="text-muted-foreground text-sm">宠物好物专区正在布置中</p>
      </main>
    </div>
  )
}
