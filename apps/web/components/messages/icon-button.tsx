import type { IconSvgElement } from '@hugeicons/react'
import { HugeiconsIcon } from '@hugeicons/react'

interface IconButtonProps {
  icon: IconSvgElement
  label: string
  onClick?: () => void
  className?: string
}

export function IconButton({ icon, label, onClick, className = '' }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors ${className}`}
    >
      <HugeiconsIcon icon={icon} size={19} strokeWidth={1.8} />
    </button>
  )
}
