'use client'

import { AtIcon, HashtagIcon, Search01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button, Input } from '@propet/ui'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@propet/ui/components/popover'
import { COMMUNITY_TOPICS, FOLLOWING_PEOPLE } from './publish-types'

interface ComposerPickerProps {
  type: 'topic' | 'mention'
  open: boolean
  onOpenChange: (open: boolean) => void
  search: string
  onSearchChange: (value: string) => void
  selected: string[]
  onToggle: (value: string) => void
}

export function ComposerPicker({
  type,
  open,
  onOpenChange,
  search,
  onSearchChange,
  selected,
  onToggle,
}: ComposerPickerProps) {
  const isTopic = type === 'topic'
  const normalizedSearch = search.trim().toLowerCase()
  const filteredPeople = FOLLOWING_PEOPLE.filter(person => `${person.value}${person.subtitle}`.toLowerCase().includes(normalizedSearch))
  const filteredTopics = COMMUNITY_TOPICS.filter(topic => topic.toLowerCase().includes(normalizedSearch))

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
            ? filteredTopics.map(topic => (
                <button
                  key={topic}
                  type="button"
                  aria-pressed={selected.includes(topic)}
                  onClick={() => onToggle(topic)}
                  className="hover:bg-muted flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="text-primary flex size-7 shrink-0 items-center justify-center">
                      <HugeiconsIcon icon={HashtagIcon} size={16} />
                    </span>
                    <span className="truncate">{topic}</span>
                  </span>
                  {selected.includes(topic) && <HugeiconsIcon icon={Tick02Icon} size={17} className="text-primary shrink-0" />}
                </button>
              ))
            : filteredPeople.map(person => (
                <button
                  key={person.value}
                  type="button"
                  aria-pressed={selected.includes(person.value)}
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
                  {selected.includes(person.value) && <HugeiconsIcon icon={Tick02Icon} size={17} className="text-primary shrink-0" />}
                </button>
              ))}
          {((isTopic && filteredTopics.length === 0) || (!isTopic && filteredPeople.length === 0)) && (
            <p className="text-muted-foreground px-3 py-6 text-center text-sm">没有找到匹配项</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
