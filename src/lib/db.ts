import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DATA_DIR = join(process.cwd(), 'data')
const DB_FILE = join(DATA_DIR, 'surveys.json')

export interface SurveyResponse {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly answers: Record<string, string | string[]>
  readonly submittedAt: string
}

function ensureDb(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, '[]', 'utf-8')
}

export function getAllResponses(): readonly SurveyResponse[] {
  ensureDb()
  const raw = readFileSync(DB_FILE, 'utf-8')
  return JSON.parse(raw) as SurveyResponse[]
}

export function addResponse(response: SurveyResponse): void {
  const all = [...getAllResponses(), response]
  writeFileSync(DB_FILE, JSON.stringify(all, null, 2), 'utf-8')
}

export function hasSubmitted(email: string): boolean {
  return getAllResponses().some(r => r.email === email)
}
