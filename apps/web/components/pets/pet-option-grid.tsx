'use client'

import { cn } from '@propet/ui'
import { motion } from 'motion/react'

export interface PetOption {
  value: string
  label: string
  /** 球内的备用表情，图片缺省时展示 */
  icon: string
  /** 球内的图片，未来接入真实图片 */
  image?: string
  /** 已注册的数量 */
  count?: number
}

export function PetOptionGrid({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly PetOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="mx-auto mt-7 flex w-full max-w-md flex-wrap justify-start gap-x-2 gap-y-5 sm:gap-x-3"
    >
      {options.map((option, index) => {
        const count = option.count
        const selected = option.value === value

        return (
          <motion.button
            key={option.value || 'custom'}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={count === undefined ? option.label : `${option.label}，已注册 ${count} 只`}
            onClick={() => onChange(option.value)}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20, delay: Math.min(index * 0.035, 0.28) }}
            className="group focus-visible:ring-primary/40 focus-visible:ring-offset-background flex basis-[calc(25%-0.5rem)] flex-col items-center gap-1.5 rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:basis-[calc(25%-0.75rem)]"
          >
            <span
              className={cn(
                'relative flex size-16 items-center justify-center overflow-hidden rounded-full border transition-colors sm:size-20',
                selected
                  ? 'border-primary border-2'
                  : 'border-border/60 bg-muted/30 group-hover:bg-muted/60',
              )}
            >
              {option.image
                ? <span aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${option.image}")` }} />
                : <span aria-hidden="true" className="text-2xl leading-none sm:text-3xl">{option.icon}</span>}
            </span>
            <span className={cn('w-full truncate text-center text-xs transition-colors sm:text-sm', selected ? 'text-foreground font-semibold' : 'text-foreground/80')}>
              {option.label}
            </span>
            {count !== undefined && (
              <span className="text-muted-foreground text-xs tabular-nums">
                {count}
                {' 只'}
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
