import { PostCard } from '@/components/post-card'

export interface WaterfallPost {
  id: string
  title: string
  author: string
  likes: string
  coverHeight: number
  coverImage?: string
  coverClassName?: string
  badge?: string
}

interface WaterfallFeedProps {
  posts: WaterfallPost[]
}

export function WaterfallFeed({ posts }: WaterfallFeedProps) {
  return (
    <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
      {posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  )
}
