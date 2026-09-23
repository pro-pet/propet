'use client'

import type { Chat } from './types'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { ContactRow } from './contact-row'
import { IconButton } from './icon-button'

interface MessagesPanelProps {
  chats: Chat[]
  activeId: string
  visible: boolean
  onSelect: (id: string) => void
}

export function MessagesPanel({ chats, activeId, visible, onSelect }: MessagesPanelProps) {
  return (
    <aside className={`${visible ? 'flex' : 'hidden'} min-h-0 flex-col overflow-hidden rounded-lg bg-muted/30 md:flex`}>
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-5">
        <h2 className="text-xl font-semibold tracking-[-0.03em]">消息</h2>
        <IconButton icon={Add01Icon} label="发起新聊天" className="bg-background" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {chats.map(chat => (
          <ContactRow
            key={chat.id}
            chat={chat}
            active={chat.id === activeId}
            onClick={() => onSelect(chat.id)}
          />
        ))}
      </div>
    </aside>
  )
}
