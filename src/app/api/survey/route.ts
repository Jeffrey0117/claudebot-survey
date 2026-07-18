import { NextRequest, NextResponse } from 'next/server'
import { addResponse, hasSubmitted } from '@/lib/db'
import { getSurveyConfig } from '@/lib/survey-config'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

// 長度/數量上限:公開表單,擋灌 MB 級垃圾撐爆 JSON 檔
const submitSchema = z.object({
  slug: z.string().min(1).max(64),
  identity: z
    .record(z.string().max(200))
    .refine(r => Object.keys(r).length <= 10, { message: '欄位過多' }),
  answers: z
    .record(z.union([z.string().max(2000), z.array(z.string().max(200)).max(20)]))
    .refine(r => Object.keys(r).length <= 30, { message: '欄位過多' }),
})

// 簡易 IP 頻率限制(單程序 in-memory 即可:cloudpipe 跑單一 node instance)。
// 擋「換 email 無限塞」的機器/惡搞;正常人 10 分鐘內不會送超過 5 份。
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const rateMap = new Map<string, number[]>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (rateMap.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS)
  if (hits.length >= RATE_MAX) { rateMap.set(ip, hits); return true }
  hits.push(now)
  rateMap.set(ip, hits)
  // 順手清舊 key,防 Map 無限長
  if (rateMap.size > 5000) {
    for (const [k, v] of rateMap) if (v.every(t => now - t >= RATE_WINDOW_MS)) rateMap.delete(k)
  }
  return false
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
  if (rateLimited(ip)) {
    return NextResponse.json({ error: '送出太頻繁,請稍後再試' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: '資料格式錯誤' }, { status: 400 })

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
