'use client'

import type { ChangeEvent } from 'react'
import type { ImageDraft } from './publish-types'
import { Add01Icon, ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@propet/ui'
import Image from 'next/image'
import { MAX_IMAGES } from './publish-types'

interface PublishImagesCardProps {
  images: ImageDraft[]
  onImageSelect: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (id: string) => void
  onMoveImage: (index: number, direction: -1 | 1) => void
}

export function PublishImagesCard({ images, onImageSelect, onRemoveImage, onMoveImage }: PublishImagesCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="gap-1 pb-4">
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
          <input id="image-upload" type="file" accept="image/*" multiple disabled={images.length >= MAX_IMAGES} className="sr-only" onChange={onImageSelect} />
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
              <Button type="button" variant="ghost" size="icon-xs" aria-label={`删除第 ${index + 1} 张图片`} title="删除图片" onClick={() => onRemoveImage(image.id)} className="rounded-full bg-black/35 text-white hover:bg-black/55 hover:text-white">
                <HugeiconsIcon icon={Cancel01Icon} />
              </Button>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-linear-to-t from-black/60 to-transparent p-1.5 pt-5">
              <Button type="button" variant="ghost" size="icon-xs" aria-label="图片左移" title="左移" disabled={index === 0} onClick={() => onMoveImage(index, -1)} className="rounded-full bg-black/35 text-white hover:bg-black/55 hover:text-white disabled:opacity-40">
                <HugeiconsIcon icon={ArrowLeft01Icon} />
              </Button>
              <Button type="button" variant="ghost" size="icon-xs" aria-label="图片右移" title="右移" disabled={index === images.length - 1} onClick={() => onMoveImage(index, 1)} className="rounded-full bg-black/35 text-white hover:bg-black/55 hover:text-white disabled:opacity-40">
                <HugeiconsIcon icon={ArrowRight01Icon} />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
