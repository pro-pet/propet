import type { NextRequest } from 'next/server'
import type { CurrentUser } from '@/lib/current-user'
import { NextResponse } from 'next/server'

const SESSION_COOKIE = 'propet-session'
const apiUrl = `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')}/api`
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token)
    return json({ user: null })

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    if (response.status === 401) {
      const result = json({ user: null })
      result.cookies.set(SESSION_COOKIE, '', { ...cookieOptions, maxAge: 0 })
      return result
    }
    if (!response.ok)
      return json({ message: '暂时无法获取登录状态' }, 503)

    const { data } = await response.json() as { data: CurrentUser }
    return json({ user: { id: data.id, name: data.name, avatar: data.avatar } })
  }
  catch {
    return json({ message: '暂时无法获取登录状态' }, 503)
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin && origin !== request.nextUrl.origin)
    return json({ message: '请求来源无效' }, 403)

  let credentials: { email?: unknown, password?: unknown }
  try {
    credentials = await request.json()
  }
  catch {
    return json({ message: '登录信息格式无效' }, 400)
  }
  if (!credentials || typeof credentials.email !== 'string' || !credentials.email.trim()
    || typeof credentials.password !== 'string' || !credentials.password) {
    return json({ message: '请输入邮箱和密码' }, 400)
  }

  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: credentials.email.trim(), password: credentials.password }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    if (response.status === 401)
      return json({ message: '邮箱或密码不正确' }, 401)
    if (!response.ok)
      return json({ message: '登录服务暂时不可用，请稍后重试' }, 503)

    const { data } = await response.json() as { data: { user: CurrentUser, token: string } }
    const result = json({ user: { id: data.user.id, name: data.user.name, avatar: data.user.avatar } })
    result.cookies.set(SESSION_COOKIE, data.token, cookieOptions)
    return result
  }
  catch {
    return json({ message: '登录服务暂时不可用，请稍后重试' }, 503)
  }
}
