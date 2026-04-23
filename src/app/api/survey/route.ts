import { NextRequest, NextResponse } from 'next/server'
import { addResponse, hasSubmitted } from '@/lib/db'
import { getSurveyConfig } from '@/lib/survey-config'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

const submitSchema = z.object({
  slug: z.string().min(1),
  identity: z.record(z.string()),
  answers: z.record(z.union([z.string(), z.array(z.string())])),
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? '資料格式錯誤'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { slug, identity, answers } = parsed.data

  const config = getSurveyConfig(slug)
  if (!config) {
    return NextResponse.json({ error: '找不到問卷' }, { status: 404 })
  }

  for (const field of config.identityFields) {
    if (field.required && !identity[field.key]?.trim()) {
      return NextResponse.json({ error: `請輸入${field.label}` }, { status: 400 })
    }
    if (field.type === 'email' && identity[field.key]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(identity[field.key])) {
        return NextResponse.json({ error: `${field.label} 格式不正確` }, { status: 400 })
      }
    }
  }

  const dedupValue = identity[config.deduplicateBy]
  if (dedupValue && hasSubmitted(slug, config.deduplicateBy, dedupValue)) {
    return NextResponse.json({ error: config.duplicateMessage }, { status: 409 })
  }

  addResponse({
    id: randomUUID(),
    slug,
    identity,
    answers,
    submittedAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const field = req.nextUrl.searchParams.get('field')
  const value = req.nextUrl.searchParams.get('value')
  if (!slug || !field || !value) {
    return NextResponse.json({ submitted: false })
  }
  return NextResponse.json({ submitted: hasSubmitted(slug, field, value) })
}
