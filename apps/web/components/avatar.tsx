'use client'

import {
  cn,
  Avatar as UiAvatar,
  AvatarFallback as UiAvatarFallback,
  AvatarImage as UiAvatarImage,
} from '@propet/ui'
import * as React from 'react'

function getDefaultFallback(name?: string, alt?: string) {
  const text = name?.trim() || alt?.trim() || ''
  if (!text)
    return '?'

  const words = text.split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return words
      .slice(0, 2)
      .map(word => word[0]!)
      .join('')
      .toUpperCase()
  }

  return Array.from(text).slice(0, 2).join('').toUpperCase()
}

export interface AvatarProps extends Omit<React.ComponentProps<typeof UiAvatar>, 'children'> {
  src?: string | null
  alt?: string
  name?: string
  fallback?: React.ReactNode
  imageClassName?: string
  fallbackClassName?: string
  fallbackDelayMs?: number
}

export function Avatar({
  src,
  alt,
  name,
  fallback,
  className,
  imageClassName,
  fallbackClassName,
  fallbackDelayMs,
  ...props
}: AvatarProps) {
  const normalizedSrc = src?.trim() || undefined
  const fallbackContent = fallback ?? getDefaultFallback(name, alt)

  return (
    <UiAvatar className={className} {...props}>
      {normalizedSrc && (
        <UiAvatarImage
          src={normalizedSrc}
          alt={alt ?? name ?? 'avatar'}
          className={cn(imageClassName)}
        />
      )}
      <UiAvatarFallback
        delayMs={fallbackDelayMs}
        className={cn(fallbackClassName)}
      >
        {fallbackContent}
      </UiAvatarFallback>
    </UiAvatar>
  )
}
