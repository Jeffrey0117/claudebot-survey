import { getSurveyConfig } from '@/lib/survey-config'
import SurveyPage from '@/components/SurveyPage'

export default function Home() {
  const config = getSurveyConfig('home')
  if (!config) {
    return <p>Survey config not found</p>
  }
  return <SurveyPage config={config} />
}
