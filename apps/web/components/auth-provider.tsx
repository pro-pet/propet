'use client'

import type { CurrentUser } from '@/lib/current-user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { api, ApiError } from '@/lib/http'

const SESSION_QUERY_KEY = ['session'] as const

interface SessionResponse {
  user: CurrentUser | null
}

interface SignInResponse {
  user?: CurrentUser
  message?: string
}

interface AuthContextValue {
  user: CurrentUser | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const sessionQuery = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async ({ signal }) => {
      const response = await api.get<SessionResponse>('/api/session', { baseURL: '', signal })
      return response.user
    },
    staleTime: 0,
  })

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string, password: string }) => {
      const response = await api.post<SignInResponse, { email: string, password: string }>(
        '/api/session',
        { email, password },
        { baseURL: '' },
      )
      if (!response.user)
        throw new ApiError(response.message || '登录失败，请稍后重试')
      return response.user
    },
    onMutate: () => queryClient.cancelQueries({ queryKey: SESSION_QUERY_KEY }),
    onSuccess: user => queryClient.setQueryData(SESSION_QUERY_KEY, user),
  })

  const signOutMutation = useMutation({
    mutationFn: () => api.delete<SessionResponse>('/api/session', { baseURL: '' }),
    onMutate: () => queryClient.cancelQueries({ queryKey: SESSION_QUERY_KEY }),
    onSuccess: response => queryClient.setQueryData(SESSION_QUERY_KEY, response.user),
  })

  const signIn = useCallback(async (email: string, password: string) => {
    await signInMutation.mutateAsync({ email, password })
  }, [signInMutation.mutateAsync])

  const signOut = useCallback(async () => {
    await signOutMutation.mutateAsync()
  }, [signOutMutation.mutateAsync])

  const value = useMemo(() => ({
    user: sessionQuery.data ?? null,
    signIn,
    signOut,
  }), [sessionQuery.data, signIn, signOut])

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error('useAuth must be used within AuthProvider')
  return context
}
