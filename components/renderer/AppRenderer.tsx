'use client'
import React, { useState } from 'react'
import { AppConfig } from '@/lib/types'
import ComponentRegistry from './ComponentRegistry'

interface Props {
  config: AppConfig
}

export default function AppRenderer({ config }: Props) {
  const [tableData, setTableData] = useState<Record<string, unknown>[]>([])

  const handleFormSubmit = (data: Record<string, unknown>) => {
    setTableData((prev) => [...prev, { ...data, _id: Date.now() }])
  }

  const page = config.pages[0]

  if (!page) {
    return (
      <div className="p-8 text-center text-gray-400">
        No pages configured.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{config.name}</h1>
          {config.description && (
            <p className="text-gray-500 text-sm mt-1">{config.description}</p>
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