import { NextRequest, NextResponse } from 'next/server'
import { addRegistration, hasRegistered } from '@/lib/event-db'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1, '請輸入稱謂'),
  phone: z.string().min(1, '請輸入電話'),
  email: z.string().email('Email 格式不正確').or(z.literal('')),
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? '資料格式錯誤'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { name, phone, email } = parsed.data

  if (hasRegistered(phone)) {
    return NextResponse.json({ error: '這個電話號碼已經報名過囉！' }, { status: 409 })
  }

  addRegistration({
    id: randomUUID(),
    name,
    phone,
    email: email || '',
    submittedAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone')
  if (!phone) {
    return NextResponse.json({ registered: false })
  }
  return NextResponse.json({ registered: hasRegistered(phone) })
}
