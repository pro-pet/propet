'use client'

import type { CurrentUser } from '@/lib/current-user'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLogin, useLogout, useRegister, useSession } from '@/lib/api/auth'

interface AuthContextValue {
  user: CurrentUser | null
  signIn: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const sessionQuery = useSession()
  const signInMutation = useLogin()
  const registerMutation = useRegister()
  const signOutMutation = useLogout()

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
