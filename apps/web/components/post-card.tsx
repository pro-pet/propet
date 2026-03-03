'use client'

import { FavouriteIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, cn } from '@propet/ui'
import { motion } from 'motion/react'
import { Avatar } from '@/components/avatar'

export interface PostCardProps {
  id: string
  title: string
  author: string
  likes: string
  coverHeight: number
  coverImage?: string
  coverClassName?: string
  badge?: string
  className?: string
  onOpen?: () => void
  onAuthorClick?: () => void
}

export function getPostLayoutIds(id: string) {
  return {
    card: `post-card-${id}`,
    cover: `post-cover-${id}`,
    title: `post-title-${id}`,
    meta: `post-meta-${id}`,
    badge: `post-badge-${id}`,
  }
}

export function PostCard({
  id,
  title,
  author,
  likes,
  coverHeight,
  coverImage,
  coverClassName,
  badge,
  className,
  onOpen,
  onAuthorClick,
}: PostCardProps) {
  const layoutIds = getPostLayoutIds(id)

  return (
    <motion.article layoutId={layoutIds.card} className={cn('break-inside-avoid', className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={onOpen}
        className="h-auto w-full flex-col items-stretch justify-start gap-0 whitespace-normal rounded-none border-0 p-0 text-left font-normal hover:bg-transparent focus-visible:ring-primary/40 focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <motion.div
          layoutId={layoutIds.cover}
          className={`relative overflow-hidden rounded-lg ${coverImage ? 'bg-muted' : coverClassName ?? 'bg-background'}`}
          style={coverImage
            ? {
                height: coverHeight,
                backgroundImage: `url(${coverImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }
            : { height: coverHeight }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-primary/10 via-transparent to-transparent" />
          {badge
            && (
              <motion.span
                layoutId={layoutIds.badge}
                className="bg-background/80 absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur"
              >
                {badge}
              </motion.span>
            )}
        </motion.div>
      </Button>

      <div className="pt-2">
        <motion.p layoutId={layoutIds.title} className="text-sm leading-snug font-medium">
          {title}
        </motion.p>
        <motion.div layoutId={layoutIds.meta} className="mt-2 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onAuthorClick}
            className="-ml-1 h-auto min-w-0 rounded-full px-1 py-0.5"
          >
            <Avatar
              size="sm"
              name={author}
              fallback={author.slice(0, 1)}
              className="shrink-0"
            />
            <span className="text-muted-foreground truncate text-sm">{author}</span>
          </Button>

          <span className="text-muted-foreground inline-flex shrink-0 items-center gap-1 text-xs">
            <HugeiconsIcon icon={FavouriteIcon} size={14} />
            {likes}
          </span>
        </motion.div>
      </div>
    </motion.article>
  )
}
