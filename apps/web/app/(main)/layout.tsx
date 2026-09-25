import GradualBlur from '@/components/gradual-blur'
import { MainDock } from '@/components/main-dock'
import { MainSearch } from '@/components/main-search'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <MainSearch />
      <main className="flex-1 pb-24">{children}</main>
      <GradualBlur
        target="page"
        position="bottom"
        height="7rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={10}
      />
      <MainDock />
    </div>
  )
}
