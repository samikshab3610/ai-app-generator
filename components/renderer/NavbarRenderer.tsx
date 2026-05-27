import React from 'react'
import { ComponentConfig } from '@/lib/types'

interface Props {
  config: ComponentConfig
}

export default function NavbarRenderer({ config }: Props) {
  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between rounded-xl">
      <span className="text-xl font-bold text-blue-600">
        {config.logoText || 'App'}
      </span>
      <div className="flex gap-6">
        {config.links?.map((link, i) => (
          <a key={i} href={link.href} className="text-gray-600 hover:text-blue-600 text-sm font-medium transition">
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}