'use client'

import { Button } from '@propet/ui'
import { Settings01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'

export default function MinePage() {
  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <h1 className="text-xl font-semibold">我的</h1>
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Settings01Icon} size={20} />
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        {/* 用户信息 */}
        <div className="flex items-center gap-5">
          <div className="bg-muted flex size-20 items-center justify-center rounded-full text-3xl">
            ?
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground">未登录</p>
            <Link href="/login" className="text-primary text-sm">
              点击登录
            </Link>
          </div>
        </div>

        {/* 我的宠物 */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">我的宠物</h2>
            <Link
              href="/mine/pets"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
            >
              管理
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </div>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            还没有添加宠物
          </p>
        </div>
      </div>
    </div>
  )
}
