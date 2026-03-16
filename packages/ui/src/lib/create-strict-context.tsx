import * as React from 'react'

type CreateStrictContextReturn<T> = [
  ({ value, children }: { value: T, children?: React.ReactNode }) => React.JSX.Element,
  () => T,
]

function createStrictContext<T>(name?: string): CreateStrictContextReturn<T> {
  const Context = React.createContext<T | undefined>(undefined)

  const Provider = ({
    value,
    children,
  }: {
    value: T
    children?: React.ReactNode
  }) => <Context value={value}>{children}</Context>

  const useSafeContext = () => {
    const ctx = React.use(Context)
    if (ctx === undefined) {
      throw new Error(`useContext must be used within ${name ?? 'a Provider'}`)
    }
    return ctx
  }

  return [Provider, useSafeContext] as const
}

export { createStrictContext }
