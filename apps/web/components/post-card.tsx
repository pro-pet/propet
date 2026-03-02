import { FavouriteIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'

export interface PostCardProps {
  id: string
  title: string
  author: string
  likes: string
  coverHeight: number
  coverImage?: string
  coverClassName?: string
  badge?: string
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
}: PostCardProps) {
  return (
    <article className="mb-4 break-inside-avoid">
      <Link href={`/post/${id}`} className="block">
        <div
          className={`relative overflow-hidden rounded-xl ${coverImage ? 'bg-muted' : coverClassName ?? 'bg-background'}`}
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
            ? (
                <span className="bg-background/85 absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur">
                  {badge}
                </span>
              )
            : null}
        </div>

        <div className="pt-2">
          <p className="text-sm leading-snug font-medium">{title}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="bg-primary text-primary-foreground inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                {author.slice(0, 1)}
              </span>
              <span className="text-muted-foreground truncate text-sm">{author}</span>
            </div>

            <span className="text-muted-foreground inline-flex shrink-0 items-center gap-1 text-xs">
              <HugeiconsIcon icon={FavouriteIcon} size={14} />
              {likes}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
