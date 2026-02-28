'use client'

import { Button, Input } from '@propet/ui'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <div className="ring-border/50 bg-card w-full max-w-md space-y-8 rounded-2xl p-10 shadow-sm ring-1">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ProPet</h1>
          <p className="text-muted-foreground mt-2">登录你的账号</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">邮箱</label>
            <Input type="email" placeholder="请输入邮箱" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">密码</label>
            <Input type="password" placeholder="请输入密码" />
          </div>
          <Button className="w-full" size="lg">登录</Button>
        </div>

        <p className="text-muted-foreground text-center text-sm">
          还没有账号？
          <Link href="/register" className="text-primary ml-1 hover:underline">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  )
}
