'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AppConfig } from '@/lib/types'
import { validateConfig } from '@/lib/validator'
import AppRenderer from '@/components/renderer/AppRenderer'
import Link from 'next/link'

export default function GeneratedAppPage() {
  const { projectId } = useParams()
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`)
      if (!res.ok) {
        setError('App not found')
        setLoading(false)
        return
      }
      const data = await res.json()
      const result = validateConfig(data.project.config)
      if (result.valid) {
        setConfig(result.sanitized)
        setProjectName(data.project.name)
      } else {
        setError('Invalid app configuration')
      }
    } catch {
      setError('Failed to load app')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading app...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Generated App: <span className="font-semibold text-gray-800">{projectName}</span>
        </span>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </Link>
      </div>
      {config && <AppRenderer config={config} projectId={projectId as string} />}
    </main>
  )
}