'use client'

import type { IconSvgElement } from '@hugeicons/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar } from '@propet/ui'
import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_ICON_SIZE = 24
const DEFAULT_ITEM_WIDTH = 64
const DEFAULT_ITEM_HEIGHT = 48
const DEFAULT_LABEL_GAP = 8
const DEFAULT_DOCK_GAP = 8
const DEFAULT_ACTIVE_EXTRA_WIDTH = 0
const DEFAULT_BADGE_MAX = 99
const DOCK_PADDING = 6
const dockTransition = {
  type: 'spring',
  stiffness: 220,
  damping: 20,
  // mass: 0.85,
} as const
// Keep label clipping and opacity monotonic while the surrounding dock springs.
const labelTransition = {
  type: 'tween',
  duration: 0.18,
  ease: 'easeOut',
} as const
export const DOCK_SURFACE_CLASS = 'bg-background/80 backdrop-blur-sm relative flex items-center rounded-full p-1.5 shadow-2xl'

export interface DockItem {
  href: string
  label: string
  icon: IconSvgElement
  avatar?: {
    src: string | null
    name: string
  }
  badge?: boolean | number
}

export interface DockProps {
  items: DockItem[]
  iconSize?: number
  itemWidth?: number
  itemHeight?: number
  labelGap?: number
  dockGap?: number
  activeExtraWidth?: number
  badgeMax?: number
}

export function Dock({
  items,
  iconSize = DEFAULT_ICON_SIZE,
  itemWidth = DEFAULT_ITEM_WIDTH,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  labelGap = DEFAULT_LABEL_GAP,
  dockGap = DEFAULT_DOCK_GAP,
  activeExtraWidth = DEFAULT_ACTIVE_EXTRA_WIDTH,
  badgeMax = DEFAULT_BADGE_MAX,
}: DockProps) {
  const pathname = usePathname()
  const activeIndex = items.findIndex(tab => pathname.startsWith(tab.href))
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [labelWidths, setLabelWidths] = useState<number[]>([])
  const normalizedBadgeMax = Math.max(0, Math.floor(badgeMax))

  const measureLabels = useCallback(() => {
    setLabelWidths(
      items.map((_, index) => labelRefs.current[index]?.offsetWidth ?? 0),
    )
  }, [items])

  useEffect(() => {
    measureLabels()
    window.addEventListener('resize', measureLabels)
    return () => window.removeEventListener('resize', measureLabels)
  }, [measureLabels])

  const getExpandedWidth = (index: number) => {
    const labelWidth = labelWidths[index] ?? 0
    return itemWidth + labelGap + labelWidth + activeExtraWidth
  }

  const activeIndicatorLeft = activeIndex < 0
    ? 0
    : DOCK_PADDING + activeIndex * (itemWidth + dockGap)

  return (
    <nav
      className={`${DOCK_SURFACE_CLASS} max-w-[calc(100vw-1rem)]`}
      style={{ gap: dockGap }}
    >
      {activeIndex >= 0
        ? (
            <motion.div
              aria-hidden
              initial={false}
              animate={{
                left: activeIndicatorLeft,
                width: getExpandedWidth(activeIndex),
              }}
              transition={dockTransition}
              className="bg-primary pointer-events-none absolute z-0 rounded-full"
              style={{ top: DOCK_PADDING, height: itemHeight }}
            />
          )
        : null}
      <div aria-hidden className="pointer-events-none absolute opacity-0">
        {items.map((tab, index) => (
          <span
            key={tab.href}
            ref={(element) => {
              labelRefs.current[index] = element
            }}
            className="text-sm font-medium whitespace-nowrap"
          >
            {tab.label}
          </span>
        ))}
      </div>
      {items.map((tab, i) => {
        const isActive = i === activeIndex
        const labelWidth = labelWidths[i] ?? 0
        const badge = tab.badge
        const hasNumberBadge
          = typeof badge === 'number' && Number.isFinite(badge)
        const numberBadgeLabel = hasNumberBadge
          ? badge > normalizedBadgeMax
            ? `${normalizedBadgeMax}+`
            : String(badge)
          : null
        const hasBadge = badge === true || hasNumberBadge

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-label={tab.label}
            title={tab.label}
            onClick={isActive ? e => e.preventDefault() : undefined}
            className="relative z-10 min-w-0"
          >
            <motion.div
              initial={false}
              animate={{
                width: isActive ? getExpandedWidth(i) : itemWidth,
              }}
              transition={dockTransition}
              className={`relative flex max-w-full items-center justify-center rounded-full transition-colors duration-200 ${
                isActive
                  ? 'text-primary-foreground'
                  : 'text-primary'
              }`}
              style={{ height: itemHeight }}
            >
              <div className="relative z-10 flex items-center">
                <div className="relative shrink-0">
                  {tab.avatar
                    ? (
                        <Avatar
                          key={tab.avatar.src ?? tab.avatar.name}
                          src={tab.avatar.src}
                          name={tab.avatar.name}
                          className="border-primary outline-background size-8 border-2 outline-2 after:border-0"
                        />
                      )
                    : (
                        <HugeiconsIcon
                          icon={tab.icon}
                          size={iconSize}
                        />
                      )}
                  {hasBadge
                    ? (
                        <span
                          className="absolute top-0 right-0 z-20 flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-[10px] leading-none font-semibold text-white"
                          style={hasNumberBadge
                            ? {
                                minWidth: 16,
                                height: 16,
                                paddingInline: 4,
                              }
                            : { width: 8, height: 8 }}
                        >
                          {numberBadgeLabel}
                        </span>
                      )
                    : null}
                </div>
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ width: isActive ? labelGap : 0 }}
                  transition={dockTransition}
                  className="hidden shrink-0 sm:block"
                />
                <motion.span
                  initial={false}
                  animate={{
                    maxWidth: isActive ? labelWidth : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={labelTransition}
                  className="hidden shrink-0 overflow-hidden text-sm font-medium whitespace-nowrap text-primary-foreground sm:inline-block"
                >
                  {tab.label}
                </motion.span>
              </div>
            </motion.div>
          </Link>
        )
      })}
    </nav>
  )
}
