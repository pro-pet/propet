import type { NextRequest } from 'next/server'
import { proxyBackendRequest } from '@/lib/api/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

async function forward(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  return proxyBackendRequest(request, `/pets/${encodeURIComponent(id)}`)
}

export const GET = forward
export const PATCH = forward
export const DELETE = forward
