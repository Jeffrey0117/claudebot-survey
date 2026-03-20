import { getSurveyConfig, getAllSurveyConfigs } from '@/lib/survey-config'
import { notFound } from 'next/navigation'
import SurveyPage from '@/components/SurveyPage'

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
