'use client'

import type { CurrentUser } from '@/lib/current-user'
import { queryOptions } from '@tanstack/react-query'
import { apiClient } from './client'

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterInput extends AuthCredentials {
  name: string
}

export interface AuthSession {
  user: CurrentUser | null
}

export const authQueryKeys = {
  session: ['auth', 'session'] as const,
}

export const authApi = {
  getSession: () => apiClient.get<AuthSession>('/session'),
  login: (credentials: AuthCredentials) => apiClient.post<AuthSession, AuthCredentials>('/session', credentials),
  register: (input: RegisterInput) => apiClient.post<AuthSession, RegisterInput>('/auth/register', input),
  logout: () => apiClient.delete<AuthSession>('/session'),
}

export const sessionQueryOptions = queryOptions({
  queryKey: authQueryKeys.session,
  queryFn: ({ signal }) => apiClient.get<AuthSession>('/session', { signal }),
  staleTime: 0,
})
