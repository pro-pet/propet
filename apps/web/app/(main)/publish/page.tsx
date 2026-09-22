'use client'

import { Camera01Icon, Image01Icon, Video01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Input } from '@propet/ui'
import { useState } from 'react'
import { PageSearch } from '@/components/page-search'

const formats = [
  { label: '图文', icon: Image01Icon },
  { label: '视频', icon: Video01Icon },
  { label: '拍摄', icon: Camera01Icon },
]

export default function PublishPage() {
  const [format, setFormat] = useState('图文')
  return (
    <div className="bg-background min-h-svh">
      <header className="sticky top-0 z-[120]">
        <div className="mx-auto flex h-24 max-w-2xl items-center px-5">
          <PageSearch />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 pb-28 pt-6">
        <div className="mb-4 flex justify-end">
          <Button className="h-8 rounded-full px-4 text-xs font-semibold">发布</Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {formats.map(item => (
            <button key={item.label} onClick={() => setFormat(item.label)} className={`flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border text-sm transition-colors ${format === item.label ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:bg-muted'}`}>
              <HugeiconsIcon icon={item.icon} size={24} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <Input placeholder="给笔记起个标题吧" className="h-12 rounded-none border-0 border-b border-border bg-transparent px-0 text-lg font-semibold shadow-none focus-visible:ring-0" />
          <textarea placeholder="分享你和毛孩子的故事..." className="text-foreground min-h-52 w-full resize-none border-0 bg-transparent text-sm leading-7 outline-none" />
          <div className="bg-muted/50 text-muted-foreground rounded-2xl p-4 text-xs">
            当前选择：
            {format}
            {' · 添加宠物标签，让更多同好看到你的分享'}
          </div>
        </div>
      </main>
    </div>
  )
}
