'use client'

import { SentIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@propet/ui'
import GradualBlur from '@/components/gradual-blur'

export function PublishHeader({ pending }: { pending: boolean }) {
  return (
    <div className="sticky top-0 z-120 h-24 overflow-visible">
      <header className="relative z-120">
        <div className="mx-auto flex h-24 w-full max-w-3xl items-center justify-between gap-4 px-4 sm:px-7">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">与社区分享</h1>
          <Button
            form="publish-form"
            type="submit"
            size="lg"
            className="h-10 shrink-0 rounded-full px-4"
            disabled={pending}
          >
            <HugeiconsIcon icon={SentIcon} data-icon="inline-start" />
            {pending ? '发布中…' : '发布'}
          </Button>
        </div>
      </header>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-110 h-28">
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
      </div>
    </div>
  )
}
