'use client'

import type { CurrentUser } from '@/lib/current-user'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

interface AuthContextValue {
  user: CurrentUser | null
  signIn: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const refreshController = useRef<AbortController | null>(null)
  const signingIn = useRef(false)

  useEffect(() => {
    const refreshUser = async () => {
      if (signingIn.current)
        return
      refreshController.current?.abort()
      refreshController.current = new AbortController()
      const { signal } = refreshController.current

      try {
        const response = await fetch('/api/session', { cache: 'no-store', signal })
        if (!response.ok) {
          if (!signal.aborted)
            setUser(null)
          return
        }
        const data = await response.json() as { user: CurrentUser | null }
        if (!signal.aborted)
          setUser(data.user)
      }
      catch {
        if (!signal.aborted)
          setUser(null)
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible')
        void refreshUser()
    }

    void refreshUser()
    window.addEventListener('focus', refreshUser)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      refreshController.current?.abort()
      window.removeEventListener('focus', refreshUser)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    signingIn.current = true
    refreshController.current?.abort()
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json() as { user?: CurrentUser, message?: string }
      if (!response.ok || !data.user)
        throw new Error(data.message || '登录失败，请稍后重试')
      setUser(data.user)
    }
    finally {
      signingIn.current = false
    }
  }, [])

  const value = useMemo(() => ({ user, signIn }), [user, signIn])

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error('useAuth must be used within AuthProvider')
  return context
}
