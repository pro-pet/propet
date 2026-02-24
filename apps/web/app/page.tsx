async function getWelcome() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
  return res.text()
}

export default async function Page() {
  const message = await getWelcome()

  return (
    <div className="flex items-center justify-center min-h-svh">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  )
}
