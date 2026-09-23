'use client'

import { Image01Icon, SentIcon, SmileIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@propet/ui'
import { useState } from 'react'
import { IconButton } from './icon-button'

interface ChatComposerProps {
  recipientName: string
  onSend: (text: string) => void
}

export function ChatComposer({ recipientName, onSend }: ChatComposerProps) {
  const [draft, setDraft] = useState('')

  function send() {
    const text = draft.trim()
    if (!text)
      return
    onSend(text)
    setDraft('')
  }

  return (
    <div className="border-border/70 bg-background/70 supports-backdrop-filter:bg-background/55 pointer-events-none absolute inset-x-0 bottom-0 z-20 shrink-0 border-t px-4 pt-3 pb-4 backdrop-blur-xl sm:px-6 sm:pb-5">
      <div className="pointer-events-auto mx-auto max-w-2xl">
        <div className="flex items-end gap-2 rounded-full border border-border bg-card p-2 transition-colors focus-within:border-primary">
          <div className="flex items-center">
            <IconButton icon={Image01Icon} label="添加图片" />
            <IconButton icon={SmileIcon} label="选择表情" />
          </div>
          <textarea
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                send()
              }
            }}
            rows={1}
            placeholder={`给 ${recipientName} 发消息...`}
            aria-label="消息内容"
            className="text-foreground placeholder:text-muted-foreground max-h-24 min-h-9 flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-5 outline-none"
          />
          <Button size="icon-lg" aria-label="发送消息" title="发送消息" onClick={send} className="rounded-full">
            <HugeiconsIcon icon={SentIcon} />
          </Button>
        </div>
      </div>
    </div>
  )
}
