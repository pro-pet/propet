'use client'

import type { IconSvgElement } from '@hugeicons/react'
import type { CommentPermission, Visibility } from './publish-types'
import { Calendar03Icon, Comment01Icon, Location01Icon, Search01Icon, Tick02Icon, ViewIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Avatar,
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@propet/ui'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { COMMENT_PERMISSION_LABELS, FOLLOWING_PEOPLE, VISIBILITY_LABELS } from './publish-types'

interface SettingRowProps {
  icon: IconSvgElement
  title: string
  expanded?: boolean
  expandedKey?: string
  expandedContent?: React.ReactNode
  children: React.ReactNode
}

function SettingRow({ icon, title, expanded = false, expandedKey, expandedContent, children }: SettingRowProps) {
  return (
    <div className="py-4">
      <div className={cn('flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-6', expanded ? 'sm:items-start' : 'sm:items-center')}>
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-xl">
            <HugeiconsIcon icon={icon} size={19} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">{title}</p>
          </div>
        </div>
        <div className="flex w-full shrink-0 items-center sm:w-auto sm:justify-end">{children}</div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && expandedContent && (
          <motion.div
            key={expandedKey ?? title}
            initial={{ height: 0, opacity: 0, y: -4 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -4 }}
            transition={{ height: { duration: 0.24, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.16 }, y: { duration: 0.2 } }}
            className="overflow-hidden"
          >
            <div className="flex w-full justify-end">
              <div className="w-full sm:w-52">{expandedContent}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface AudienceDialogProps {
  open: boolean
  visibility: Visibility
  selectedUsers: string[]
  onOpenChange: (open: boolean) => void
  onConfirm: (users: string[]) => void
}

function AudienceDialog({ open, visibility, selectedUsers, onOpenChange, onConfirm }: AudienceDialogProps) {
  const [draftUsers, setDraftUsers] = useState<string[]>(selectedUsers)
  const [search, setSearch] = useState('')
  const title = visibility === 'selected' ? '只给谁看' : '不给谁看'
  const description = visibility === 'selected' ? '选择可以看到这条内容的用户' : '选择不会看到这条内容的用户'
  const normalizedSearch = search.trim().toLowerCase()
  const filteredPeople = FOLLOWING_PEOPLE.filter(person => `${person.value}${person.subtitle}`.toLowerCase().includes(normalizedSearch))

  useEffect(() => {
    if (open) {
      setDraftUsers(selectedUsers)
      setSearch('')
    }
  }, [open, selectedUsers])

  const toggleUser = (user: string) => {
    setDraftUsers(current => current.includes(user) ? current.filter(item => item !== user) : [...current, user])
  }

  const handleConfirm = () => {
    onConfirm(draftUsers)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="border-b px-6 py-4">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={16} className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2" />
            <Input
              autoFocus
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="搜索用户"
              aria-label="搜索用户"
              className="h-9 pl-9"
            />
          </div>
        </div>

        <div className="flex max-h-80 flex-col gap-1 overflow-y-auto p-3">
          {filteredPeople.length > 0
            ? filteredPeople.map((person) => {
                const isSelected = draftUsers.includes(person.value)
                return (
                  <button
                    key={person.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleUser(person.value)}
                    className="hover:bg-muted flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar size="sm" name={person.value} fallback={person.avatar} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{person.value}</span>
                        <span className="text-muted-foreground block truncate text-xs">{person.subtitle}</span>
                      </span>
                    </span>
                    <span className="text-primary flex size-6 shrink-0 items-center justify-center">
                      {isSelected && <HugeiconsIcon icon={Tick02Icon} size={18} />}
                    </span>
                  </button>
                )
              })
            : <p className="text-muted-foreground px-3 py-8 text-center text-sm">没有找到匹配的用户</p>}
        </div>

        <DialogFooter className="border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            已选择
            {' '}
            {draftUsers.length}
            {' '}
            人
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="button" onClick={handleConfirm}>确认</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function parseScheduleAt(value: string) {
  const [datePart, timePart = '09:00'] = value.split('T')
  if (!datePart)
    return undefined

  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)
  const date = new Date(year!, month! - 1, day!, hours || 0, minutes || 0)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function toDatePart(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

function toTimePart(date: Date | undefined, fallback = '09:00') {
  if (!date)
    return fallback
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

interface SchedulePickerProps {
  value: string
  onChange: (value: string) => void
}

function SchedulePicker({ value, onChange }: SchedulePickerProps) {
  const selectedDate = parseScheduleAt(value)
  const timeValue = toTimePart(selectedDate)
  const displayValue = selectedDate
    ? `${selectedDate.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })} ${timeValue}`
    : '选择发布时间'

  const updateValue = (date: Date, time: string) => {
    onChange(`${toDatePart(date)}T${time}`)
  }

  return (
    <Popover>
      <PopoverTrigger render={<Button type="button" variant="outline" className="w-full justify-between font-normal" />}>
        <span className={selectedDate ? '' : 'text-muted-foreground'}>{displayValue}</span>
        <HugeiconsIcon icon={Calendar03Icon} data-icon="inline-end" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto gap-0 overflow-hidden p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={date => date && updateValue(date, timeValue)}
        />
        <div className="border-t p-3">
          <label className="text-muted-foreground mb-1.5 block text-xs" htmlFor="schedule-time">发布时间</label>
          <Input
            id="schedule-time"
            type="time"
            value={timeValue}
            onChange={event => updateValue(selectedDate ?? new Date(), event.target.value)}
            aria-label="发布时间"
            className="h-9"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface PublishSettingsCardProps {
  location: string
  onLocationChange: (value: string) => void
  visibility: Visibility
  onVisibilityChange: (value: Visibility) => void
  audienceUsers: string[]
  onAudienceUsersChange: (values: string[]) => void
  scheduleEnabled: boolean
  onScheduleEnabledChange: (checked: boolean) => void
  scheduleAt: string
  onScheduleAtChange: (value: string) => void
  commentPermission: CommentPermission
  onCommentPermissionChange: (value: CommentPermission) => void
}

export function PublishSettingsCard({
  location,
  onLocationChange,
  visibility,
  onVisibilityChange,
  audienceUsers,
  onAudienceUsersChange,
  scheduleEnabled,
  onScheduleEnabledChange,
  scheduleAt,
  onScheduleAtChange,
  commentPermission,
  onCommentPermissionChange,
}: PublishSettingsCardProps) {
  const [audienceDialogOpen, setAudienceDialogOpen] = useState(false)
  const audienceVisibility = visibility === 'selected' || visibility === 'excluded'

  const openAudienceDialog = () => setAudienceDialogOpen(true)

  const handleVisibilityChange = (value: Visibility) => {
    onVisibilityChange(value)
    if (value === 'selected' || value === 'excluded')
      openAudienceDialog()
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>发布设置</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingRow icon={Location01Icon} title="地点">
          <div className="w-full sm:w-52">
            <Input value={location} onChange={event => onLocationChange(event.target.value)} placeholder="添加地点" aria-label="发布地点" />
          </div>
        </SettingRow>

        <SettingRow
          icon={ViewIcon}
          title="可见范围"
          expanded={audienceVisibility}
          expandedKey={visibility}
          expandedContent={(
            <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2">
              <span className="text-muted-foreground truncate text-xs">
                已选择
                {' '}
                {audienceUsers.length}
                {' '}
                人
              </span>
              <Button type="button" variant="link" size="sm" className="h-auto shrink-0 px-0" onClick={openAudienceDialog}>修改</Button>
            </div>
          )}
        >
          <div className="w-full sm:w-52">
            <Select value={visibility} onValueChange={value => handleVisibilityChange(value as Visibility)}>
              <SelectTrigger aria-label="可见范围" className="w-full">
                <span className="truncate">{VISIBILITY_LABELS[visibility]}</span>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  <SelectItem value="public">公开可见</SelectItem>
                  <SelectItem value="private">仅自己可见</SelectItem>
                  <SelectItem value="mutuals">仅互关好友可见</SelectItem>
                  <SelectItem value="selected">只给谁看</SelectItem>
                  <SelectItem value="excluded">不给谁看</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </SettingRow>

        <SettingRow
          icon={Calendar03Icon}
          title="定时发布"
          expanded={scheduleEnabled}
          expandedContent={<SchedulePicker value={scheduleAt} onChange={onScheduleAtChange} />}
        >
          <div className="w-full sm:w-52">
            <label className="text-muted-foreground flex items-center gap-2 text-sm">
              <Checkbox checked={scheduleEnabled} onCheckedChange={checked => onScheduleEnabledChange(checked === true)} aria-label="启用定时发布" />
              启用定时发布
            </label>
          </div>
        </SettingRow>

        <SettingRow icon={Comment01Icon} title="互动权限">
          <Select value={commentPermission} onValueChange={value => onCommentPermissionChange(value as CommentPermission)}>
            <SelectTrigger aria-label="互动权限" className="w-full sm:w-52">
              <span className="truncate">{COMMENT_PERMISSION_LABELS[commentPermission]}</span>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="all">允许所有人评论</SelectItem>
                <SelectItem value="self">只允许自己评论</SelectItem>
                <SelectItem value="mutuals">只允许互关好友评论</SelectItem>
                <SelectItem value="followers">只允许粉丝评论</SelectItem>
                <SelectItem value="none">不允许评论</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SettingRow>
      </CardContent>

      <AudienceDialog
        open={audienceDialogOpen}
        visibility={visibility}
        selectedUsers={audienceUsers}
        onOpenChange={setAudienceDialogOpen}
        onConfirm={onAudienceUsersChange}
      />
    </Card>
  )
}
