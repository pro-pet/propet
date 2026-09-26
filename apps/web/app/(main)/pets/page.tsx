'use client'

import type { FollowPet } from '@/lib/api/follows'
import { Add01Icon, Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button, Calendar, Card, CardContent, Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, Input, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@propet/ui'
import { useRef, useState } from 'react'
import GradualBlur from '@/components/gradual-blur'
import { useFollowing, useToggleFollow } from '@/lib/api/follows'
import { useCreatePet, useDeletePet, useMyPets, useUpdatePet } from '@/lib/api/pets'

interface PetForm {
  nickname: string
  species: string
  breed: string
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN'
  birthday: string
  avatar: string
}
const emptyForm: PetForm = { nickname: '', species: '猫咪', breed: '', gender: 'UNKNOWN', birthday: '', avatar: '' }
const genderItems = [
  { value: 'UNKNOWN', label: '未知' },
  { value: 'MALE', label: '公' },
  { value: 'FEMALE', label: '母' },
] as const
type PetTab = 'mine' | 'following'

function parseBirthday(value: string) {
  if (!value)
    return undefined

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year!, month! - 1, day!)
  return date.getFullYear() === year && date.getMonth() === month! - 1 && date.getDate() === day
    ? date
    : undefined
}

function toBirthdayValue(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

export default function PetsPage() {
  const petsQuery = useMyPets()
  const createPet = useCreatePet()
  const updatePet = useUpdatePet()
  const deletePet = useDeletePet()
  const followingPetsQuery = useFollowing('pets')
  const toggleFollow = useToggleFollow()
  const [activeTab, setActiveTab] = useState<PetTab>('mine')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPetId, setEditingPetId] = useState<string | null>(null)
  const [form, setForm] = useState<PetForm>(emptyForm)
  const [birthdayPickerOpen, setBirthdayPickerOpen] = useState(false)
  const drawerContentRef = useRef<HTMLDivElement>(null)

  const openCreateDialog = () => {
    setEditingPetId(null)
    setForm(emptyForm)
    setBirthdayPickerOpen(false)
    setDialogOpen(true)
  }

  const openEditDialog = (pet: NonNullable<typeof petsQuery.data>[number]) => {
    setEditingPetId(pet.id)
    setForm({
      nickname: pet.nickname,
      species: pet.species,
      breed: pet.breed ?? '',
      gender: pet.gender,
      birthday: pet.birthday ? pet.birthday.slice(0, 10) : '',
      avatar: pet.avatar ?? '',
    })
    setBirthdayPickerOpen(false)
    setDialogOpen(true)
  }

  const handleDrawerOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open)
      setBirthdayPickerOpen(false)
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.nickname.trim() || !form.species.trim())
      return
    const input = {
      ...form,
      breed: form.breed.trim() || undefined,
      birthday: form.birthday || undefined,
      avatar: form.avatar.trim() || undefined,
    }
    if (editingPetId)
      await updatePet.mutateAsync({ id: editingPetId, input })
    else
      await createPet.mutateAsync(input)
    setDialogOpen(false)
    setBirthdayPickerOpen(false)
    setEditingPetId(null)
    setForm(emptyForm)
  }

  const pending = createPet.isPending || updatePet.isPending
  const followingPets = (followingPetsQuery.data ?? []) as FollowPet[]
  const birthdayDate = parseBirthday(form.birthday)

  return (
    <div className="bg-background min-h-svh">
      <div className="sticky top-0 z-120 h-24 overflow-visible">
        <header className="relative z-120">
          <div className="mx-auto flex h-24 w-full max-w-4xl items-center justify-between gap-4 px-5 sm:px-8">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">我的宠物</h1>
            <Button type="button" size="lg" className="h-10 shrink-0 rounded-full px-4" onClick={openCreateDialog}>
              <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
              添加宠物
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

      <main className="mx-auto w-full max-w-4xl px-5 pb-28 pt-5 sm:px-8 sm:pt-8">
        <div className="border-border/70 mb-6 flex items-center gap-1">
          <button
            type="button"
            aria-pressed={activeTab === 'mine'}
            onClick={() => setActiveTab('mine')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${activeTab === 'mine' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            我的
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'following'}
            onClick={() => setActiveTab('following')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${activeTab === 'following' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            关注
          </button>
        </div>

        {activeTab === 'mine' && petsQuery.isPending && <p className="text-muted-foreground py-16 text-center text-sm">正在加载…</p>}
        {activeTab === 'mine' && petsQuery.isError && <p className="text-destructive py-16 text-center text-sm">宠物资料暂时无法加载</p>}
        {activeTab === 'following' && followingPetsQuery.isPending && <p className="text-muted-foreground py-16 text-center text-sm">正在加载关注的宠物…</p>}
        {activeTab === 'following' && followingPetsQuery.isError && <p className="text-destructive py-16 text-center text-sm">关注的宠物暂时无法加载</p>}
        {activeTab === 'mine' && !petsQuery.isPending && !petsQuery.isError && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              onClick={openCreateDialog}
              className="bg-secondary text-secondary-foreground flex min-h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center transition-colors focus-visible:ring-primary/40 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <HugeiconsIcon icon={Add01Icon} size={36} />
              <span className="text-sm">添加宠物</span>
            </button>

            {(petsQuery.data ?? []).map(pet => (
              <Card key={pet.id} className="min-h-52 justify-between">
                <CardContent className="flex h-full flex-col gap-5 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Avatar src={pet.avatar} name={pet.nickname} fallback={pet.nickname.slice(0, 1)} className="size-16" />
                    <div className="flex shrink-0 gap-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => openEditDialog(pet)}>编辑</Button>
                      <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => void deletePet.mutateAsync(pet.id)}>删除</Button>
                    </div>
                  </div>
                  <div className="mt-auto min-w-0">
                    <h2 className="truncate text-lg font-semibold">{pet.nickname}</h2>
                    <p className="text-muted-foreground mt-1 truncate text-sm">
                      {pet.species}
                      {pet.breed ? ` · ${pet.breed}` : ''}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs">
                      {pet.followerCount}
                      {' 位关注'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'following' && !followingPetsQuery.isPending && !followingPetsQuery.isError && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {followingPets.map(pet => (
              <Card key={pet.id} className="min-h-52 justify-between">
                <CardContent className="flex h-full flex-col gap-5 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Avatar src={pet.avatar} name={pet.nickname} fallback={pet.nickname.slice(0, 1)} className="size-16" />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleFollow.mutate({ type: 'pets', id: pet.id, following: true })}
                      disabled={toggleFollow.isPending}
                    >
                      已关注
                    </Button>
                  </div>
                  <div className="mt-auto min-w-0">
                    <h2 className="truncate text-lg font-semibold">{pet.nickname}</h2>
                    <p className="text-muted-foreground mt-1 truncate text-sm">
                      {pet.species}
                      {pet.breed ? ` · ${pet.breed}` : ''}
                    </p>
                    <p className="text-muted-foreground mt-2 truncate text-xs">
                      主人：
                      {pet.owner.name || '用户'}
                      {' · '}
                      {pet.followerCount}
                      {' 位关注'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {followingPets.length === 0 && <p className="text-muted-foreground col-span-full py-16 text-center text-sm">还没有关注宠物</p>}
          </div>
        )}
      </main>

      <Drawer open={dialogOpen} onOpenChange={handleDrawerOpenChange}>
        <DrawerContent ref={drawerContentRef} className="h-4/5" aria-describedby={undefined}>
          <DrawerHeader className="mx-auto w-full max-w-2xl px-5 pb-3 sm:px-8">
            <DrawerTitle className="text-left">{editingPetId ? '编辑宠物' : '添加宠物'}</DrawerTitle>
          </DrawerHeader>
          <form id="pet-form" className="mx-auto grid w-full max-w-2xl gap-4 overflow-y-auto px-5 pb-2 sm:grid-cols-2 sm:px-8" onSubmit={submit}>
            <div className="grid gap-2">
              <label htmlFor="pet-nickname" className="text-sm font-medium">宠物名称</label>
              <Input id="pet-nickname" value={form.nickname} onChange={event => setForm(current => ({ ...current, nickname: event.target.value }))} placeholder="例如：团子" autoFocus required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="pet-species" className="text-sm font-medium">宠物类型</label>
              <Input id="pet-species" value={form.species} onChange={event => setForm(current => ({ ...current, species: event.target.value }))} placeholder="例如：猫咪、狗狗" required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="pet-breed" className="text-sm font-medium">品种</label>
              <Input id="pet-breed" value={form.breed} onChange={event => setForm(current => ({ ...current, breed: event.target.value }))} placeholder="例如：金毛、英短（可选）" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="pet-gender" className="text-sm font-medium">性别</label>
              <Select modal={false} items={genderItems} value={form.gender} onValueChange={value => setForm(current => ({ ...current, gender: value as PetForm['gender'] }))}>
                <SelectTrigger id="pet-gender" className="w-full">
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent container={drawerContentRef} alignItemWithTrigger={false}>
                  <SelectGroup>
                    {genderItems.map(item => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="pet-birthday" className="text-sm font-medium">生日</label>
              <Popover open={birthdayPickerOpen} onOpenChange={setBirthdayPickerOpen}>
                <PopoverTrigger render={<Button id="pet-birthday" type="button" variant="outline" className="w-full justify-between font-normal" />}>
                  <span className={birthdayDate ? '' : 'text-muted-foreground'}>
                    {birthdayDate ? birthdayDate.toLocaleDateString('zh-CN') : '选择生日'}
                  </span>
                  <HugeiconsIcon icon={Calendar03Icon} data-icon="inline-end" />
                </PopoverTrigger>
                <PopoverContent container={drawerContentRef} align="start" className="w-auto gap-0 overflow-hidden p-0">
                  <Calendar
                    mode="single"
                    selected={birthdayDate}
                    onSelect={(date) => {
                      if (!date)
                        return
                      setForm(current => ({ ...current, birthday: toBirthdayValue(date) }))
                      setBirthdayPickerOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <label htmlFor="pet-avatar" className="text-sm font-medium">头像地址</label>
              <Input id="pet-avatar" type="url" value={form.avatar} onChange={event => setForm(current => ({ ...current, avatar: event.target.value }))} placeholder="https://…（可选）" />
            </div>
          </form>
          <DrawerFooter className="mx-auto w-full max-w-2xl flex-row justify-end px-5 pt-4 sm:px-8">
            <DrawerClose asChild>
              <Button type="button" variant="outline">取消</Button>
            </DrawerClose>
            <Button type="submit" form="pet-form" disabled={pending}>{pending ? '保存中…' : '保存'}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
