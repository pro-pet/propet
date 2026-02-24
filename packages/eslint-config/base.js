import antfu from '@antfu/eslint-config'
import turboPlugin from 'eslint-plugin-turbo'

export function createConfig(options = {}, ...configs) {
  return antfu(
    { typescript: true, stylistic: true, ...options },
    { plugins: { turbo: turboPlugin }, rules: { 'turbo/no-undeclared-env-vars': 'warn' } },
    { rules: { 'node/prefer-global/process': 'off' } },
    { ignores: ['dist/**'] },
    ...configs,
  )
}

export const config = createConfig()
