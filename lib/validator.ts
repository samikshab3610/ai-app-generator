import { AppConfig, ComponentConfig, FormField, ValidationResult } from './types'

const KNOWN_COMPONENT_TYPES = ['form', 'table', 'hero', 'features', 'card', 'navbar', 'footer']
const KNOWN_FIELD_TYPES = ['text', 'number', 'email', 'date', 'select', 'textarea', 'checkbox']

function sanitizeField(field: unknown, index: number): FormField | null {
  if (typeof field !== 'object' || field === null) return null
  const f = field as Record<string, unknown>
  if (!f.name || typeof f.name !== 'string' || f.name.trim() === '') return null

  return {
    name: f.name.trim(),
    label: typeof f.label === 'string' ? f.label : f.name,
    type: KNOWN_FIELD_TYPES.includes(f.type as string)
      ? (f.type as FormField['type'])
      : 'text',
    required: typeof f.required === 'boolean' ? f.required : false,
    placeholder: typeof f.placeholder === 'string' ? f.placeholder : '',
    options: Array.isArray(f.options)
      ? f.options.filter((o) => typeof o === 'string')
      : undefined,
  }
}

function sanitizeComponent(comp: unknown, warnings: string[]): ComponentConfig | null {
  if (typeof comp !== 'object' || comp === null) return null
  const c = comp as Record<string, unknown>

  if (!c.type || typeof c.type !== 'string') {
    warnings.push('A component is missing a type — skipped')
    return null
  }

  if (!KNOWN_COMPONENT_TYPES.includes(c.type)) {
    warnings.push(`Unknown component type "${c.type}" — will render a fallback`)
  }

  const sanitized: ComponentConfig = { type: c.type }

  if (c.title) sanitized.title = String(c.title)
  if (c.subtitle) sanitized.subtitle = String(c.subtitle)
  if (c.buttonText) sanitized.buttonText = String(c.buttonText)
  if (c.buttonLink) sanitized.buttonLink = String(c.buttonLink)
  if (c.logoText) sanitized.logoText = String(c.logoText)

  if (Array.isArray(c.fields)) {
    sanitized.fields = c.fields
      .map((f, i) => sanitizeField(f, i))
      .filter(Boolean) as FormField[]
  }

  if (Array.isArray(c.columns)) {
    sanitized.columns = c.columns.map((col: unknown) => {
      const co = col as Record<string, unknown>
      return { key: String(co.key || ''), label: String(co.label || co.key || '') }
    })
  }

  if (Array.isArray(c.items)) {
    sanitized.items = c.items.map((item: unknown) => {
      const it = item as Record<string, unknown>
      return {
        title: String(it.title || 'Untitled'),
        description: it.description ? String(it.description) : undefined,
        icon: it.icon ? String(it.icon) : undefined,
      }
    })
  }

  if (Array.isArray(c.links)) {
    sanitized.links = c.links.map((link: unknown) => {
      const l = link as Record<string, unknown>
      return { label: String(l.label || ''), href: String(l.href || '#') }
    })
  }

  return sanitized
}

export function validateConfig(raw: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (typeof raw !== 'object' || raw === null) {
    return {
      valid: false,
      errors: ['Config must be a JSON object'],
      warnings: [],
      sanitized: fallbackConfig(),
    }
  }

  const config = raw as Record<string, unknown>

  // appType
  let appType: AppConfig['appType'] = 'crud'
  if (config.appType === 'landing') appType = 'landing'
  else if (config.appType && config.appType !== 'crud') {
    warnings.push(`Unknown appType "${config.appType}" — defaulting to "crud"`)
  }

  // name
  let name = 'Untitled App'
  if (typeof config.name === 'string' && config.name.trim()) {
    name = config.name.trim()
  } else {
    warnings.push('App name missing — defaulting to "Untitled App"')
  }

  // pages
  if (!Array.isArray(config.pages) || config.pages.length === 0) {
    errors.push('Config must have at least one page')
    return { valid: false, errors, warnings, sanitized: fallbackConfig() }
  }

  const pages = config.pages.map((page: unknown) => {
    const p = page as Record<string, unknown>
    const components = Array.isArray(p.components)
      ? p.components
          .map((c) => sanitizeComponent(c, warnings))
          .filter(Boolean)
      : []

    return {
      title: typeof p.title === 'string' ? p.title : 'Page',
      path: typeof p.path === 'string' ? p.path : '/',
      components: components as ComponentConfig[],
    }
  })

  return {
    valid: true,
    errors,
    warnings,
    sanitized: { appType, name, pages },
  }
}

function fallbackConfig(): AppConfig {
  return {
    appType: 'crud',
    name: 'Untitled App',
    pages: [{ components: [] }],
  }
}