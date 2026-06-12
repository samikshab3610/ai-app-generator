'use client'
import { useState, useEffect } from 'react'
import { TableColumn } from '@/lib/types'

interface Props {
  columns?: TableColumn[]
  data?: Record<string, unknown>[]
  title?: string
}

export default function TableRenderer({ columns, data = [], title }: Props) {
  const [rows, setRows] = useState<Record<string, unknown>[]>(data)

  useEffect(() => {
    if (data && data.length > 0) {
      setRows([...data])
    }
  }, [JSON.stringify(data)])

  // infer columns from data if not provided
  const resolvedColumns: TableColumn[] =
    columns && columns.length > 0
      ? columns
      : rows.length > 0
        ? Object.keys(rows[0]).map((key) => ({ key, label: key }))
        : []

  if (resolvedColumns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        {title && <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>}
        <p className="text-gray-400 text-sm">No data yet. Submit the form to see records here.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full overflow-x-auto">
      {title && <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>}
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200">
            {resolvedColumns.map((col) => (
              <th key={col.key} className="px-4 py-2 font-semibold text-gray-600 uppercase tracking-wide text-xs">
                {col.label || col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={resolvedColumns.length} className="px-4 py-6 text-center text-gray-400">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                {resolvedColumns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-gray-700">
                    {String(row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}