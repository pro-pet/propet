'use client'

import type { DockItem } from '@/components/dock'
import { AddCircleIcon, AiMagicIcon, Home11Icon, Mail01Icon, ShoppingBag01Icon, UserIcon } from '@hugeicons/core-free-icons'
import { useMemo } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Dock } from '@/components/dock'

const mainItems: DockItem[] = [
  { href: '/community', label: '社区', icon: Home11Icon },
  { href: '/publish', label: '发布', icon: AddCircleIcon },
  { href: '/ai', label: 'AI 助手', icon: AiMagicIcon },
  { href: '/shopping', label: '购物', icon: ShoppingBag01Icon },
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

  return <Dock items={items} />
}
