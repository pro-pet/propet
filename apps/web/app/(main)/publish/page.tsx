'use client'

import type { IconSvgElement } from '@hugeicons/react'
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  AtIcon,
  Calendar03Icon,
  Cancel01Icon,
  Comment01Icon,
  HashtagIcon,
  Location01Icon,
  Search01Icon,
  SentIcon,
  Tick02Icon,
  UserIcon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  Textarea,
} from '@propet/ui'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@propet/ui/components/popover'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import GradualBlur from '@/components/gradual-blur'
import { useCreatePost } from '@/lib/api/posts'

const MAX_IMAGES = 9

const FOLLOWING_PEOPLE = [
  { value: '团子麻麻', subtitle: '宠物日常', avatar: '团' },
  { value: '奶糕', subtitle: '猫咪生活', avatar: '奶' },
  { value: '柚子', subtitle: '养宠分享', avatar: '柚' },
  { value: '阿椰', subtitle: '健康养护', avatar: '椰' },
  { value: '眠眠', subtitle: '宠物探店', avatar: '眠' },
  { value: 'Momo', subtitle: '狗狗训练', avatar: 'M' },
] as const

const COMMUNITY_TOPICS = ['萌宠日常', '宠物穿搭', '健康养护', '洗护测评', '领养故事', '周末探店', '新手养宠', '宠物好物']

type Visibility = 'public' | 'private' | 'mutuals' | 'selected' | 'excluded'
type CommentPermission = 'all' | 'self' | 'mutuals' | 'followers' | 'none'

const VISIBILITY_LABELS: Record<Visibility, string> = {
  public: '公开可见',
  private: '仅自己可见',
  mutuals: '仅互关好友可见',
  selected: '只给谁看',
  excluded: '不给谁看',
}

const COMMENT_PERMISSION_LABELS: Record<CommentPermission, string> = {
  all: '允许所有人评论',
  self: '只允许自己评论',
  mutuals: '只允许互关好友评论',
  followers: '只允许粉丝评论',
  none: '不允许评论',
}

interface PublishFormValues {
  title: string
  content: string
}

interface ImageDraft {
  id: string
  name: string
  url: string
}

interface SettingRowProps {
  icon: IconSvgElement
  title: string
  children: React.ReactNode
}

interface ComposerPickerProps {
  type: 'topic' | 'mention'
  open: boolean
  onOpenChange: (open: boolean) => void
  search: string
  onSearchChange: (value: string) => void
  selected: string[]
  onToggle: (value: string) => void
}

function ComposerPicker({
  type,
  open,
  onOpenChange,
  search,
  onSearchChange,
  selected,
  onToggle,
}: ComposerPickerProps) {
  const isTopic = type === 'topic'
  const filteredPeople = FOLLOWING_PEOPLE.filter(person => `${person.value}${person.subtitle}`.toLowerCase().includes(search.trim().toLowerCase()))
  const filteredTopics = COMMUNITY_TOPICS.filter(topic => topic.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={<Button type="button" variant={open ? 'secondary' : 'ghost'} />}>
        <HugeiconsIcon icon={isTopic ? HashtagIcon : AtIcon} data-icon="inline-start" />
        {isTopic ? '话题' : '提及'}
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="w-[min(20rem,calc(100vw-2rem))] gap-3 p-3">
        <PopoverHeader>
          <PopoverTitle>{isTopic ? '选择话题' : '选择提及对象'}</PopoverTitle>
        </PopoverHeader>
        <div className="relative">
          <HugeiconsIcon icon={Search01Icon} size={16} className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2" />
          <Input
            autoFocus
            value={search}
            onChange={event => onSearchChange(event.target.value)}
            placeholder={isTopic ? '搜索话题' : '搜索我关注的人'}
            aria-label={isTopic ? '搜索话题' : '搜索我关注的人'}
            className="h-9 pl-9"
          />
        </div>
        <div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
          {isTopic
            ? filteredTopics.map((topic) => {
                const active = selected.includes(topic)
                return (
                  <button
                    key={topic}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onToggle(topic)}
                    className="hover:bg-muted flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="text-primary flex size-7 shrink-0 items-center justify-center">
                        <HugeiconsIcon icon={HashtagIcon} size={16} />
                      </span>
                      <span className="truncate">{topic}</span>
                    </span>
                    {active && <HugeiconsIcon icon={Tick02Icon} size={17} className="text-primary shrink-0" />}
                  </button>
                )
              })
            : filteredPeople.map((person) => {
                const active = selected.includes(person.value)
                return (
                  <button
                    key={person.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onToggle(person.value)}
                    className="hover:bg-muted flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Avatar name={person.value} fallback={person.avatar} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{person.value}</span>
                        <span className="text-muted-foreground block truncate text-xs">{person.subtitle}</span>
                      </span>
                    </span>
                    {active && <HugeiconsIcon icon={Tick02Icon} size={17} className="text-primary shrink-0" />}
                  </button>
                )
              })}
          {((isTopic && filteredTopics.length === 0) || (!isTopic && filteredPeople.length === 0)) && (
            <p className="text-muted-foreground px-3 py-6 text-center text-sm">没有找到匹配项</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function SettingRow({ icon, title, children }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-xl">
          <HugeiconsIcon icon={icon} size={19} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
        </div>
      </div>
      <div className="flex w-full shrink-0 items-center sm:w-auto sm:justify-end">{children}</div>
    </div>
  )
}

function PublishHeader({ pending }: { pending: boolean }) {
  return (
    <div className="sticky top-0 z-120 h-24 overflow-visible">
      <header className="relative z-120">
        <div className="mx-auto flex h-24 w-full max-w-3xl items-center justify-between gap-4 px-4 sm:px-7">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">与社区分享</h1>
          <Button
            form="publish-form"
            type="submit"
            size="lg"
            className="h-10 shrink-0 rounded-full px-4"
            disabled={pending}
          >
            <HugeiconsIcon icon={SentIcon} data-icon="inline-start" />
            {pending ? '发布中…' : '发布'}
          </Button>
        </div>
      </header>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-110 h-28">
        <GradualBlur
          target="page"
          position="top"
          height="7rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
          zIndex={10}
        />
      </div>
    </div>
  )
}

export default function PublishPage() {
  const router = useRouter()
  const createPost = useCreatePost()
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
  const [audienceInput, setAudienceInput] = useState('')
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
      shouldValidate: true,
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
      shouldValidate: true,
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
    if (mentions.includes(value)) {
      setMentions(current => current.filter(item => item !== value))
      removeFromContent(`@${value}`)
      return
    }
    setMentions(current => [...current, value])
    appendToContent(`@${value}`)
  }

  const addAudienceUser = () => {
    const value = audienceInput.trim().replace(/^@/, '')
    if (!value || audienceUsers.includes(value)) {
      setAudienceInput('')
      return
    }
    setAudienceUsers(current => [...current, value])
    setAudienceInput('')
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
      await createPost.mutateAsync(values)
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
            <Card size="sm">
              <CardContent className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: '请输入标题', maxLength: { value: 120, message: '标题不能超过 120 个字符' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">标题</FormLabel>
                      <div className="relative">
                        <FormControl render={<Input {...field} placeholder="给这次分享起个标题" aria-label="标题" className="h-12 border-0 rounded-none bg-transparent px-0 pr-14 text-lg font-semibold shadow-none placeholder:text-muted-foreground/60 focus:border-0 sm:text-xl" />} />
                        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center text-xs">
                          {title?.length ?? 0}
                          /120
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="bg-border/70 h-px" />
                <FormField
                  control={form.control}
                  name="content"
                  rules={{ required: '请输入内容', maxLength: { value: 5000, message: '内容不能超过 5000 个字符' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">内容</FormLabel>
                      <FormControl render={<Textarea {...field} placeholder="记录毛孩子的日常，分享你的经验或发现…" aria-label="分享内容" className="min-h-48 rounded-none border-0 bg-transparent px-0 py-1 leading-7 shadow-none focus:border-0 sm:min-h-56" />} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(topics.length > 0 || mentions.length > 0) && (
                  <div className="flex flex-wrap gap-2 border-t border-border/70 pt-3">
                    {topics.map(topic => (
                      <span key={`topic-${topic}`} className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full py-1 pl-2.5 pr-1 text-xs font-medium">
                        #
                        {topic}
                        <button
                          type="button"
                          aria-label={`移除话题 ${topic}`}
                          onClick={() => {
                            setTopics(current => current.filter(item => item !== topic))
                            removeFromContent(`#${topic}`)
                          }}
                          className="hover:bg-primary/15 flex size-5 items-center justify-center rounded-full"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={13} />
                        </button>
                      </span>
                    ))}
                    {mentions.map(mention => (
                      <span key={`mention-${mention}`} className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full py-1 pl-2.5 pr-1 text-xs font-medium">
                        @
                        {mention}
                        <button
                          type="button"
                          aria-label={`移除提及 ${mention}`}
                          onClick={() => {
                            setMentions(current => current.filter(item => item !== mention))
                            removeFromContent(`@${mention}`)
                          }}
                          className="hover:bg-muted flex size-5 items-center justify-center rounded-full"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex-col items-stretch gap-3 border-t border-border/70 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <ComposerPicker
                      type="topic"
                      open={activeComposerTool === 'topic'}
                      onOpenChange={open => setActiveComposerTool(open ? 'topic' : null)}
                      search={topicSearch}
                      onSearchChange={setTopicSearch}
                      selected={topics}
                      onToggle={toggleTopic}
                    />
                    <ComposerPicker
                      type="mention"
                      open={activeComposerTool === 'mention'}
                      onOpenChange={open => setActiveComposerTool(open ? 'mention' : null)}
                      search={mentionSearch}
                      onSearchChange={setMentionSearch}
                      selected={mentions}
                      onToggle={toggleMention}
                    />
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {content?.length ?? 0}
                    /5000
                  </span>
                </div>

              </CardFooter>
            </Card>

            <Card size="sm">
              <CardHeader className="gap-1 border-b border-border/70 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>图片编辑</CardTitle>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {images.length}
                    /9
                  </span>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
                <label
                  htmlFor="image-upload"
                  aria-disabled={images.length >= MAX_IMAGES}
                  className={`border-border bg-muted/40 flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors ${images.length < MAX_IMAGES ? 'hover:bg-muted cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                >
                  <span className="bg-background text-muted-foreground flex size-9 items-center justify-center rounded-full shadow-sm">
                    <HugeiconsIcon icon={Add01Icon} size={18} />
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">添加图片</span>
                  <input id="image-upload" type="file" accept="image/*" multiple disabled={images.length >= MAX_IMAGES} className="sr-only" onChange={handleImageSelect} />
                </label>

                {images.map((image, index) => (
                  <div key={image.id} className="bg-muted relative aspect-square overflow-hidden rounded-xl">
                    <Image src={image.url} alt={image.name} fill unoptimized className="object-cover" sizes="(max-width: 640px) 30vw, 160px" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-linear-to-b from-black/55 to-transparent p-1.5">
                      <span className="rounded-full bg-black/35 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        第
                        {index + 1}
                        {' '}
                        张
                      </span>
                      <Button type="button" variant="ghost" size="icon-xs" aria-label={`删除第 ${index + 1} 张图片`} title="删除图片" onClick={() => removeImage(image.id)} className="rounded-full bg-black/35 text-white hover:bg-black/55 hover:text-white">
                        <HugeiconsIcon icon={Cancel01Icon} />
                      </Button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-linear-to-t from-black/60 to-transparent p-1.5 pt-5">
                      <Button type="button" variant="ghost" size="icon-xs" aria-label="图片左移" title="左移" disabled={index === 0} onClick={() => moveImage(index, -1)} className="rounded-full bg-black/35 text-white hover:bg-black/55 hover:text-white disabled:opacity-40">
                        <HugeiconsIcon icon={ArrowLeft01Icon} />
                      </Button>
                      <Button type="button" variant="ghost" size="icon-xs" aria-label="图片右移" title="右移" disabled={index === images.length - 1} onClick={() => moveImage(index, 1)} className="rounded-full bg-black/35 text-white hover:bg-black/55 hover:text-white disabled:opacity-40">
                        <HugeiconsIcon icon={ArrowRight01Icon} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader className="border-b border-border/70 pb-4">
                <CardTitle>发布设置</CardTitle>
              </CardHeader>
              <CardContent className="divide-border/70 divide-y">
                <SettingRow icon={Location01Icon} title="地点">
                  <div className="w-full sm:w-52">
                    <Input value={location} onChange={event => setLocation(event.target.value)} placeholder="添加地点" aria-label="发布地点" />
                  </div>
                </SettingRow>

                <SettingRow icon={ViewIcon} title="可见范围">
                  <Select value={visibility} onValueChange={value => setVisibility(value as Visibility)}>
                    <SelectTrigger aria-label="可见范围" className="w-full sm:w-52">
                      <span className="truncate">{VISIBILITY_LABELS[visibility]}</span>
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectGroup>
                        <SelectItem value="public">公开可见</SelectItem>
                        <SelectItem value="private">仅自己可见</SelectItem>
                        <SelectItem value="mutuals">仅互关好友可见</SelectItem>
                        <SelectItem value="selected">只给谁看</SelectItem>
                        <SelectItem value="excluded">不给谁看</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </SettingRow>

                <AnimatePresence initial={false} mode="wait">
                  {(visibility === 'selected' || visibility === 'excluded') && (
                    <motion.div
                      key={visibility}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.24, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.16 } }}
                      className="overflow-hidden"
                    >
                      <div className="bg-muted/40 flex flex-col gap-2 rounded-xl px-3 py-3 sm:ml-12">
                        {audienceUsers.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {audienceUsers.map(user => (
                              <span key={user} className="bg-background inline-flex items-center gap-1 rounded-full py-1 pl-2.5 pr-1 text-xs font-medium shadow-sm">
                                @
                                {user}
                                <button type="button" aria-label={`移除用户 ${user}`} onClick={() => setAudienceUsers(current => current.filter(item => item !== user))} className="text-muted-foreground hover:bg-muted flex size-5 items-center justify-center rounded-full">
                                  <HugeiconsIcon icon={Cancel01Icon} size={13} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={UserIcon} size={16} className="text-muted-foreground shrink-0" />
                          <Input
                            value={audienceInput}
                            onChange={event => setAudienceInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault()
                                addAudienceUser()
                              }
                            }}
                            placeholder={visibility === 'selected' ? '输入用户名，添加可见的人' : '输入用户名，添加要排除的人'}
                            aria-label={visibility === 'selected' ? '添加可见用户' : '添加排除用户'}
                            className="h-8 border-0 bg-transparent px-0 shadow-none"
                          />
                          <Button type="button" variant="ghost" size="icon-sm" aria-label="添加受众" title="添加受众" onClick={addAudienceUser}>
                            <HugeiconsIcon icon={Add01Icon} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <SettingRow icon={Calendar03Icon} title="定时发布">
                  <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
                    <label className="text-muted-foreground flex items-center gap-2 text-sm sm:justify-end">
                      <Checkbox checked={scheduleEnabled} onCheckedChange={checked => setScheduleEnabled(checked === true)} aria-label="启用定时发布" />
                      启用定时发布
                    </label>
                    <AnimatePresence initial={false}>
                      {scheduleEnabled && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, y: -4 }}
                          animate={{ height: 'auto', opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -4 }}
                          transition={{ height: { duration: 0.24, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.16 }, y: { duration: 0.2 } }}
                          className="w-full overflow-hidden sm:w-52"
                        >
                          <Input type="datetime-local" value={scheduleAt} onChange={event => setScheduleAt(event.target.value)} aria-label="定时发布时间" className="h-9 w-full" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </SettingRow>

                <SettingRow icon={Comment01Icon} title="互动权限">
                  <Select value={commentPermission} onValueChange={value => setCommentPermission(value as CommentPermission)}>
                    <SelectTrigger aria-label="互动权限" className="w-full sm:w-52">
                      <span className="truncate">{COMMENT_PERMISSION_LABELS[commentPermission]}</span>
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectGroup>
                        <SelectItem value="all">允许所有人评论</SelectItem>
                        <SelectItem value="self">只允许自己评论</SelectItem>
                        <SelectItem value="mutuals">只允许互关好友评论</SelectItem>
                        <SelectItem value="followers">只允许粉丝评论</SelectItem>
                        <SelectItem value="none">不允许评论</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </SettingRow>
              </CardContent>
            </Card>

            {error && <p role="alert" className="text-destructive px-1 text-sm">{error}</p>}
          </form>
        </Form>
      </div>
    </div>
  )
}
