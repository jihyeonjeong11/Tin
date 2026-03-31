import { type NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`${BACKEND_URL}/api/v1/tins/${id}/archive`, {
    method: 'PATCH',
    headers: { cookie: request.headers.get('cookie') ?? '' },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
