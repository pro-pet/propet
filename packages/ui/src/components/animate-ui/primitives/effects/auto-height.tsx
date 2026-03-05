'use client'

import type { WithAsChild } from '@propet/ui/components/animate-ui/primitives/animate/slot'
import type { HTMLMotionProps, LegacyAnimationControls, TargetAndTransition, Transition } from 'motion/react'
import { Slot } from '@propet/ui/components/animate-ui/primitives/animate/slot'

import { useAutoHeight } from '@propet/ui/hooks/use-auto-height'
import { motion } from 'motion/react'
import * as React from 'react'

type AutoHeightProps = WithAsChild<
  {
    children: React.ReactNode
    deps?: React.DependencyList
    animate?: TargetAndTransition | LegacyAnimationControls
    transition?: Transition
  } & Omit<HTMLMotionProps<'div'>, 'animate'>
>

const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  bounce: 0,
  restDelta: 0.01,
}

const defaultDeps: React.DependencyList = []

function AutoHeight({
  children,
  deps = defaultDeps,
  transition = defaultTransition,
  style,
  animate,
  asChild = false,
  ...props
}: AutoHeightProps) {
  const { ref, height } = useAutoHeight<HTMLDivElement>(deps)

  const Comp = asChild ? Slot : motion.div

  return (
    <Comp
      style={{ overflow: 'hidden', ...style }}
      animate={{ height, ...animate }}
      transition={transition}
      {...props}
    >
      <div ref={ref}>{children}</div>
    </Comp>
  )
}

export { AutoHeight, type AutoHeightProps }
