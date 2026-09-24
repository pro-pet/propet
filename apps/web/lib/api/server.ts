import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const backendOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '')
export const BACKEND_API_URL = `${backendOrigin}/api`
export const SESSION_COOKIE_NAME = 'propet-session'
export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export function apiJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  return !origin || origin === request.nextUrl.origin
}

export function fetchBackendApi(path: string, init: RequestInit) {
  return fetch(`${BACKEND_API_URL}${path}`, init)
}

function hasData(value: unknown): value is { data: unknown } {
  return typeof value === 'object' && value !== null && 'data' in value
}

function getErrorMessage(value: unknown) {
  if (typeof value !== 'object' || value === null || !('message' in value))
    return '服务暂时不可用，请稍后重试'

  const message = value.message
  if (typeof message === 'string')
    return message
  if (Array.isArray(message))
    return message.filter((item): item is string => typeof item === 'string').join(', ')
  return '服务暂时不可用，请稍后重试'
}

export async function proxyBackendRequest(request: NextRequest, path: string) {
  const method = request.method.toUpperCase()
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && !hasSameOrigin(request))
    return apiJson({ message: '请求来源无效' }, 403)

  const headers = new Headers({ Accept: 'application/json' })
  const contentType = request.headers.get('content-type')
  if (contentType)
    headers.set('Content-Type', contentType)

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (token)
    headers.set('Authorization', `Bearer ${token}`)

  try {
    const response = await fetchBackendApi(`${path}${request.nextUrl.search}`, {
      method,
      headers,
      body: ['GET', 'HEAD', 'OPTIONS'].includes(method) ? undefined : await request.text(),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })

    if (response.status === 204)
      return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })

    const responseText = await response.text()
    let payload: unknown
    try {
      payload = responseText ? JSON.parse(responseText) : null
    }
    catch {
      return new NextResponse(responseText, {
        status: response.status,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': response.headers.get('content-type') || 'text/plain',
        },
      })
    }

    if (!response.ok)
      return apiJson({ message: getErrorMessage(payload) }, response.status)

    return apiJson(hasData(payload) ? payload.data : payload, response.status)
  }
  catch {
    return apiJson({ message: '服务暂时不可用，请稍后重试' }, 503)
  }
}
