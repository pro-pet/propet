'use client'

import type { Pet } from '@/lib/api/pets'
import { AtIcon, HashtagIcon, Search01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button, Input } from '@propet/ui'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@propet/ui/components/popover'
import { COMMUNITY_TOPICS } from './publish-types'

interface ComposerPickerProps {
  type: 'topic' | 'mention'
  open: boolean
  onOpenChange: (open: boolean) => void
  search: string
  onSearchChange: (value: string) => void
  selected: string[]
  onToggle: (value: string) => void
  pets?: Pet[]
}

export function ComposerPicker({
  type,
  open,
  onOpenChange,
  search,
  onSearchChange,
  selected,
  onToggle,
  pets = [],
}: ComposerPickerProps) {
  const isTopic = type === 'topic'
  const normalizedSearch = search.trim().toLowerCase()
  const filteredTopics = COMMUNITY_TOPICS.filter(topic => topic.toLowerCase().includes(normalizedSearch))
  const filteredPets = pets.filter(pet => `${pet.nickname}${pet.species}${pet.breed ?? ''}`.toLowerCase().includes(normalizedSearch))

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
            placeholder={isTopic ? '搜索话题' : '搜索我的宠物'}
            aria-label={isTopic ? '搜索话题' : '搜索我的宠物'}
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
            : filteredPets.map(pet => (
                <button
                  key={pet.id}
                  type="button"
                  aria-pressed={selected.includes(pet.id)}
                  onClick={() => onToggle(pet.id)}
                  className="hover:bg-muted flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Avatar src={pet.avatar} name={pet.nickname} fallback={pet.nickname.slice(0, 1)} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{pet.nickname}</span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {pet.species}
                        {pet.breed ? ` · ${pet.breed}` : ''}
                      </span>
                    </span>
                  </span>
                  {selected.includes(pet.id) && <HugeiconsIcon icon={Tick02Icon} size={17} className="text-primary shrink-0" />}
                </button>
              ))}
          {((isTopic && filteredTopics.length === 0) || (!isTopic && filteredPets.length === 0)) && (
            <p className="text-muted-foreground px-3 py-6 text-center text-sm">没有找到匹配项</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
