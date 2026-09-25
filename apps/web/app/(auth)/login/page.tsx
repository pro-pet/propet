'use client'

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@propet/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/components/auth-provider'

interface LoginFormValues {
  email: string
  password: string
}

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const form = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } })

  const handleSubmit = form.handleSubmit(async (values) => {
    setError('')
    try {
      await signIn(values.email, values.password)
      router.replace('/mine')
    }
    catch (error) {
      setError(error instanceof Error ? error.message : '登录失败，请稍后重试')
    }
  })

  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <div className="ring-border/50 bg-card w-full max-w-md space-y-8 rounded-2xl p-10 shadow-sm ring-1">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ProPet</h1>
          <p className="text-muted-foreground mt-2">登录你的账号</p>
        </div>

        <Form {...form}>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="email"
              rules={{ required: '请输入邮箱', pattern: { value: /^\S[^\s@]*@\S[^\s.]*\.\S+$/, message: '请输入有效的邮箱地址' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl render={<Input {...field} type="email" autoComplete="email" placeholder="请输入邮箱" />} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{ required: '请输入密码' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl render={<Input {...field} type="password" autoComplete="current-password" placeholder="请输入密码" />} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
            <Button className="w-full" size="lg" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? '登录中…' : '登录'}
            </Button>
          </form>
        </Form>

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
