import { type NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const res = await fetch(`${BACKEND_URL}/api/v1/tins?${searchParams}`, {
    headers: { cookie: request.headers.get('cookie') ?? '' },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const res = await fetch(`${BACKEND_URL}/api/v1/tins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
