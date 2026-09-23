import type { Chat } from './types'

export const initialChats: Chat[] = [
  {
    id: 'fufu',
    name: '福福和奶糖',
    handle: 'fufu_daily',
    avatar: 'https://i.pravatar.cc/160?u=propet-fufu',
    preview: '周末一起去新开的宠物市集吗？',
    time: '10:42',
    unread: 2,
    online: true,
    messages: [
      { id: 'fufu-1', text: '看到你分享的露营地啦，环境看起来好棒！', time: '10:18', from: 'them' },
      { id: 'fufu-2', text: '福福最近是不是又长大一点了？', time: '10:19', from: 'them' },
      { id: 'fufu-3', text: '是呀，已经可以稳稳地坐下等饭饭了 😋', time: '10:26', from: 'me', read: true },
      { id: 'fufu-4', text: '周末一起去新开的宠物市集吗？听说有很多手作摊位。', time: '10:42', from: 'them' },
    ],
  },
  {
    id: 'momo',
    name: 'Momo 和两只狗',
    handle: 'momo_home',
    avatar: 'https://i.pravatar.cc/160?u=propet-momo',
    preview: '你收藏的那家店我去过啦',
    time: '昨天',
    online: true,
    messages: [
      { id: 'momo-1', text: '你收藏的那家店我去过啦，狗狗可以进。', time: '昨天 18:04', from: 'them' },
      { id: 'momo-2', text: '太好了！那下次约起来～', time: '昨天 18:17', from: 'me', read: true },
    ],
  },
  {
    id: 'catmom',
    name: '奶糕的铲屎官',
    handle: 'milk_cake',
    avatar: 'https://i.pravatar.cc/160?u=propet-milk-cake',
    preview: '已收藏你的驱虫清单',
    time: '周一',
    unread: 1,
    messages: [
      { id: 'cat-1', text: '已收藏你的驱虫清单，写得特别清楚！', time: '周一 09:36', from: 'them' },
      { id: 'cat-2', text: '谢谢，按月提醒就不会忘啦。', time: '周一 09:48', from: 'me', read: true },
    ],
  },
  {
    id: 'windbell',
    name: '风铃的小窝',
    handle: 'windbell_nest',
    avatar: 'https://i.pravatar.cc/160?u=propet-windbell',
    preview: '下次带小七一起玩呀',
    time: '上周日',
    messages: [
      { id: 'wind-1', text: '小七今天第一次去海边，开心到飞起。', time: '上周日 16:12', from: 'them' },
      { id: 'wind-2', text: '看到了！下次带小七一起玩呀。', time: '上周日 16:36', from: 'me', read: true },
    ],
  },
  {
    id: 'tuanzi',
    name: '团子麻麻',
    handle: 'tuanzi_mama',
    avatar: 'https://i.pravatar.cc/160?u=propet-tuanzi',
    preview: '图片 · 公园的晚风',
    time: '6月12日',
    messages: [
      { id: 'tuanzi-1', text: '图片 · 公园的晚风', time: '6月12日 19:24', from: 'them' },
      { id: 'tuanzi-2', text: '这张拍得好有氛围感！', time: '6月12日 19:38', from: 'me', read: true },
    ],
  },
  {
    id: 'fishcake',
    name: '鱼饼妈妈',
    handle: 'fishcake_note',
    avatar: 'https://i.pravatar.cc/160?u=propet-fishcake',
    preview: '好的，收到啦',
    time: '6月9日',
    messages: [
      { id: 'fish-1', text: '好的，收到啦，谢谢你的提醒。', time: '6月9日 11:09', from: 'them' },
    ],
  },
]
