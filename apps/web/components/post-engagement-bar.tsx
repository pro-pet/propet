'use client'

import { AtIcon, Bookmark01Icon, Comment01Icon, FavouriteIcon, Navigation03Icon, Share01Icon, SmileIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, cn, EmojiPicker, Input } from '@propet/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@propet/ui/components/popover'
import { useState } from 'react'

interface EmojiPayload {
  native?: string
}

interface PostEngagementBarProps {
  className?: string
  likes: React.ReactNode
  commentCount: React.ReactNode
  bookmarkCount: React.ReactNode
  inputPlaceholder?: string
  inputValue?: string
  defaultInputValue?: string
  onLike?: () => void
  onComment?: () => void
  onBookmark?: () => void
  onShare?: () => void
  onMention?: () => void
  onInput?: (value: string) => void
  onSend?: (value: string) => void
  onEmojiSelect?: (emoji: EmojiPayload, nextValue: string) => void
}

export function PostEngagementBar({
  className,
  likes,
  commentCount,
  bookmarkCount,
  inputPlaceholder = '写评论',
  inputValue,
  defaultInputValue = '',
  onLike,
  onComment,
  onBookmark,
  onShare,
  onMention,
  onInput,
  onSend,
  onEmojiSelect,
}: PostEngagementBarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [internalInputValue, setInternalInputValue] = useState(defaultInputValue)
  const currentInputValue = inputValue ?? internalInputValue

  function updateInput(nextValue: string) {
    if (inputValue === undefined)
      setInternalInputValue(nextValue)
    onInput?.(nextValue)
  }

  function handleEmojiSelect(emoji: EmojiPayload) {
    if (!emoji.native)
      return
    const nextValue = `${currentInputValue}${emoji.native}`
    updateInput(nextValue)
    onEmojiSelect?.(emoji, nextValue)
    setShowEmojiPicker(false)
  }

  return (
    <div className={cn(className)}>
      <div className="border-border/70 bg-background/70 supports-backdrop-filter:bg-background/55 pointer-events-auto border-t p-4 backdrop-blur-xl">
        <div className="space-y-2.5">
          <div className="text-muted-foreground flex items-center text-sm">
            <Button variant="ghost" onClick={onLike}>
              <HugeiconsIcon icon={FavouriteIcon} size={20} />
              {likes}
            </Button>
            <Button variant="ghost" onClick={onComment}>
              <HugeiconsIcon icon={Comment01Icon} size={20} />
              {commentCount}
            </Button>
            <Button variant="ghost" onClick={onBookmark}>
              <HugeiconsIcon icon={Bookmark01Icon} size={20} />
              {bookmarkCount}
            </Button>
            <Button variant="ghost" onClick={onShare}>
              <HugeiconsIcon icon={Share01Icon} size={20} />
              <span className="sr-only">分享</span>
            </Button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost">
                  <HugeiconsIcon icon={SmileIcon} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={8}
                className="z-340 w-auto gap-0 overflow-hidden rounded-2xl border p-0 shadow-xl"
                onOpenAutoFocus={event => event.preventDefault()}
              >
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </PopoverContent>
            </Popover>
            <Button size="icon" variant="ghost" onClick={onMention}>
              <HugeiconsIcon icon={AtIcon} />
            </Button>
            <div className="min-w-0 flex-1">
              <Input
                placeholder={inputPlaceholder}
                className="h-10 rounded-full bg-background px-4 text-sm"
                value={currentInputValue}
                onChange={event => updateInput(event.target.value)}
              />
            </div>
            <Button className="size-10 rounded-full" onClick={() => onSend?.(currentInputValue)}>
              <HugeiconsIcon icon={Navigation03Icon} size={16} />
              <span className="sr-only">发送</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
