export type FieldType = 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox'

export interface FormField {
  name: string
  label?: string
  type?: FieldType
  required?: boolean
  options?: string[] // for select fields
  placeholder?: string
}

export interface TableColumn {
  key: string
  label?: string
  type?: string
}

export interface ComponentConfig {
  type: string
  fields?: FormField[]       // for form
  columns?: TableColumn[]    // for table
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  items?: Array<{            // for features/cards
    title: string
    description?: string
    icon?: string
  }>
  links?: Array<{            // for navbar
    label: string
    href: string
  }>
  logoText?: string
  [key: string]: unknown     // allows unknown keys without breaking
}

export interface PageConfig {
  title?: string
  path?: string
  components: ComponentConfig[]
}

export interface AppConfig {
  appType: 'crud' | 'landing'
  name: string
  description?: string
  theme?: {
    primaryColor?: string
    darkMode?: boolean
  }
  pages: PageConfig[]
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  sanitized: AppConfig
}