'use client'
import React from 'react'
import { ComponentConfig } from '@/lib/types'
import FormRenderer from './FormRenderer'
import TableRenderer from './TableRenderer'
import HeroRenderer from './HeroRenderer'
import FeaturesRenderer from './FeaturesRenderer'
import NavbarRenderer from './NavbarRenderer'

interface Props {
  config: ComponentConfig
  onFormSubmit?: (data: Record<string, unknown>) => void
  tableData?: Record<string, unknown>[]
}

export default function ComponentRegistry({ config, onFormSubmit, tableData }: Props) {
  switch (config.type) {
    case 'form':
      return (
        <FormRenderer
          fields={config.fields || []}
          title={config.title}
          onSubmit={onFormSubmit}
        />
      )
    case 'table':
      return (
        <TableRenderer
          columns={config.columns}
          data={tableData || []}
          title={config.title}
        />
      )
    case 'hero':
      return <HeroRenderer config={config} />
    case 'features':
      return <FeaturesRenderer config={config} />
    case 'navbar':
      return <NavbarRenderer config={config} />
    default:
      return (
        <div className="border-2 border-dashed border-yellow-400 rounded-xl p-6 text-center bg-yellow-50">
          <p className="text-yellow-700 font-medium">Unknown component: <code>{config.type}</code></p>
          <p className="text-yellow-600 text-sm mt-1">This component type is not supported yet.</p>
        </div>
      )
  }
}