import { getSurveyConfig, getAllSurveyConfigs } from '@/lib/survey-config'
import { notFound } from 'next/navigation'
import SurveyPage from '@/components/SurveyPage'

// 問卷是 data/surveys/*.json 熱插拔的 — 靜態化會把 JSON 內容烘死在 build 裡,
// 改檔案不重 build 就看不到(2026-07-17 改時間實案)。強制動態,每請求重讀 config。
export const dynamic = 'force-dynamic'

interface PageProps {
  readonly params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const configs = getAllSurveyConfigs()
  return configs
    .filter(c => c.slug !== 'home')
    .map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const config = getSurveyConfig(slug)
  if (!config) return {}
  const title = Array.isArray(config.title) ? config.title.join(' ') : config.title
  return {
    title,
    description: config.subtitle ?? title,
  }
}

export default async function SurveyDynamicPage({ params }: PageProps) {
  const { slug } = await params
  const config = getSurveyConfig(slug)
  if (!config) notFound()
  return <SurveyPage config={config} />
}
