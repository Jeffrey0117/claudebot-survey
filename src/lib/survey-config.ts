import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { SurveyConfig } from './types'

const SURVEYS_DIR = join(process.cwd(), 'data', 'surveys')

export function getSurveyConfig(slug: string): SurveyConfig | null {
  const filePath = join(SURVEYS_DIR, `${slug}.json`)
  if (!existsSync(filePath)) return null

  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as SurveyConfig
}

export function getAllSurveyConfigs(): SurveyConfig[] {
  if (!existsSync(SURVEYS_DIR)) return []

  return readdirSync(SURVEYS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = readFileSync(join(SURVEYS_DIR, f), 'utf-8')
      return JSON.parse(raw) as SurveyConfig
    })
}
