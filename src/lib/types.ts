export interface IdentityField {
  readonly key: string
  readonly label: string
  readonly type: 'text' | 'email' | 'tel'
  readonly required: boolean
  readonly placeholder: string
  readonly hint?: string
}

export interface QuestionConfig {
  readonly id: string
  readonly label: string
  readonly type: 'radio' | 'checkbox' | 'text' | 'confirm'
  readonly options?: readonly string[]
  readonly required?: boolean
  readonly placeholder?: string
}

export interface HeroExtraLine {
  readonly text: string
  readonly style: 'prominent' | 'link' | 'muted'
  readonly href?: string
}

export interface SurveyConfig {
  readonly slug: string
  readonly title: string | readonly string[]
  readonly subtitle?: string
  readonly badge?: {
    readonly icon?: string
    readonly text: string
  }
  readonly heroExtra?: readonly HeroExtraLine[]
  readonly identityFields: readonly IdentityField[]
  readonly identitySectionLabel?: string
  readonly questions: readonly QuestionConfig[]
  readonly submitLabel: string
  readonly deduplicateBy: string
  readonly duplicateMessage: string
  readonly successMessage: {
    readonly emoji?: string
    readonly title: string
    readonly body: string
  }
  readonly showAuthorCard?: boolean
  readonly coupon?: {
    readonly enabled: boolean
    readonly code: string
    readonly amount: number
    readonly currency: string
    readonly label: string
  }
}

export interface SurveyResponse {
  readonly id: string
  readonly slug: string
  readonly identity: Record<string, string>
  readonly answers: Record<string, string | string[]>
  readonly submittedAt: string
}
