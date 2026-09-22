import GradualBlur from '@/components/gradual-blur'
import { MainDock } from '@/components/main-dock'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 pb-24">{children}</main>
      <GradualBlur
        target="page"
        position="top"
        height="7rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={10}
      />
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
