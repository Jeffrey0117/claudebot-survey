import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DATA_DIR = join(process.cwd(), 'data')
const DB_FILE = join(DATA_DIR, 'english-speaking.json')

export interface EventRegistration {
  readonly id: string
  readonly name: string
  readonly phone: string
  readonly email: string
  readonly submittedAt: string
}

function ensureDb(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, '[]', 'utf-8')
}

export function getAllRegistrations(): readonly EventRegistration[] {
  ensureDb()
  const raw = readFileSync(DB_FILE, 'utf-8')
  return JSON.parse(raw) as EventRegistration[]
}

export function addRegistration(reg: EventRegistration): void {
  const all = [...getAllRegistrations(), reg]
  writeFileSync(DB_FILE, JSON.stringify(all, null, 2), 'utf-8')
}

export function hasRegistered(phone: string): boolean {
  return getAllRegistrations().some(r => r.phone === phone)
}
