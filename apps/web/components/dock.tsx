'use client'

import type { IconSvgElement } from '@hugeicons/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { LayoutGroup, motion } from 'motion/react'
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
const dockTransition = { duration: 0.22 } as const

export interface DockItem {
  href: string
  label: string
  icon: IconSvgElement
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

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed opacity-0">
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

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-6">
        <LayoutGroup id="dock">
          <nav
            className="bg-background/70 ring-border/50 pointer-events-auto relative flex items-center rounded-full p-1.5 shadow-lg ring-1 backdrop-blur-xl"
            style={{ gap: dockGap }}
          >
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
                  onClick={isActive ? e => e.preventDefault() : undefined}
                  className="relative z-10"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      width: isActive ? getExpandedWidth(i) : itemWidth,
                    }}
                    transition={dockTransition}
                    className={`relative flex items-center justify-center rounded-full transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    style={{ height: itemHeight }}
                  >
                    {isActive
                      ? (
                          <motion.div
                            layoutId="dock-active-indicator"
                            transition={{
                              type: 'spring',
                              damping: 15,
                              stiffness: 150,
                            }}
                            className="bg-primary absolute inset-0 rounded-full"
                          />
                        )
                      : null}

                    <div className="relative z-10 flex items-center">
                      <div className="relative shrink-0">
                        <HugeiconsIcon
                          icon={tab.icon}
                          size={iconSize}
                        />
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
                        className="block shrink-0"
                      />
                      <motion.span
                        initial={false}
                        animate={{
                          maxWidth: isActive ? labelWidth : 0,
                          opacity: isActive ? 1 : 0,
                        }}
                        transition={dockTransition}
                        className="inline-block overflow-hidden text-sm font-medium whitespace-nowrap"
                      >
                        {tab.label}
                      </motion.span>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </LayoutGroup>
      </div>
    </>
  )
}
