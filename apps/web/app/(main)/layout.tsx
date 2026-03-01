import type { DockItem } from '@/components/dock'
import {
  CompassIcon,
  Home11Icon,
  Mail01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { Dock } from '@/components/dock'

const items: DockItem[] = [
  { href: '/community', label: '社区', icon: Home11Icon, badge: true },
  { href: '/discover', label: '发现', icon: CompassIcon },
  { href: '/message', label: '消息', icon: Mail01Icon, badge: 103 },
  { href: '/mine', label: '我的', icon: UserIcon },
]

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 pb-24">{children}</main>
      <Dock items={items} />
    </div>
  )
}
