import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { SurveyResponse } from './types'

const RESPONSES_DIR = join(process.cwd(), 'data', 'responses')

function ensureDb(slug: string): string {
  if (!existsSync(RESPONSES_DIR)) mkdirSync(RESPONSES_DIR, { recursive: true })
  const filePath = join(RESPONSES_DIR, `${slug}.json`)
  if (!existsSync(filePath)) writeFileSync(filePath, '[]', 'utf-8')
  return filePath
}

export function getResponses(slug: string): readonly SurveyResponse[] {
  const filePath = ensureDb(slug)
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as SurveyResponse[]
}

export function addResponse(slug: string, response: SurveyResponse): void {
  const filePath = ensureDb(slug)
  const all = [...getResponses(slug), response]
  writeFileSync(filePath, JSON.stringify(all, null, 2), 'utf-8')
}

export function hasDuplicate(slug: string, field: string, value: string): boolean {
  return getResponses(slug).some(r => r.identity[field]?.toLowerCase() === value.toLowerCase())
}
