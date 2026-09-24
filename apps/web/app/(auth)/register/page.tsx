'use client'

import type { FormEvent } from 'react'
import { Button, Input } from '@propet/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending)
      return

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password'))
    if (password !== String(formData.get('confirmPassword'))) {
      setError('两次输入的密码不一致')
      return
    }

    setPending(true)
    setError('')
    try {
      await register(String(formData.get('email')), password, String(formData.get('name')))
      router.replace('/mine')
    }
    catch (error) {
      setError(error instanceof Error ? error.message : '注册失败，请稍后重试')
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
          <p className="text-muted-foreground mt-2">创建新账号</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">昵称</label>
            <Input id="name" name="name" placeholder="请输入昵称" autoComplete="nickname" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">邮箱</label>
            <Input id="email" name="email" type="email" placeholder="请输入邮箱" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">密码</label>
            <Input id="password" name="password" type="password" placeholder="请输入密码" autoComplete="new-password" minLength={6} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">确认密码</label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="请再次输入密码" autoComplete="new-password" minLength={6} required />
          </div>
          {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
          <Button className="w-full" size="lg" type="submit" disabled={pending}>
            {pending ? '注册中…' : '注册'}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          已有账号？
          <Link href="/login" className="text-primary ml-1 hover:underline">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}
