'use client'

import type { FormEvent } from 'react'
import { Button, Input } from '@propet/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending)
      return
    const formData = new FormData(event.currentTarget)
    setPending(true)
    setError('')
    try {
      await signIn(String(formData.get('email')), String(formData.get('password')))
      router.replace('/mine')
    }
    catch (error) {
      setError(error instanceof Error ? error.message : '登录失败，请稍后重试')
    }
    finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <div className="ring-border/50 bg-card w-full max-w-md space-y-8 rounded-2xl p-10 shadow-sm ring-1">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ProPet</h1>
          <p className="text-muted-foreground mt-2">登录你的账号</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">邮箱</label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="请输入邮箱" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">密码</label>
            <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="请输入密码" required />
          </div>
          {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
          <Button className="w-full" size="lg" type="submit" disabled={pending}>
            {pending ? '登录中…' : '登录'}
          </Button>
        </form>

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
