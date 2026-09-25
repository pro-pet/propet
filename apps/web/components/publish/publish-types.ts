export const MAX_IMAGES = 9

export const FOLLOWING_PEOPLE = [
  { value: '团子麻麻', subtitle: '宠物日常', avatar: '团' },
  { value: '奶糕', subtitle: '猫咪生活', avatar: '奶' },
  { value: '柚子', subtitle: '养宠分享', avatar: '柚' },
  { value: '阿椰', subtitle: '健康养护', avatar: '椰' },
  { value: '眠眠', subtitle: '宠物探店', avatar: '眠' },
  { value: 'Momo', subtitle: '狗狗训练', avatar: 'M' },
] as const

export const COMMUNITY_TOPICS = ['萌宠日常', '宠物穿搭', '健康养护', '洗护测评', '领养故事', '周末探店', '新手养宠', '宠物好物']

export type Visibility = 'public' | 'private' | 'mutuals' | 'selected' | 'excluded'
export type CommentPermission = 'all' | 'self' | 'mutuals' | 'followers' | 'none'

export const VISIBILITY_LABELS: Record<Visibility, string> = {
  public: '公开可见',
  private: '仅自己可见',
  mutuals: '仅互关好友可见',
  selected: '只给谁看',
  excluded: '不给谁看',
}

export const COMMENT_PERMISSION_LABELS: Record<CommentPermission, string> = {
  all: '允许所有人评论',
  self: '只允许自己评论',
  mutuals: '只允许互关好友评论',
  followers: '只允许粉丝评论',
  none: '不允许评论',
}

export interface PublishFormValues {
  title: string
  content: string
}

export interface ImageDraft {
  id: string
  name: string
  url: string
}
