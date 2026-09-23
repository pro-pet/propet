'use client'

import type { DockItem } from '@/components/dock'
import { AiMagicIcon, Home11Icon, Mail01Icon, Notification01Icon, SentIcon, ShoppingBag01Icon, UserIcon } from '@hugeicons/core-free-icons'
import { motion } from 'motion/react'
import { useMemo } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Dock } from '@/components/dock'

const mainItems: DockItem[] = [
  { href: '/community', label: '社区', icon: Home11Icon },
  { href: '/publish', label: '发布', icon: SentIcon },
  { href: '/ai', label: 'AI 助手', icon: AiMagicIcon, disabled: true },
  { href: '/shopping', label: '购物', icon: ShoppingBag01Icon },
  { href: '/notification', label: '通知', icon: Notification01Icon, badge: 7 },
  { href: '/message', label: '消息', icon: Mail01Icon, badge: 103 },
]

export function MainDock() {
  const { user } = useAuth()
  const items = useMemo<DockItem[]>(() => [
    ...mainItems,
    {
      href: '/mine',
      label: '我的',
      icon: UserIcon,
      avatar: user ? { src: user.avatar, name: user.name || '用户' } : undefined,
    },
  ], [user])

  return (
    <motion.div
      layoutRoot
      className="pointer-events-none fixed inset-x-0 bottom-0 z-200 flex justify-center pb-6"
    >
      <div className="pointer-events-auto">
        <Dock items={items} />
      </div>
    </motion.div>
  )
}
