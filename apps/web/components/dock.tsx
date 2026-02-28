"use client"

import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutGroup, motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

const ICON_SIZE = 64
const ICON_GAP = 8
const ACTIVE_EXTRA_WIDTH = 0
const dockTransition = { duration: 0.22 } as const

export interface DockItem {
  href: string
  label: string
  icon: IconSvgElement
}

export function Dock({ items }: { items: DockItem[] }) {
  const pathname = usePathname()
  const activeIndex = items.findIndex((tab) => pathname.startsWith(tab.href))
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [labelWidths, setLabelWidths] = useState<number[]>([])

  const measureLabels = useCallback(() => {
    setLabelWidths(
      items.map((_, index) => labelRefs.current[index]?.offsetWidth ?? 0),
    )
  }, [items])

  useEffect(() => {
    measureLabels()
    window.addEventListener("resize", measureLabels)
    return () => window.removeEventListener("resize", measureLabels)
  }, [measureLabels])

  const getExpandedWidth = (index: number) => {
    const labelWidth = labelWidths[index] ?? 0
    return ICON_SIZE + ICON_GAP + labelWidth + ACTIVE_EXTRA_WIDTH
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
          <nav className="bg-background/70 ring-border/50 pointer-events-auto relative flex h-15 items-center gap-2 rounded-full p-1.5 shadow-lg ring-1 backdrop-blur-xl">
            {items.map((tab, i) => {
              const isActive = i === activeIndex
              const labelWidth = labelWidths[i] ?? 0

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-label={tab.label}
                  onClick={isActive ? (e) => e.preventDefault() : undefined}
                  className="relative z-10"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      width: isActive ? getExpandedWidth(i) : ICON_SIZE,
                    }}
                    transition={dockTransition}
                    className={`relative flex h-12 items-center justify-center rounded-full transition-colors duration-200 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive ? (
                      <motion.div
                        layoutId="dock-active-indicator"
                        transition={{
                          type: 'spring',
                          damping: 15,
                          stiffness: 150,
                        }}
                        className="bg-primary absolute inset-0 rounded-full"
                      />
                    ) : null}

                    <div className="relative z-10 flex items-center overflow-hidden">
                      <HugeiconsIcon
                        icon={tab.icon}
                        size={24}
                        className="shrink-0"
                      />
                      <motion.span
                        aria-hidden
                        initial={false}
                        animate={{ width: isActive ? ICON_GAP : 0 }}
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
