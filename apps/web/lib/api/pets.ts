'use client'

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'

export interface PetOwner {
  id: string
  name: string | null
  avatar: string | null
}

export interface Pet {
  id: string
  nickname: string
  species: string
  breed: string | null
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN'
  birthday: string | null
  avatar: string | null
  ownerId: string
  owner: PetOwner
  followerCount: number
}

export interface PetInput {
  nickname: string
  species: string
  breed?: string
  gender?: Pet['gender']
  birthday?: string
  avatar?: string
}

export const petQueryKeys = {
  all: ['pets'] as const,
  lists: () => [...petQueryKeys.all, 'list'] as const,
  list: (ownerId?: string) => [...petQueryKeys.lists(), ownerId ?? 'all'] as const,
  mine: () => [...petQueryKeys.all, 'mine'] as const,
  details: () => [...petQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...petQueryKeys.details(), id] as const,
}

export const petsApi = {
  list: (ownerId?: string, signal?: AbortSignal) => apiClient.get<Pet[]>('/pets', { params: ownerId ? { ownerId } : undefined, signal }),
  mine: (signal?: AbortSignal) => apiClient.get<Pet[]>('/pets/mine', { signal }),
  get: (id: string, signal?: AbortSignal) => apiClient.get<Pet>(`/pets/${encodeURIComponent(id)}`, { signal }),
  create: (input: PetInput) => apiClient.post<Pet, PetInput>('/pets', input),
  update: (id: string, input: Partial<PetInput>) => apiClient.patch<Pet, Partial<PetInput>>(`/pets/${encodeURIComponent(id)}`, input),
  remove: (id: string) => apiClient.delete<{ id: string }>(`/pets/${encodeURIComponent(id)}`),
}

export function usePets(ownerId?: string) {
  return useQuery(queryOptions({ queryKey: petQueryKeys.list(ownerId), queryFn: ({ signal }) => petsApi.list(ownerId, signal) }))
}

export function useMyPets() {
  return useQuery(queryOptions({ queryKey: petQueryKeys.mine(), queryFn: ({ signal }) => petsApi.mine(signal) }))
}

export function usePet(id: string) {
  return useQuery(queryOptions({ queryKey: petQueryKeys.detail(id), queryFn: ({ signal }) => petsApi.get(id, signal), enabled: Boolean(id) }))
}

export function useCreatePet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: petsApi.create,
    onSuccess: pet => queryClient.setQueryData(petQueryKeys.detail(pet.id), pet),
    onSettled: () => queryClient.invalidateQueries({ queryKey: petQueryKeys.all }),
  })
}

export function useUpdatePet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string, input: Partial<PetInput> }) => petsApi.update(id, input),
    onSuccess: pet => queryClient.setQueryData(petQueryKeys.detail(pet.id), pet),
    onSettled: () => queryClient.invalidateQueries({ queryKey: petQueryKeys.all }),
  })
}

export function useDeletePet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: petsApi.remove,
    onSuccess: ({ id }) => queryClient.removeQueries({ queryKey: petQueryKeys.detail(id), exact: true }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: petQueryKeys.all }),
  })
}
