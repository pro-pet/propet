'use client'

import { Button } from '@propet/ui'
import { ArrowLeft02Icon, PencilEdit01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { use } from 'react'

export default function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <div className="flex flex-col">
      <header className="bg-background/80 sticky top-0 z-40 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/mine/pets">
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
            </Button>
          </Link>
          <h1 className="text-base font-semibold">宠物档案</h1>
          <Link href={`/mine/pets/${id}/edit`}>
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={PencilEdit01Icon} size={18} />
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-muted flex size-24 items-center justify-center rounded-full text-3xl">
            🐾
          </div>
          <p className="text-muted-foreground text-sm">宠物 ID: {id}</p>
        </div>
      </div>
    </div>
  )
}
