import { NextRequest, NextResponse } from 'next/server'
import { getResponses } from '@/lib/db'
import { getAllSurveyConfigs } from '@/lib/survey-config'

export async function POST(req: NextRequest) {
  const { password, slug } = await req.json()
  const adminPw = process.env.ADMIN_PASSWORD

  if (!adminPw || password !== adminPw) {
    return NextResponse.json({ error: '密碼錯誤' }, { status: 403 })
  }

  if (slug) {
    const responses = getResponses(slug)
    return NextResponse.json({ responses, total: responses.length })
  }

  const configs = getAllSurveyConfigs()
  const all = configs.flatMap(c => [...getResponses(c.slug)])
  return NextResponse.json({ responses: all, total: all.length })
}
