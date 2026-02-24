import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

export function findWorkspaceRoot(from: string): string {
  let dir = from
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml')))
      return dir
    dir = dirname(dir)
  }
  return from
}
