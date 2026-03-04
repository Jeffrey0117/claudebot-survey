import { NextRequest, NextResponse } from 'next/server'
import { getAllResponses } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const adminPw = process.env.ADMIN_PASSWORD

  if (!adminPw || password !== adminPw) {
    return NextResponse.json({ error: '密碼錯誤' }, { status: 403 })
  }

  const responses = getAllResponses()
  return NextResponse.json({ responses, total: responses.length })
}
