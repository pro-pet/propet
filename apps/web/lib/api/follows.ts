'use client'

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'

export interface FollowUser {
  id: string
  name: string | null
  avatar: string | null
  followerCount: number
  followingCount: number
  postCount: number
}

export interface FollowPet {
  id: string
  nickname: string
  species: string
  breed: string | null
  avatar: string | null
  ownerId: string
  owner: { id: string, name: string | null, avatar: string | null }
  followerCount: number
}

export type FollowType = 'users' | 'pets'

export const followingQueryKeys = {
  all: ['following'] as const,
  list: (type: FollowType) => [...followingQueryKeys.all, type] as const,
}

export const followsApi = {
  list: (type: FollowType, signal?: AbortSignal) => apiClient.get<FollowUser[] | FollowPet[]>('/following', { params: { type }, signal }),
  followUser: (id: string) => apiClient.post<{ following: true }, undefined>(`/users/${encodeURIComponent(id)}/follow`),
  unfollowUser: (id: string) => apiClient.delete<{ following: false }>(`/users/${encodeURIComponent(id)}/follow`),
  followPet: (id: string) => apiClient.post<{ following: true }, undefined>(`/pets/${encodeURIComponent(id)}/follow`),
  unfollowPet: (id: string) => apiClient.delete<{ following: false }>(`/pets/${encodeURIComponent(id)}/follow`),
}

export function useFollowing(type: FollowType) {
  return useQuery(queryOptions({ queryKey: followingQueryKeys.list(type), queryFn: ({ signal }) => followsApi.list(type, signal) }))
}

export function useToggleFollow() {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, { type: FollowType, id: string, following: boolean }>({
    mutationFn: ({ type, id, following }: { type: FollowType, id: string, following: boolean }) => {
      if (type === 'pets')
        return following ? followsApi.unfollowPet(id) : followsApi.followPet(id)
      return following ? followsApi.unfollowUser(id) : followsApi.followUser(id)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: followingQueryKeys.all }),
  })
}
