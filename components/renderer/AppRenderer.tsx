'use client'
import React, { useState, useEffect } from 'react'
import { AppConfig } from '@/lib/types'
import ComponentRegistry from './ComponentRegistry'

interface Props {
  config: AppConfig
  projectId?: string
}

export default function AppRenderer({ config, projectId }: Props) {
  const [tableData, setTableData] = useState<Record<string, unknown>[]>([])
  const [csvUploading, setCsvUploading] = useState(false)
  const [csvMessage, setCsvMessage] = useState('')

  useEffect(() => {
    if (projectId) {
      fetch(`/api/projects/${projectId}/records`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Records from DB:', JSON.stringify(data))
          if (data.records && data.records.length > 0) {
            const rows = data.records.map((r: { id: string, data: Record<string, unknown> }) => ({ ...r.data, _id: r.id }))
            console.log('Setting table data:', rows)
            setTableData(rows)
          }
        })
    }
  }, [projectId])

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setTableData((prev) => [...prev, { ...data, _id: Date.now() }])

    if (projectId) {
      await fetch(`/api/projects/${projectId}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !projectId) return
    setCsvUploading(true)
    setCsvMessage('')

    const formData = new FormData()
    formData.append('file', e.target.files[0])

    try {
      const res = await fetch(`/api/projects/${projectId}/csv`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setCsvMessage(`✅ ${data.imported} records imported successfully!`)
        // reload records
        const recordsRes = await fetch(`/api/projects/${projectId}/records`)
        const recordsData = await recordsRes.json()
        console.log('After CSV, records:', JSON.stringify(recordsData))
        if (recordsData.records && recordsData.records.length > 0) {
          // const rows = recordsData.records.map((r: { id: string, data: Record<string, unknown> }) => ({ ...r.data, _id: r.id }))
          // setTableData(rows)
        }
      } else {
        setCsvMessage(`❌ ${data.error}`)
      }
    } catch {
      setCsvMessage('❌ Upload failed')
    } finally {
      setCsvUploading(false)
    }
  }

  const page = config.pages[0]
  if (!page) {
    return <div className="p-8 text-center text-gray-400">No pages configured.</div>
  }

  const hasTable = page.components.some((c) => c.type === 'table')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{config.name}</h1>
            {config.description && (
              <p className="text-gray-500 text-sm mt-1">{config.description}</p>
            )}
          </div>

          {hasTable && projectId && (
            <div className="flex items-center gap-3">
              {csvMessage && (
                <span className="text-sm">{csvMessage}</span>
              )}
              <label className="cursor-pointer bg-white border border-gray-300 hover:border-blue-500 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2">
                {csvUploading ? '⏳ Uploading...' : '📂 Import CSV'}
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                  disabled={csvUploading}
                />
              </label>
            </div>
          )}
        </div>

        {page.components.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <p className="text-gray-400">No components configured for this page.</p>
          </div>
        ) : (
          page.components.map((component, i) => (
            <ComponentRegistry
              key={i}
              config={component}
              onFormSubmit={handleFormSubmit}
              tableData={tableData}
            />
          ))
        )}
      </div>
    </div>
  )
}