'use client'

import type { PaginatedResult, PaginationParams } from './types'
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'

export interface PostAuthor {
  id: string
  name: string | null
  avatar: string | null
}

export interface Post {
  id: string
  title: string
  content: string
  images: string[]
  authorId: string
  author: PostAuthor
  createdAt: string
  updatedAt: string
}

export interface CreatePostInput {
  title: string
  content: string
  images?: string[]
}

export type UpdatePostInput = Partial<CreatePostInput>

export const postQueryKeys = {
  all: ['posts'] as const,
  lists: () => [...postQueryKeys.all, 'list'] as const,
  list: (params: PaginationParams = {}) => [...postQueryKeys.lists(), params] as const,
  details: () => [...postQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...postQueryKeys.details(), id] as const,
}

export const postsApi = {
  list: (params: PaginationParams = {}, signal?: AbortSignal) => apiClient.get<PaginatedResult<Post>>('/posts', { params, signal }),
  get: (id: string, signal?: AbortSignal) => apiClient.get<Post>(`/posts/${encodeURIComponent(id)}`, { signal }),
  create: (input: CreatePostInput) => apiClient.post<Post, CreatePostInput>('/posts', input),
  update: (id: string, input: UpdatePostInput) => apiClient.patch<Post, UpdatePostInput>(`/posts/${encodeURIComponent(id)}`, input),
  remove: (id: string) => apiClient.delete<{ id: string }>(`/posts/${encodeURIComponent(id)}`),
}

export const postQueries = {
  list: (params: PaginationParams = {}) => queryOptions({
    queryKey: postQueryKeys.list(params),
    queryFn: ({ signal }) => postsApi.list(params, signal),
  }),
  detail: (id: string) => queryOptions({
    queryKey: postQueryKeys.detail(id),
    queryFn: ({ signal }) => postsApi.get(id, signal),
    enabled: Boolean(id),
  }),
}

export function usePosts(params: PaginationParams = {}) {
  return useQuery(postQueries.list(params))
}

export function usePost(id: string) {
  return useQuery(postQueries.detail(id))
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postsApi.create,
    onSuccess: post => queryClient.setQueryData(postQueryKeys.detail(post.id), post),
    onSettled: () => queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string, input: UpdatePostInput }) => postsApi.update(id, input),
    onSuccess: post => queryClient.setQueryData(postQueryKeys.detail(post.id), post),
    onSettled: () => queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postsApi.remove,
    onSuccess: ({ id }) => queryClient.removeQueries({ queryKey: postQueryKeys.detail(id), exact: true }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
  })
}
