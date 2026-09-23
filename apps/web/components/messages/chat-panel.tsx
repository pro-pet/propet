'use client'

import type { Chat } from './types'
import { ArrowLeft02Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons'
import { Avatar } from '@propet/ui'
import { ChatBubble } from './chat-bubble'
import { ChatComposer } from './chat-composer'
import { IconButton } from './icon-button'

interface ChatPanelProps {
  chat: Chat
  visible: boolean
  onBack: () => void
  onSend: (text: string) => void
}

export function ChatPanel({ chat, visible, onBack, onSend }: ChatPanelProps) {
  return (
    <section className={`${visible ? 'flex' : 'hidden'} min-h-0 min-w-0 flex-col overflow-hidden rounded-lg bg-background md:flex`}>
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <IconButton icon={ArrowLeft02Icon} label="返回消息列表" onClick={onBack} className="md:hidden" />
          <span className="relative shrink-0">
            <Avatar src={chat.avatar} name={chat.name} className="size-10" />
            {chat.online && <span className="ring-background bg-online absolute right-0 bottom-0 size-2.5 rounded-full ring-2" />}
          </span>
          <h2 className="truncate text-[15px] font-semibold">{chat.name}</h2>
        </div>
        <IconButton icon={MoreHorizontalIcon} label="更多聊天操作" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-6 sm:px-4 sm:py-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="text-muted-foreground mb-1 flex items-center justify-center gap-3 text-[10px]">
            <span className="bg-border h-px w-8" />
            <span>今天</span>
            <span className="bg-border h-px w-8" />
          </div>
          {chat.messages.map(message => (
            <ChatBubble key={message.id} message={message} avatar={chat.avatar} name={chat.name} />
          ))}
        </div>
      </div>

      <ChatComposer recipientName={chat.name} onSend={onSend} />
    </section>
  )
}
