'use client'

import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  createdAt: string
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.ok ? res.json() : { data: [] })
      .then(json => setUsers(json.data ?? []))
      .catch(() => setUsers([]))
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-6 p-8">
      <h1 className="text-2xl font-bold">ProPet 用户列表</h1>
      {users.length === 0
        ? (
            <p className="text-muted-foreground">暂无用户</p>
          )
        : (
            <ul className="w-full max-w-md space-y-3">
              {users.map(user => (
                <li
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{user.name || '未命名'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </li>
              ))}
            </ul>
          )}
    </div>
  )
}
