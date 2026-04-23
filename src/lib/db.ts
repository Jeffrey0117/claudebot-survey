import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { SurveyResponse } from './types'

const RESPONSES_DIR = join(process.cwd(), 'data', 'responses')

function responsePath(slug: string): string {
  return join(RESPONSES_DIR, `${slug}.json`)
}

function ensureDir(): void {
  if (!existsSync(RESPONSES_DIR)) mkdirSync(RESPONSES_DIR, { recursive: true })
}

export function getResponses(slug: string): readonly SurveyResponse[] {
  ensureDir()
  const file = responsePath(slug)
  if (!existsSync(file)) return []
  const raw = readFileSync(file, 'utf-8')
  return JSON.parse(raw) as SurveyResponse[]
}

export function addResponse(response: SurveyResponse): void {
  ensureDir()
  const all = [...getResponses(response.slug), response]
  writeFileSync(responsePath(response.slug), JSON.stringify(all, null, 2), 'utf-8')
}

export function hasSubmitted(slug: string, fieldKey: string, value: string): boolean {
  return getResponses(slug).some(r => r.identity[fieldKey]?.toLowerCase() === value.toLowerCase())
}
