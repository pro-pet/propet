import type { NextRequest } from 'next/server'
import type { CurrentUser } from '@/lib/current-user'
import {
  apiJson,
  BACKEND_API_URL,
  hasSameOrigin,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '@/lib/api/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token)
    return apiJson({ user: null })

  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    if (response.status === 401) {
      const result = apiJson({ user: null })
      result.cookies.set(SESSION_COOKIE_NAME, '', { ...sessionCookieOptions, maxAge: 0 })
      return result
    }
    if (!response.ok)
      return apiJson({ message: '暂时无法获取登录状态' }, 503)

    const { data } = await response.json() as { data: CurrentUser }
    return apiJson({ user: { id: data.id, name: data.name, avatar: data.avatar } })
  }
  catch {
    return apiJson({ message: '暂时无法获取登录状态' }, 503)
  }
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request))
    return apiJson({ message: '请求来源无效' }, 403)

  let credentials: { email?: unknown, password?: unknown }
  try {
    credentials = await request.json()
  }
  catch {
    return apiJson({ message: '登录信息格式无效' }, 400)
  }
  if (!credentials || typeof credentials.email !== 'string' || !credentials.email.trim()
    || typeof credentials.password !== 'string' || !credentials.password) {
    return apiJson({ message: '请输入邮箱和密码' }, 400)
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: credentials.email.trim(), password: credentials.password }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    if (response.status === 401)
      return apiJson({ message: '邮箱或密码不正确' }, 401)
    if (!response.ok)
      return apiJson({ message: '登录服务暂时不可用，请稍后重试' }, 503)

    const { data } = await response.json() as { data: { user: CurrentUser, token: string } }
    const result = apiJson({ user: { id: data.user.id, name: data.user.name, avatar: data.user.avatar } })
    result.cookies.set(SESSION_COOKIE_NAME, data.token, sessionCookieOptions)
    return result
  }
  catch {
    return apiJson({ message: '登录服务暂时不可用，请稍后重试' }, 503)
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasSameOrigin(request))
    return apiJson({ message: '请求来源无效' }, 403)

  const result = apiJson({ user: null })
  result.cookies.set(SESSION_COOKIE_NAME, '', { ...sessionCookieOptions, maxAge: 0 })
  return result
}
