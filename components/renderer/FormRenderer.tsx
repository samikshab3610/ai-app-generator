'use client'
import { useState } from 'react'
import { FormField } from '@/lib/types'

interface Props {
  fields: FormField[]
  title?: string
  onSubmit?: (data: Record<string, unknown>) => void
}

export default function FormRenderer({ fields, title, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (onSubmit) onSubmit(values)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  if (!fields || fields.length === 0) {
    return <p className="text-gray-400 text-sm">No fields configured for this form.</p>
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-lg">
      {title && <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>}
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label || field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder}
                rows={3}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : field.type === 'select' && field.options ? (
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleChange(field.name, e.target.value)}
              >
                <option value="">Select...</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600"
                onChange={(e) => handleChange(field.name, e.target.checked)}
              />
            ) : (
              <input
                type={field.type || 'text'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
      >
        Submit
      </button>

      {submitted && (
        <p className="mt-3 text-green-600 text-sm text-center">✅ Submitted successfully!</p>
      )}
    </div>
  )
}