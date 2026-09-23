'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'
import { AuthProvider } from '@/components/auth-provider'
import { QueryProvider } from '@/components/query-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </NextThemesProvider>
  )
}
