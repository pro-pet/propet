'use client'

import type { CurrentUser } from '@/lib/current-user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { authApi, authQueryKeys, sessionQueryOptions } from '@/lib/api/auth'

interface AuthContextValue {
  user: CurrentUser | null
  signIn: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const sessionQuery = useQuery(sessionQueryOptions)

  const signInMutation = useMutation({
    mutationFn: authApi.login,
    onMutate: () => queryClient.cancelQueries({ queryKey: authQueryKeys.session }),
    onSuccess: session => queryClient.setQueryData(authQueryKeys.session, session),
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onMutate: () => queryClient.cancelQueries({ queryKey: authQueryKeys.session }),
    onSuccess: session => queryClient.setQueryData(authQueryKeys.session, session),
  })

  const signOutMutation = useMutation({
    mutationFn: authApi.logout,
    onMutate: () => queryClient.cancelQueries({ queryKey: authQueryKeys.session }),
    onSuccess: session => queryClient.setQueryData(authQueryKeys.session, session),
  })

  const signIn = useCallback(async (email: string, password: string) => {
    await signInMutation.mutateAsync({ email, password })
  }, [signInMutation.mutateAsync])

  const register = useCallback(async (email: string, password: string, name: string) => {
    await registerMutation.mutateAsync({ email, password, name })
  }, [registerMutation.mutateAsync])

  const signOut = useCallback(async () => {
    await signOutMutation.mutateAsync()
  }, [signOutMutation.mutateAsync])

  const value = useMemo(() => ({
    user: sessionQuery.data?.user ?? null,
    signIn,
    register,
    signOut,
  }), [sessionQuery.data, signIn, register, signOut])

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error('useAuth must be used within AuthProvider')
  return context
}
