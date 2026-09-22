'use client'

import { ArrowUp02Icon, SparklesIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Input } from '@propet/ui'
import { useState } from 'react'
import { PageSearch } from '@/components/page-search'

const suggestions = ['今天适合带狗狗去哪玩？', '帮我看看猫咪换粮计划', '生成一份宠物生日清单']

export default function AiPage() {
  const [prompt, setPrompt] = useState('')
  const [sent, setSent] = useState(false)
  const submit = () => {
    if (!prompt.trim())
      return
    setSent(true)
  }
  return (
    <div className="bg-background min-h-svh">
      <header className="sticky top-0 z-[120]">
        <div className="mx-auto flex h-24 max-w-2xl items-center px-5">
          <PageSearch />
        </div>
      </header>
      <main className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-2xl flex-col px-5 pb-28 pt-14">
        <div className="text-center">
          <div className="bg-primary text-primary-foreground mx-auto flex size-16 items-center justify-center rounded-3xl shadow-lg"><HugeiconsIcon icon={SparklesIcon} size={30} /></div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">懂宠物，也懂你的生活</h2>
          <p className="text-muted-foreground mt-2 text-sm">问问 AI，获得专属的养宠建议与灵感</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {suggestions.map(suggestion => <button key={suggestion} onClick={() => setPrompt(suggestion)} className="bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full px-3.5 py-2 text-xs">{suggestion}</button>)}
        </div>
        {sent && <div className="bg-muted/50 mt-8 rounded-2xl p-4 text-sm leading-6">收到啦！我会结合你的宠物情况，为你整理一份温柔又实用的建议。</div>}
        <div className="bg-card mt-auto flex items-center gap-2 rounded-2xl border border-border p-2 shadow-sm">
          <Input value={prompt} onChange={event => setPrompt(event.target.value)} onKeyDown={event => event.key === 'Enter' && submit()} placeholder="向 ProPet AI 提问..." className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0" />
          <Button size="icon" onClick={submit} className="size-10 shrink-0 rounded-xl">
            <HugeiconsIcon icon={ArrowUp02Icon} size={18} />
            <span className="sr-only">发送</span>
          </Button>
        </div>
      </main>
    </div>
  )
}
