import type { NextRequest } from 'next/server'
import type { CurrentUser } from '@/lib/current-user'
import {
  apiJson,
  fetchBackendApi,
  hasSameOrigin,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '@/lib/api/server'

interface ApiEnvelope<T> {
  message?: string | string[]
  data?: T
}

interface RegisterResponse {
  user: CurrentUser
  token: string
}

function errorMessage(message: ApiEnvelope<unknown>['message']) {
  if (typeof message === 'string')
    return message
  if (Array.isArray(message))
    return message.filter((item): item is string => typeof item === 'string').join(', ')
  return '注册服务暂时不可用，请稍后重试'
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request))
    return apiJson({ message: '请求来源无效' }, 403)

  let body: unknown
  try {
    body = await request.json()
  }
  catch {
    return apiJson({ message: '注册信息格式无效' }, 400)
  }

  try {
    const response = await fetchBackendApi('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
    const result = await response.json() as ApiEnvelope<RegisterResponse>
    if (!response.ok || !result.data)
      return apiJson({ message: errorMessage(result.message) }, response.status)

    const resultResponse = apiJson({
      user: {
        id: result.data.user.id,
        name: result.data.user.name,
        avatar: result.data.user.avatar,
      },
    }, response.status)
    resultResponse.cookies.set(SESSION_COOKIE_NAME, result.data.token, sessionCookieOptions)
    return resultResponse
  }
  catch {
    return apiJson({ message: '注册服务暂时不可用，请稍后重试' }, 503)
  }
}
