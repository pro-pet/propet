import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: { native?: string }) => void
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Picker
      data={data}
      onEmojiSelect={onEmojiSelect}
      previewPosition="none"
      skinTonePosition="none"
    />
  )
}
