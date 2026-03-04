import { NextRequest, NextResponse } from 'next/server'
import { addResponse, hasSubmitted } from '@/lib/db'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

const submitSchema = z.object({
  name: z.string().min(1, '請輸入姓名'),
  email: z.string().email('Email 格式不正確'),
  answers: z.record(z.union([z.string(), z.array(z.string())])),
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? '資料格式錯誤'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { name, email, answers } = parsed.data
  const normalizedEmail = email.toLowerCase()

  if (hasSubmitted(normalizedEmail)) {
    return NextResponse.json({ error: '這個 Email 已經填過囉！' }, { status: 409 })
  }

  addResponse({
    id: randomUUID(),
    email: normalizedEmail,
    name,
    answers,
    submittedAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ submitted: false })
  }
  return NextResponse.json({ submitted: hasSubmitted(email.toLowerCase()) })
}
