'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { validateConfig } from '@/lib/validator'
import { AppConfig } from '@/lib/types'
import AppRenderer from '@/components/renderer/AppRenderer'

const SAMPLE_CONFIG = `{
  "appType": "crud",
  "name": "Task Manager",
  "description": "A simple task tracking app",
  "pages": [
    {
      "title": "Tasks",
      "components": [
        {
          "type": "form",
          "title": "Add New Task",
          "fields": [
            { "name": "title", "label": "Task Title", "type": "text", "required": true },
            { "name": "priority", "label": "Priority", "type": "select", "options": ["Low", "Medium", "High"] },
            { "name": "notes", "label": "Notes", "type": "textarea" }
          ]
        },
        {
          "type": "table",
          "title": "All Tasks",
          "columns": [
            { "key": "title", "label": "Title" },
            { "key": "priority", "label": "Priority" },
            { "key": "notes", "label": "Notes" }
          ]
        }
      ]
    }
  ]
}`

export default function BuilderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [json, setJson] = useState(SAMPLE_CONFIG)
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [parseError, setParseError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const handleGenerate = () => {
    setParseError('')
    setErrors([])
    setWarnings([])

    let parsed: unknown
    try {
      parsed = JSON.parse(json)
    } catch {
      setParseError('Invalid JSON — please check your syntax.')
      setConfig(null)
      return
    }

    const result = validateConfig(parsed)
    setErrors(result.errors)
    setWarnings(result.warnings)
    if (result.valid) setConfig(result.sanitized)
    else setConfig(null)
  }

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      router.push(`/app/${data.project.id}`)
    } else {
      alert(data.error || 'Failed to save')
    }
  }

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-600">AppGen</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{session?.user?.name || session?.user?.email}</span>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-blue-600 hover:underline">
            ← Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New App</h1>
          <p className="text-gray-500 text-sm mt-1">Paste a JSON config and generate a live working app.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">JSON Config</h2>
            <textarea
              className="w-full h-96 font-mono text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={json}
              onChange={(e) => setJson(e.target.value)}
              spellCheck={false}
            />

            {parseError && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">❌ {parseError}</p>
              </div>
            )}
            {errors.length > 0 && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                {errors.map((e, i) => <p key={i} className="text-red-600 text-sm">❌ {e}</p>)}
              </div>
            )}
            {warnings.length > 0 && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
                {warnings.map((w, i) => <p key={i} className="text-yellow-700 text-sm">⚠️ {w}</p>)}
              </div>
            )}

            <button
              onClick={handleGenerate}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Generate App →
            </button>

            {config && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {saving ? 'Saving...' : '💾 Save & Open App'}
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Live Preview</h2>
            {config ? (
              <AppRenderer config={config} />
            ) : (
              <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-400 text-lg">👈 Paste your config and click</p>
                  <p className="text-gray-400 font-semibold">Generate App</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}