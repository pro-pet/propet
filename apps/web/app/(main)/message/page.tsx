'use client'

import { useState } from 'react'
import { ChatPanel } from '@/components/messages/chat-panel'
import { initialChats } from '@/components/messages/data'
import { MessagesPanel } from '@/components/messages/messages-panel'

export default function MessagePage() {
  const [chats, setChats] = useState(initialChats)
  const [activeId, setActiveId] = useState('fufu')
  const [showList, setShowList] = useState(true)
  const activeChat = chats.find(chat => chat.id === activeId) ?? chats[0]!

  function selectChat(id: string) {
    setActiveId(id)
    setShowList(false)
    setChats(current => current.map(chat => chat.id === id ? { ...chat, unread: 0 } : chat))
  }

  function sendMessage(text: string) {
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    setChats(current => current.map((chat) => {
      if (chat.id !== activeId)
        return chat
      return {
        ...chat,
        preview: text,
        time,
        messages: [...chat.messages, { id: `${chat.id}-${Date.now()}`, text, time, from: 'me', read: true }],
      }
    }))
  }

  return (
    <div className="relative z-[120] h-[calc(100svh-6rem)] overflow-hidden bg-background">
      <main className="mx-auto h-full w-full max-w-6xl px-3 pb-4 pt-4 sm:px-7 sm:pb-6 sm:pt-6">
        <div className="grid h-full min-h-0 gap-3 md:grid-cols-[minmax(275px,340px)_1fr]">
          <MessagesPanel
            chats={chats}
            activeId={activeId}
            visible={showList}
            onSelect={selectChat}
          />
          <ChatPanel
            chat={activeChat}
            visible={!showList}
            onBack={() => setShowList(true)}
            onSend={sendMessage}
          />
        </div>
      </main>
    </div>
  )
}
