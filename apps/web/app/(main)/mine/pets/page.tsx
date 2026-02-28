'use client'

import { Button } from '@propet/ui'
import { Add01Icon, ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'

export default function PetsPage() {
  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/mine">
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
            </Button>
          </Link>
          <h1 className="text-base font-semibold">宠物管理</h1>
          <Link href="/mine/pets/new">
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Add01Icon} size={20} />
            </Button>
          </Link>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="text-muted-foreground text-center text-sm">
          还没有添加宠物，点击右上角添加
        </p>
      </div>
    </div>
  )
}
