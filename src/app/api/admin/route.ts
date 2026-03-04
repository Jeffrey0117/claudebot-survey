import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllResponses } from '@/lib/db'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim())

export async function GET() {
  const session = await auth()
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: '權限不足' }, { status: 403 })
  }

  const responses = getAllResponses()
  return NextResponse.json({ responses, total: responses.length })
}
