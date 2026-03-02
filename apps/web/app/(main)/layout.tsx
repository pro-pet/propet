import type { DockItem } from '@/components/dock'
import {
  CompassIcon,
  Home11Icon,
  Mail01Icon,
  ShoppingBag01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { Dock } from '@/components/dock'

const items: DockItem[] = [
  { href: '/community', label: '社区', icon: Home11Icon },
  { href: '/discover', label: '发现', icon: CompassIcon },
  { href: '/shopping', label: '购物', icon: ShoppingBag01Icon },
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

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-6">
        <div className="pointer-events-auto">
          <Dock items={items} />
        </div>
      </div>
    </div>
  )
}
