'use client'

import {
  Add01Icon,
  ArrowRight01Icon,
  Copy01Icon,
  FavouriteIcon,
  GridIcon,
  Settings01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Avatar, Button } from '@propet/ui'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { WaterfallFeed } from '@/components/waterfall-feed'

const UID = 'PP-83927461'
const PET_AVATAR_FALLBACK = '/images/pet-avatar-fallback.svg'

const mockUser = {
  name: '团子麻麻',
  avatar: 'https://i.pravatar.cc/200?u=propet-me',
  bio: '三只毛孩子的快乐铲屎官 🐾 分享日常养宠心得',
  followers: 1283,
  following: 526,
  posts: 47,
  pets: 3,
}

const petPic = (tag: string, lock: number) => `https://loremflickr.com/720/1080/${tag}?lock=${lock}`

const mockPets = [
  { id: '1', name: '团子', species: '柯基犬', avatar: petPic('corgi', 101) },
  { id: '2', name: '奶盖', species: '布偶猫', avatar: petPic('cat', 102) },
  { id: '3', name: '薯条', species: '金毛', avatar: petPic('golden+retriever', 103) },
]

const mockPosts = [
  { id: 'p1', title: '今天带团子去公园啦', author: '团子麻麻', likes: '1.2k', coverHeight: 210, coverImage: petPic('dog', 301) },
  { id: 'p2', title: '奶盖的新衣服', author: '团子麻麻', likes: '846', coverHeight: 280, coverImage: petPic('cat', 302) },
  { id: 'p3', title: '薯条学会了握手！', author: '团子麻麻', likes: '578', coverHeight: 200, coverImage: petPic('puppy', 303) },
  { id: 'p4', title: '周末遛弯日记', author: '团子麻麻', likes: '902', coverHeight: 260, coverImage: petPic('dog', 304) },
  { id: 'p5', title: '午睡中的奶盖', author: '团子麻麻', likes: '2.1k', coverHeight: 240, coverImage: petPic('cat', 305) },
  { id: 'p6', title: '团子 vs 薯条大战', author: '团子麻麻', likes: '634', coverHeight: 220, coverImage: petPic('puppy', 306) },
]

function formatCount(n: number) {
  if (n >= 10000)
    return `${(n / 10000).toFixed(1)}w`
  if (n >= 1000)
    return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function PetAvatarImage({
  src,
  alt,
  size,
  className,
}: {
  src: string
  alt: string
  size: number
  className: string
}) {
  const [imageSrc, setImageSrc] = useState(src)

  useEffect(() => {
    setImageSrc(src)
  }, [src])

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={() => {
        if (imageSrc !== PET_AVATAR_FALLBACK) {
          setImageSrc(PET_AVATAR_FALLBACK)
        }
      }}
    />
  )
}

function PetChip({ pet }: { pet: typeof mockPets[0] }) {
  return (
    <Link href={`/mine/pets/${pet.id}`} className="group flex shrink-0 flex-col items-center gap-1.5">
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="relative"
      >
        <div className="from-primary/60 via-primary/30 to-primary/60 rounded-full bg-gradient-to-br p-[2.5px]">
          <div className="overflow-hidden rounded-full bg-background p-[2px]">
            <PetAvatarImage
              src={pet.avatar}
              alt={pet.name}
              size={60}
              className="size-[60px] rounded-full object-cover"
            />
          </div>
        </div>
        <span className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
          <HugeiconsIcon icon={FavouriteIcon} size={11} className="text-primary" />
        </span>
      </motion.div>
      <span className="max-w-[64px] truncate text-xs font-medium">{pet.name}</span>
    </Link>
  )
}

function AddPetChip() {
  return (
    <Link href="/mine/pets/new" className="flex shrink-0 flex-col items-center gap-1.5">
      <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
        <div className="flex size-[69px] items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-primary/50">
          <HugeiconsIcon icon={Add01Icon} size={22} className="text-muted-foreground" />
        </div>
      </motion.div>
      <span className="text-muted-foreground text-xs">添加</span>
    </Link>
  )
}

export default function MinePage() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'pets'>('posts')

  const copyUid = useCallback(() => {
    navigator.clipboard.writeText(UID).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [])

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-5xl px-5">
        {/* Profile header */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex gap-5 pt-6 pb-5"
        >
          {/* Avatar — sized to match right column height */}
          <div className="relative shrink-0 self-center">
            <div className="from-primary/50 via-primary/20 to-primary/50 rounded-full bg-gradient-to-br p-[3px]">
              <Avatar
                src={mockUser.avatar}
                name={mockUser.name}
                className="size-[86px] ring-[3px] ring-background"
              />
            </div>
          </div>

          {/* Name & UID + Stats */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h1 className="truncate text-xl font-bold tracking-tight">{mockUser.name}</h1>
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="size-8 rounded-full">
                  <HugeiconsIcon icon={Settings01Icon} size={18} />
                </Button>
              </Link>
            </div>
            <button
              onClick={copyUid}
              className="mt-0.5 inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="text-xs tabular-nums">{UID}</span>
              <HugeiconsIcon
                icon={copied ? Tick02Icon : Copy01Icon}
                size={12}
                className={copied ? 'text-primary' : ''}
              />
            </button>

            {/* Stats — inline compact */}
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm">
                <span className="font-bold tabular-nums">{formatCount(mockUser.posts)}</span>
                <span className="text-muted-foreground ml-0.5">帖子</span>
              </span>
              <span className="text-sm">
                <span className="font-bold tabular-nums">{formatCount(mockUser.followers)}</span>
                <span className="text-muted-foreground ml-0.5">粉丝</span>
              </span>
              <span className="text-sm">
                <span className="font-bold tabular-nums">{formatCount(mockUser.following)}</span>
                <span className="text-muted-foreground ml-0.5">关注</span>
              </span>
            </div>

            {/* Bio */}
            <p className="mt-2 text-sm leading-relaxed">{mockUser.bio}</p>
          </div>
        </motion.section>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex gap-2 pb-6"
        >
          <Button
            variant="secondary"
            className="h-9 flex-1 rounded-full text-sm font-medium"
          >
            编辑资料
          </Button>
          <Button
            variant="secondary"
            className="h-9 flex-1 rounded-full text-sm font-medium"
          >
            分享主页
          </Button>
        </motion.div>

        {/* My pets horizontal scroll */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">我的宠物</h2>
            <Link
              href="/mine/pets"
              className="inline-flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              管理
              <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
            </Link>
          </div>
          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-none">
            {mockPets.map(pet => (
              <PetChip key={pet.id} pet={pet} />
            ))}
            <AddPetChip />
          </div>
        </motion.section>

        {/* Divider */}
        <div className="my-5 h-px bg-border/60" />

        {/* Tab switch */}
        <div className="flex items-center justify-center gap-8 pb-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`inline-flex items-center gap-1.5 pb-1 text-sm font-medium transition-colors ${
              activeTab === 'posts'
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground'
            }`}
          >
            <HugeiconsIcon icon={GridIcon} size={16} />
            帖子
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`inline-flex items-center gap-1.5 pb-1 text-sm font-medium transition-colors ${
              activeTab === 'pets'
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground'
            }`}
          >
            <HugeiconsIcon icon={FavouriteIcon} size={16} />
            宠物动态
          </button>
        </div>

        {/* Posts — reuse WaterfallFeed + PostCard */}
        {activeTab === 'posts' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="pb-28"
          >
            <WaterfallFeed posts={mockPosts} />
          </motion.div>
        )}

        {/* Pet timeline */}
        {activeTab === 'pets' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pb-28"
          >
            {mockPets.map((pet, i) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
              >
                <Link
                  href={`/mine/pets/${pet.id}`}
                  className="group flex items-center gap-4 rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-muted/80"
                >
                  <PetAvatarImage
                    src={pet.avatar}
                    alt={pet.name}
                    size={72}
                    className="size-[72px] shrink-0 rounded-2xl object-cover ring-2 ring-background"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold">{pet.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{pet.species}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        <HugeiconsIcon icon={FavouriteIcon} size={10} />
                        健康
                      </span>
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
