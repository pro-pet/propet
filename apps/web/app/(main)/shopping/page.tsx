'use client'

export default function ShoppingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="bg-background/80 sticky top-0 z-40 backdrop-blur-lg">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-6">
          <h1 className="text-xl font-semibold">购物</h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 pb-24">
        <p className="text-muted-foreground text-sm">宠物好物专区正在布置中</p>
      </main>
    </div>
  )
}
