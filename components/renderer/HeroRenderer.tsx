import React from 'react'
import { ComponentConfig } from '@/lib/types'

interface Props {
  config: ComponentConfig
}

export default function HeroRenderer({ config }: Props) {
  return (
    <div className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-8 text-center rounded-xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {config.title || 'Welcome'}
      </h1>
      {config.subtitle && (
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {config.subtitle}
        </p>
      )}
      {config.buttonText && (
        <a href={config.buttonLink || '#'} className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition">
          {config.buttonText}
        </a>
      )}
    </div>
  )
}