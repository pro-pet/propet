'use client'

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@propet/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/components/auth-provider'

interface RegisterFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const form = useForm<RegisterFormValues>({ defaultValues: { name: '', email: '', password: '', confirmPassword: '' } })

  const handleSubmit = form.handleSubmit(async (values) => {
    setError('')
    try {
      await register(values.email, values.password, values.name)
      router.replace('/mine')
    }
    catch (error) {
      setError(error instanceof Error ? error.message : '注册失败，请稍后重试')
    }
  })

  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <div className="ring-border/50 bg-card w-full max-w-md space-y-8 rounded-2xl p-10 shadow-sm ring-1">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ProPet</h1>
          <p className="text-muted-foreground mt-2">创建新账号</p>
        </div>

        <Form {...form}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="name"
              rules={{ required: '请输入昵称' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>昵称</FormLabel>
                  <FormControl><Input {...field} placeholder="请输入昵称" autoComplete="nickname" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{ required: '请输入邮箱', pattern: { value: /^\S[^\s@]*@\S[^\s.]*\.\S+$/, message: '请输入有效的邮箱地址' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl><Input {...field} type="email" placeholder="请输入邮箱" autoComplete="email" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{ required: '请输入密码', minLength: { value: 6, message: '密码至少需要 6 位' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl><Input {...field} type="password" placeholder="请输入密码" autoComplete="new-password" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{ required: '请再次输入密码', validate: value => value === form.getValues('password') || '两次输入的密码不一致' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl><Input {...field} type="password" placeholder="请再次输入密码" autoComplete="new-password" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
            <Button className="w-full" size="lg" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? '注册中…' : '注册'}
            </Button>
          </form>
        </Form>

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
