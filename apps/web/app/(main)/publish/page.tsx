'use client'

import { SentIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from '@propet/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreatePost } from '@/lib/api/posts'

interface PublishFormValues {
  title: string
  content: string
}

export default function PublishPage() {
  const router = useRouter()
  const createPost = useCreatePost()
  const [error, setError] = useState('')
  const form = useForm<PublishFormValues>({ defaultValues: { title: '', content: '' } })

  const handleSubmit = form.handleSubmit(async (values) => {
    setError('')
    try {
      await createPost.mutateAsync(values)
      router.push('/community')
    }
    catch (error) {
      setError(error instanceof Error ? error.message : '发布失败，请稍后重试')
    }
  })

  return (
    <div className="bg-background min-h-svh">
      <main className="mx-auto max-w-2xl px-5 pb-28 pt-6">
        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="title"
              rules={{ required: '请输入标题', maxLength: { value: 120, message: '标题不能超过 120 个字符' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">标题</FormLabel>
                  <FormControl><Input {...field} placeholder="标题" aria-label="标题" className="h-12" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              rules={{ required: '请输入内容', maxLength: { value: 5000, message: '内容不能超过 5000 个字符' } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">内容</FormLabel>
                  <FormControl><Textarea {...field} placeholder="分享你的故事..." aria-label="分享内容" className="min-h-52 resize-none" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
            <div className="flex justify-end">
              <Button className="rounded-full h-12 px-4 gap-2" type="submit" disabled={form.formState.isSubmitting || createPost.isPending}>
                <HugeiconsIcon icon={SentIcon} />
                {form.formState.isSubmitting || createPost.isPending ? '发布中…' : '发布'}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
