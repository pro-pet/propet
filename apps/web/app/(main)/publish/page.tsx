'use client'

import type { CommentPermission, ImageDraft, PublishFormValues, Visibility } from '@/components/publish/publish-types'
import { Form } from '@propet/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { PublishContentCard } from '@/components/publish/publish-content-card'
import { PublishHeader } from '@/components/publish/publish-header'
import { PublishImagesCard } from '@/components/publish/publish-images-card'
import { PublishSettingsCard } from '@/components/publish/publish-settings-card'
import { MAX_IMAGES } from '@/components/publish/publish-types'
import { useMyPets } from '@/lib/api/pets'
import { useCreatePost } from '@/lib/api/posts'

export default function PublishPage() {
  const router = useRouter()
  const createPost = useCreatePost()
  const petsQuery = useMyPets()
  const [error, setError] = useState('')
  const [images, setImages] = useState<ImageDraft[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [mentions, setMentions] = useState<string[]>([])
  const [topicSearch, setTopicSearch] = useState('')
  const [mentionSearch, setMentionSearch] = useState('')
  const [activeComposerTool, setActiveComposerTool] = useState<'topic' | 'mention' | null>(null)
  const [location, setLocation] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('public')
  const [audienceUsers, setAudienceUsers] = useState<string[]>([])
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')
  const [commentPermission, setCommentPermission] = useState<CommentPermission>('all')
  const fileUrls = useRef<string[]>([])
  const form = useForm<PublishFormValues>({ defaultValues: { title: '', content: '' } })
  const title = useWatch({ control: form.control, name: 'title' })
  const content = useWatch({ control: form.control, name: 'content' })

  useEffect(() => {
    return () => {
      fileUrls.current.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const appendToContent = (value: string) => {
    const current = form.getValues('content').trimEnd()
    const separator = current.length > 0 ? ' ' : ''
    form.setValue('content', `${current}${separator}${value}`, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const removeFromContent = (value: string) => {
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const nextContent = form.getValues('content')
      .replace(new RegExp(`(^|\\s)${escapedValue}(?=\\s|$)`, 'g'), ' ')
      .replace(/[ \t]{2,}/g, ' ')
      .trim()
    form.setValue('content', nextContent, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const toggleTopic = (value: string) => {
    if (topics.includes(value)) {
      setTopics(current => current.filter(item => item !== value))
      removeFromContent(`#${value}`)
      return
    }
    setTopics(current => [...current, value])
    appendToContent(`#${value}`)
  }

  const toggleMention = (value: string) => {
    const pet = petsQuery.data?.find(item => item.id === value)
    if (!pet)
      return
    if (mentions.includes(value)) {
      setMentions(current => current.filter(item => item !== value))
      removeFromContent(`@${pet.nickname}`)
      return
    }
    setMentions(current => [...current, value])
    appendToContent(`@${pet.nickname}`)
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const available = MAX_IMAGES - images.length
    const files = Array.from(event.target.files ?? []).slice(0, available)
    const drafts = files.map((file) => {
      const url = URL.createObjectURL(file)
      fileUrls.current.push(url)
      return { id: `${file.name}-${file.lastModified}-${url}`, name: file.name, url }
    })
    setImages(current => [...current, ...drafts])
    event.currentTarget.value = ''
  }

  const removeImage = (id: string) => {
    setImages((current) => {
      const image = current.find(item => item.id === id)
      if (image) {
        URL.revokeObjectURL(image.url)
        fileUrls.current = fileUrls.current.filter(url => url !== image.url)
      }
      return current.filter(item => item.id !== id)
    })
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= images.length)
      return
    setImages((current) => {
      const next = [...current]
      const [image] = next.splice(index, 1)
      next.splice(nextIndex, 0, image!)
      return next
    })
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    setError('')
    if (scheduleEnabled) {
      setError('定时发布暂未接入服务端，请关闭定时发布后再提交。')
      return
    }

    try {
      await createPost.mutateAsync({ ...values, petIds: mentions })
      router.push('/community')
    }
    catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '发布失败，请稍后重试')
    }
  })

  return (
    <div className="bg-background min-h-svh">
      <PublishHeader pending={form.formState.isSubmitting || createPost.isPending} />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pb-32 pt-2 sm:gap-6 sm:px-7 sm:pt-4">
        <Form {...form}>
          <form id="publish-form" className="flex flex-col gap-5 sm:gap-6" onSubmit={handleSubmit}>
            <PublishContentCard
              control={form.control}
              titleLength={title?.length ?? 0}
              contentLength={content?.length ?? 0}
              activeComposerTool={activeComposerTool}
              onComposerToolChange={setActiveComposerTool}
              topicSearch={topicSearch}
              onTopicSearchChange={setTopicSearch}
              mentionSearch={mentionSearch}
              onMentionSearchChange={setMentionSearch}
              topics={topics}
              mentions={mentions}
              onTopicToggle={toggleTopic}
              onMentionToggle={toggleMention}
              pets={petsQuery.data ?? []}
            />
            <PublishImagesCard
              images={images}
              onImageSelect={handleImageSelect}
              onRemoveImage={removeImage}
              onMoveImage={moveImage}
            />
            <PublishSettingsCard
              location={location}
              onLocationChange={setLocation}
              visibility={visibility}
              onVisibilityChange={setVisibility}
              audienceUsers={audienceUsers}
              onAudienceUsersChange={setAudienceUsers}
              scheduleEnabled={scheduleEnabled}
              onScheduleEnabledChange={setScheduleEnabled}
              scheduleAt={scheduleAt}
              onScheduleAtChange={setScheduleAt}
              commentPermission={commentPermission}
              onCommentPermissionChange={setCommentPermission}
            />
            {error && <p role="alert" className="text-destructive px-1 text-sm">{error}</p>}
          </form>
        </Form>
      </div>
    </div>
  )
}
