import { NextRequest, NextResponse } from 'next/server'
import { getResponses } from '@/lib/db'
import { getAllSurveyConfigs } from '@/lib/survey-config'

export async function POST(req: NextRequest) {
  const { password, slug } = await req.json()
  const adminPw = process.env.ADMIN_PASSWORD

  if (!adminPw || password !== adminPw) {
    return NextResponse.json({ error: '密碼錯誤' }, { status: 403 })
  }

  // 問卷清單(給後台切換器):slug + 標題
  const configs = getAllSurveyConfigs()
  const surveys = configs.map(c => ({
    slug: c.slug,
    title: Array.isArray(c.title) ? c.title.join(' ') : c.title,
  }))

  if (slug) {
    const responses = getResponses(slug)
    return NextResponse.json({ responses, total: responses.length, surveys })
  }

  const all = configs.flatMap(c => [...getResponses(c.slug)])
  return NextResponse.json({ responses: all, total: all.length, surveys })
}
