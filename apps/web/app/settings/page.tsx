'use client'

import { Button } from '@propet/ui'
import { ArrowLeft02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
          </Button>
          <h1 className="text-base font-semibold">设置</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-xl divide-y px-6">
        <div className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg px-4 py-4 transition-colors">
          <span className="text-sm">账号与安全</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground" />
        </div>
        <div className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg px-4 py-4 transition-colors">
          <span className="text-sm">通知设置</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground" />
        </div>
        <div className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg px-4 py-4 transition-colors">
          <span className="text-sm">隐私设置</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground" />
        </div>
        <div className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg px-4 py-4 transition-colors">
          <span className="text-sm">关于</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
