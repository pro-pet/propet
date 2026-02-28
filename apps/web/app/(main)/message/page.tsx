'use client'

export default function MessagePage() {
  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
          <h1 className="text-xl font-semibold">消息</h1>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="text-muted-foreground text-center text-sm">暂无消息</p>
      </div>
    </div>
  )
}
