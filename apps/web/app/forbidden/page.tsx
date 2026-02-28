import { Button } from '@propet/ui'
import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-6xl font-bold">403</h1>
      <p className="text-muted-foreground text-sm">抱歉，你没有权限访问此页面</p>
      <Link href="/community">
        <Button variant="outline" size="sm">返回首页</Button>
      </Link>
    </div>
  )
}
