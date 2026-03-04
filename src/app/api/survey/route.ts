import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { addResponse, hasSubmitted } from '@/lib/db'
import { randomUUID } from 'node:crypto'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '請先登入' }, { status: 401 })
  }

  if (hasSubmitted(session.user.email)) {
    return NextResponse.json({ error: '你已經填過囉！' }, { status: 409 })
  }

  const body = await req.json()

  addResponse({
    id: randomUUID(),
    email: session.user.email,
    name: session.user.name ?? '',
    answers: body.answers,
    submittedAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ submitted: false })
  }
  return NextResponse.json({ submitted: hasSubmitted(session.user.email) })
}
