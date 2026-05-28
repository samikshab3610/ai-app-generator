'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { validateConfig } from '@/lib/validator'
import { AppConfig } from '@/lib/types'
import AppRenderer from '@/components/renderer/AppRenderer'
import { useRouter } from 'next/navigation'


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

export default function Home() {
  const [json, setJson] = useState(SAMPLE_CONFIG)
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [parseError, setParseError] = useState('')
  const { data: session, status } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    } else if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    )
  }

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

    if (result.valid) {
      setConfig(result.sanitized)
    } else {
      setConfig(null)
    }
  }

  const handleSave = async () => {
    if (!config) return
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config }),
    })
    const data = await res.json()
    if (res.ok) {
      window.location.href = `/dashboard`
    } else if (res.status === 401) {
      window.location.href = '/login'
    } else {
      alert(data.error || 'Failed to save')
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI App Generator</h1>
          <p className="text-gray-500 mt-1">Paste a JSON config and generate a live working app instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: JSON Editor */}
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
          </div>

          {/* Right: Live Preview */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Live Preview</h2>
            {config ? (
              <AppRenderer config={config} />
            ) : (
              <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-400 text-lg">👈 Paste your config and click</p>
                  <p className="text-gray-400 font-semibold">Generate App</p>
                  {config && (
                    <button
                      onClick={handleSave}
                      className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                      {session ? '💾 Save to Dashboard' : '🔐 Login to Save'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}