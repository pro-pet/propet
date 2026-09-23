import type { Chat } from './types'
import { Avatar } from '@propet/ui'

interface ContactRowProps {
  chat: Chat
  active: boolean
  onClick: () => void
}

export function ContactRow({ chat, active, onClick }: ContactRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${active ? 'bg-primary/10' : 'hover:bg-muted/60'}`}
    >
      <span className="relative shrink-0">
        <Avatar src={chat.avatar} name={chat.name} className="size-12" />
        {chat.online && <span className="ring-background bg-online absolute right-0 bottom-0 size-3 rounded-full ring-2" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-foreground truncate text-[14px] font-semibold">{chat.name}</span>
          <span className="text-muted-foreground shrink-0 text-[11px]">{chat.time}</span>
        </span>
        <span className="mt-1 flex items-center justify-between gap-2">
          <span className="text-muted-foreground truncate text-xs">{chat.preview}</span>
          {chat.unread ? <span className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">{chat.unread}</span> : null}
        </span>
      </span>
    </button>
  )
}
