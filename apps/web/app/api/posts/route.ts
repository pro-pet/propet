import type { NextRequest } from 'next/server'
import { proxyBackendRequest } from '@/lib/api/server'

export function GET(request: NextRequest) {
  return proxyBackendRequest(request, '/posts')
}

export function POST(request: NextRequest) {
  return proxyBackendRequest(request, '/posts')
}
