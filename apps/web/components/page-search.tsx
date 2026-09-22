import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Input } from '@propet/ui'
import { DOCK_SURFACE_CLASS } from '@/components/dock'

interface PageSearchProps {
  placeholder?: string
}

export function PageSearch({ placeholder = '搜索宠物灵感' }: PageSearchProps) {
  return (
    <div className={`${DOCK_SURFACE_CLASS} mx-auto w-full max-w-lg`}>
      <HugeiconsIcon
        icon={Search01Icon}
        size={17}
        className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2"
      />
      <Input
        aria-label={placeholder}
        placeholder={placeholder}
        className="h-9 rounded-full border-0 bg-transparent pl-10 text-sm shadow-none focus-visible:ring-0"
      />
    </div>
  )
}
