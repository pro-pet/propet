'use client'

import type { Control } from 'react-hook-form'
import type { PublishFormValues } from './publish-types'
import type { Pet } from '@/lib/api/pets'
import { Card, CardContent, CardFooter, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from '@propet/ui'
import { ComposerPicker } from './composer-picker'

interface PublishContentCardProps {
  control: Control<PublishFormValues>
  titleLength: number
  contentLength: number
  activeComposerTool: 'topic' | 'mention' | null
  onComposerToolChange: (tool: 'topic' | 'mention' | null) => void
  topicSearch: string
  onTopicSearchChange: (value: string) => void
  mentionSearch: string
  onMentionSearchChange: (value: string) => void
  topics: string[]
  mentions: string[]
  onTopicToggle: (value: string) => void
  onMentionToggle: (value: string) => void
  pets: Pet[]
}

export function PublishContentCard({
  control,
  titleLength,
  contentLength,
  activeComposerTool,
  onComposerToolChange,
  topicSearch,
  onTopicSearchChange,
  mentionSearch,
  onMentionSearchChange,
  topics,
  mentions,
  onTopicToggle,
  onMentionToggle,
  pets,
}: PublishContentCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3">
        <FormField
          control={control}
          name="title"
          rules={{ required: '请输入标题', maxLength: { value: 120, message: '标题不能超过 120 个字符' } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">标题</FormLabel>
              <div className="relative">
                <FormControl render={<Input {...field} placeholder="给这次分享起个标题" aria-label="标题" className="border-0 rounded-none bg-transparent px-0 pr-14 text-lg font-semibold shadow-none placeholder:text-muted-foreground/60 focus:border-0 sm:text-xl" />} />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center text-xs">
                  {titleLength}
                  /120
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
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
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <ComposerPicker
              type="topic"
              open={activeComposerTool === 'topic'}
              onOpenChange={open => onComposerToolChange(open ? 'topic' : null)}
              search={topicSearch}
              onSearchChange={onTopicSearchChange}
              selected={topics}
              onToggle={onTopicToggle}
            />
            <ComposerPicker
              type="mention"
              open={activeComposerTool === 'mention'}
              onOpenChange={open => onComposerToolChange(open ? 'mention' : null)}
              search={mentionSearch}
              onSearchChange={onMentionSearchChange}
              selected={mentions}
              onToggle={onMentionToggle}
              pets={pets}
            />
          </div>
          <span className="text-muted-foreground text-xs">
            {contentLength}
            /5000
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
