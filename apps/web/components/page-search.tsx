import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Input } from '@propet/ui'
import { DOCK_SURFACE_CLASS } from '@/components/dock'

interface PageSearchProps {
  placeholder?: string
}

export function PageSearch({ placeholder = '搜索宠物灵感' }: PageSearchProps) {
  return (
    <div className={`${DOCK_SURFACE_CLASS} mx-auto w-full max-w-lg border border-transparent transition-colors focus-within:border-primary`}>
      <div className="size-9 flex justify-center items-center aspect-square rounded-full bg-primary">
        <HugeiconsIcon
          icon={Search01Icon}
          className="text-primary-foreground"
          size={20}
        />
      </div>
      <Input
        aria-label={placeholder}
        placeholder={placeholder}
        className="h-9 rounded-full border-0 bg-transparent text-sm shadow-none"
      />
    </div>
  )
}
