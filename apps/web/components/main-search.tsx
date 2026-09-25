'use client'

import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import GradualBlur from '@/components/gradual-blur'
import { PageSearch } from '@/components/page-search'

const SEARCH_PATHS = new Set(['/community', '/shopping'])

export function MainSearch() {
  const pathname = usePathname()
  const shouldShow = pathname !== null && SEARCH_PATHS.has(pathname)

  return (
    <AnimatePresence initial={false} mode="wait">
      {shouldShow && (
        <motion.div
          key="main-search"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: '6rem', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
            opacity: { duration: 0.2, ease: 'easeOut' },
          }}
          className="sticky top-0 z-[120] overflow-visible"
        >
          <motion.header
            initial={{ y: -12 }}
            animate={{ y: 0 }}
            exit={{ y: -12 }}
            transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            className="relative z-[120]"
          >
            <div className="mx-auto flex h-24 w-full max-w-6xl items-center px-4 sm:px-7">
              <PageSearch />
            </div>
          </motion.header>

          <motion.div
            className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-28"
          >
            <GradualBlur
              target="page"
              position="top"
              height="7rem"
              strength={2}
              divCount={5}
              curve="bezier"
              exponential
              opacity={1}
              zIndex={10}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
