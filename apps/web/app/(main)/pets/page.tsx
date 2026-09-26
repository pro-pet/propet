'use client'

import type { PetOption } from '@/components/pets/pet-option-grid'
import type { FollowPet } from '@/lib/api/follows'
import { Add01Icon, ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button, Calendar, Card, CardContent, cn, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, Input, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@propet/ui'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import GradualBlur from '@/components/gradual-blur'
import { PetOptionGrid } from '@/components/pets/pet-option-grid'
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
const emptyForm: PetForm = { nickname: '', species: '', breed: '', gender: 'UNKNOWN', birthday: '', avatar: '' }
const genderItems = [
  { value: 'UNKNOWN', label: '未知' },
  { value: 'MALE', label: '公' },
  { value: 'FEMALE', label: '母' },
] as const
type PetTab = 'mine' | 'following'

const speciesOptions = [
  { value: '猫咪', label: '猫咪', icon: '🐈' },
  { value: '狗狗', label: '狗狗', icon: '🐕' },
  { value: '兔子', label: '兔子', icon: '🐇' },
  { value: '仓鼠', label: '仓鼠', icon: '🐹' },
  { value: '鸟类', label: '鸟类', icon: '🦜' },
  { value: '爬宠', label: '爬宠', icon: '🦎' },
  { value: '鱼类', label: '鱼类', icon: '🐠' },
  { value: '其他', label: '其他', icon: '✨' },
] satisfies ReadonlyArray<{ value: string, label: string, icon: string }>

const breedOptions: Record<string, Array<{ value: string, label: string, icon: string }>> = {
  猫咪: [
    { value: '英短', label: '英短', icon: '🐾' },
    { value: '布偶', label: '布偶', icon: '🧶' },
    { value: '美短', label: '美短', icon: '🌙' },
    { value: '暹罗', label: '暹罗', icon: '💫' },
    { value: '橘猫', label: '橘猫', icon: '🍊' },
    { value: '田园猫', label: '田园猫', icon: '🌿' },
  ],
  狗狗: [
    { value: '金毛', label: '金毛', icon: '☀️' },
    { value: '柴犬', label: '柴犬', icon: '🍂' },
    { value: '柯基', label: '柯基', icon: '🧡' },
    { value: '贵宾', label: '贵宾', icon: '🎀' },
    { value: '边牧', label: '边牧', icon: '🖤' },
    { value: '拉布拉多', label: '拉布拉多', icon: '🦴' },
  ],
  兔子: [
    { value: '垂耳兔', label: '垂耳兔', icon: '🌸' },
    { value: '侏儒兔', label: '侏儒兔', icon: '🌱' },
    { value: '狮子兔', label: '狮子兔', icon: '🦁' },
    { value: '荷兰兔', label: '荷兰兔', icon: '🌷' },
  ],
  仓鼠: [
    { value: '金丝熊', label: '金丝熊', icon: '🌻' },
    { value: '三线', label: '三线', icon: '🫧' },
    { value: '布丁', label: '布丁', icon: '🍮' },
  ],
  鸟类: [
    { value: '玄凤', label: '玄凤', icon: '🌈' },
    { value: '虎皮鹦鹉', label: '虎皮鹦鹉', icon: '🪶' },
    { value: '文鸟', label: '文鸟', icon: '🎵' },
  ],
  爬宠: [
    { value: '豹纹守宫', label: '豹纹守宫', icon: '🌵' },
    { value: '玉米蛇', label: '玉米蛇', icon: '🌽' },
    { value: '陆龟', label: '陆龟', icon: '🐢' },
  ],
  鱼类: [
    { value: '金鱼', label: '金鱼', icon: '🫧' },
    { value: '斗鱼', label: '斗鱼', icon: '🌊' },
    { value: '孔雀鱼', label: '孔雀鱼', icon: '🪸' },
  ],
}

const createStepTitles = ['认识它', '找到它的名字', '最后，记录它']

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
  const [createStep, setCreateStep] = useState(0)
  const [birthdayPickerOpen, setBirthdayPickerOpen] = useState(false)
  const drawerContentRef = useRef<HTMLDivElement>(null)

  const openCreateDialog = () => {
    setEditingPetId(null)
    setForm(emptyForm)
    setCreateStep(0)
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
    setCreateStep(2)
    setBirthdayPickerOpen(false)
    setDialogOpen(true)
  }

  const handleDrawerOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open)
      setBirthdayPickerOpen(false)
    if (!open)
      setCreateStep(0)
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
    setCreateStep(0)
  }

  const pending = createPet.isPending || updatePet.isPending
  const followingPets = (followingPetsQuery.data ?? []) as FollowPet[]
  const birthdayDate = parseBirthday(form.birthday)
  const availableBreeds = breedOptions[form.species] ?? []
  const minePets = petsQuery.data ?? []
  const speciesChoices = speciesOptions.map(option => ({
    ...option,
    count: minePets.filter(pet => pet.species === option.value).length,
  }))
  const breedChoices: PetOption[] = [
    { value: '', label: '暂时跳过', icon: '✨' },
    ...availableBreeds.map(option => ({
      ...option,
      count: minePets.filter(pet => pet.breed === option.value).length,
    })),
  ]
  const isCreating = !editingPetId

  const selectSpecies = (species: string) => {
    setForm(current => ({ ...current, species, breed: '' }))
    setCreateStep(1)
  }

  const selectBreed = (breed: string) => {
    setForm(current => ({ ...current, breed }))
    setCreateStep(2)
  }

  const nextStep = () => {
    if (createStep === 0 && form.species)
      setCreateStep(1)
    else if (createStep === 1)
      setCreateStep(2)
  }

  const previousStep = () => {
    if (createStep > 0)
      setCreateStep(step => step - 1)
  }

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
        <DrawerContent ref={drawerContentRef} className="h-[min(860px,94svh)] max-h-[94svh] data-[vaul-drawer-direction=bottom]:max-h-[94svh] data-[vaul-drawer-direction=top]:max-h-[94svh]" aria-describedby={undefined}>
          <DrawerHeader className="mx-auto w-full max-w-3xl px-5 pb-2 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DrawerTitle className="text-left">{editingPetId ? '编辑宠物' : '添加宠物'}</DrawerTitle>
                <DrawerDescription className="mt-1 text-left">
                  {editingPetId ? '更新它的资料' : '慢慢认识它，把重要的日子记下来'}
                </DrawerDescription>
              </div>
              {isCreating && (
                <div className="flex items-center gap-1.5" aria-label={`第 ${createStep + 1} 步，共 3 步`}>
                  {createStepTitles.map((title, index) => (
                    <span
                      key={title}
                      className={cn('h-1.5 rounded-full transition-all', index === createStep ? 'bg-primary w-8' : index < createStep ? 'bg-primary/45 w-1.5' : 'bg-muted w-1.5')}
                    />
                  ))}
                </div>
              )}
            </div>
            {isCreating && <p className="text-muted-foreground mt-5 text-center text-sm font-medium">{createStepTitles[createStep]}</p>}
          </DrawerHeader>

          <form id="pet-form" className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden px-5 sm:px-8" onSubmit={submit}>
            <AnimatePresence mode="wait" initial={false}>
              {isCreating && createStep === 0 && (
                <motion.section
                  key="species"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex min-h-0 flex-1 flex-col overflow-y-auto py-4"
                  aria-labelledby="species-heading"
                >
                  <div className="mx-auto max-w-md text-center">
                    <h2 id="species-heading" className="text-2xl font-semibold tracking-tight">它是什么小可爱？</h2>
                    <p className="text-muted-foreground mt-2 text-sm">先从它的种类开始，常见的在这里等你发现</p>
                  </div>
                  <PetOptionGrid
                    options={speciesChoices}
                    value={form.species}
                    onChange={selectSpecies}
                    ariaLabel="选择宠物种类"
                  />
                </motion.section>
              )}

              {isCreating && createStep === 1 && (
                <motion.section
                  key="breed"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex min-h-0 flex-1 flex-col overflow-y-auto py-4"
                  aria-labelledby="breed-heading"
                >
                  <div className="mx-auto max-w-md text-center">
                    <div className="bg-primary/10 mx-auto mb-3 flex size-12 items-center justify-center rounded-full text-2xl">{speciesOptions.find(option => option.value === form.species)?.icon ?? '🐾'}</div>
                    <h2 id="breed-heading" className="text-2xl font-semibold tracking-tight">它是哪一类？</h2>
                    <p className="text-muted-foreground mt-2 text-sm">选择最接近的品种，也可以留到以后再慢慢确认</p>
                  </div>
                  <PetOptionGrid
                    options={breedChoices}
                    value={form.breed}
                    onChange={selectBreed}
                    ariaLabel="选择宠物品种"
                  />
                </motion.section>
              )}

              {(!isCreating || createStep === 2) && (
                <motion.section
                  key="details"
                  initial={isCreating ? { opacity: 0, x: 20 } : undefined}
                  animate={{ opacity: 1, x: 0 }}
                  className="min-h-0 flex-1 overflow-y-auto py-4"
                  aria-labelledby="details-heading"
                >
                  {isCreating && (
                    <div className="bg-secondary/60 mb-5 flex items-center gap-3 rounded-2xl border px-4 py-3">
                      <div className="bg-background flex size-11 shrink-0 items-center justify-center rounded-full text-2xl shadow-sm">{speciesOptions.find(option => option.value === form.species)?.icon ?? '🐾'}</div>
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-xs">你正在记录</p>
                        <p className="truncate text-sm font-semibold">
                          {form.species}
                          {form.breed ? ` · ${form.breed}` : ''}
                        </p>
                      </div>
                      <button type="button" onClick={() => setCreateStep(0)} className="text-muted-foreground hover:text-foreground ml-auto shrink-0 text-xs underline underline-offset-4">重新选择</button>
                    </div>
                  )}
                  <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                      <label htmlFor="pet-nickname" className="text-sm font-medium">它的昵称</label>
                      <Input id="pet-nickname" value={form.nickname} onChange={event => setForm(current => ({ ...current, nickname: event.target.value }))} placeholder="例如：团子" autoFocus required />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="pet-gender" className="text-sm font-medium">性别</label>
                      <Select modal={false} items={genderItems} value={form.gender} onValueChange={value => setForm(current => ({ ...current, gender: value as PetForm['gender'] }))}>
                        <SelectTrigger id="pet-gender" className="w-full"><SelectValue placeholder="选择性别" /></SelectTrigger>
                        <SelectContent container={drawerContentRef} alignItemWithTrigger={false}>
                          <SelectGroup>{genderItems.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="pet-birthday" className="text-sm font-medium">
                        生日
                        <span className="text-muted-foreground font-normal">（可选）</span>
                      </label>
                      <Popover open={birthdayPickerOpen} onOpenChange={setBirthdayPickerOpen}>
                        <PopoverTrigger render={<Button id="pet-birthday" type="button" variant="outline" className="w-full justify-between font-normal" />}>
                          <span className={birthdayDate ? '' : 'text-muted-foreground'}>{birthdayDate ? birthdayDate.toLocaleDateString('zh-CN') : '选择生日'}</span>
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
                    <div className="grid gap-2 sm:col-span-2">
                      <label htmlFor="pet-breed" className="text-sm font-medium">
                        品种
                        <span className="text-muted-foreground font-normal">（可选）</span>
                      </label>
                      <Input id="pet-breed" value={form.breed} onChange={event => setForm(current => ({ ...current, breed: event.target.value }))} placeholder="可以写得更具体，例如：银渐层" />
                    </div>
                    {form.species === '其他' && (
                      <div className="grid gap-2 sm:col-span-2">
                        <label htmlFor="pet-species" className="text-sm font-medium">种类名称</label>
                        <Input id="pet-species" value={form.species} onChange={event => setForm(current => ({ ...current, species: event.target.value }))} placeholder="例如：刺猬、蜜袋鼯" required />
                      </div>
                    )}
                    <div className="grid gap-2 sm:col-span-2">
                      <label htmlFor="pet-avatar" className="text-sm font-medium">
                        头像地址
                        <span className="text-muted-foreground font-normal">（可选）</span>
                      </label>
                      <Input id="pet-avatar" type="url" value={form.avatar} onChange={event => setForm(current => ({ ...current, avatar: event.target.value }))} placeholder="粘贴一张它的照片链接" />
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </form>

          <DrawerFooter className="mx-auto w-full max-w-3xl flex-row items-center justify-between px-5 pt-3 sm:px-8">
            {isCreating && createStep > 0
              ? (
                  <Button type="button" variant="ghost" onClick={previousStep}>
                    <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
                    上一步
                  </Button>
                )
              : <DrawerClose asChild><Button type="button" variant="ghost">取消</Button></DrawerClose>}
            {isCreating && createStep < 2
              ? (
                  <Button type="button" onClick={nextStep} disabled={createStep === 0 && !form.species}>
                    继续
                    <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
                  </Button>
                )
              : <Button type="submit" form="pet-form" disabled={pending}>{pending ? '保存中…' : isCreating ? '完成记录' : '保存修改'}</Button>}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
