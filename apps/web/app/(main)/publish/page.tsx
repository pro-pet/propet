'use client'

import type { FormEvent } from 'react'
import { SentIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Input, Textarea } from '@propet/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PageSearch } from '@/components/page-search'
import { useCreatePost } from '@/lib/api/posts'

export default function PublishPage() {
  const router = useRouter()
  const createPost = useCreatePost()
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError('')
    try {
      await createPost.mutateAsync({
        title: String(formData.get('title')),
        content: String(formData.get('content')),
      })
      router.push('/community')
    }
    catch (error) {
      setError(error instanceof Error ? error.message : '发布失败，请稍后重试')
    }
  }

  return (
    <div className="bg-background min-h-svh">
      <header className="sticky top-0 z-[120]">
        <div className="mx-auto flex h-24 max-w-2xl items-center px-5">
          <PageSearch />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 pb-28 pt-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input name="title" placeholder="标题" aria-label="标题" className="h-12" maxLength={120} required />
          <Textarea name="content" placeholder="分享你的故事..." aria-label="分享内容" className="min-h-52 resize-none" maxLength={5000} required />
          {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
          <div className="flex justify-end">
            <Button className="rounded-full h-12 px-4 gap-2" type="submit" disabled={createPost.isPending}>
              <HugeiconsIcon icon={SentIcon} />
              {createPost.isPending ? '发布中…' : '发布'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
