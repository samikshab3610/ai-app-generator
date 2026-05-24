"use client"
import ComponentMapper from "@/components/renderer/ComponentMapper"

import { useState } from "react"

export default function Home() {
  const [json, setJson] = useState(`{
  "ui": [
    {
      "type": "form",
      "fields": [
        { "name": "name", "type": "text" },
        { "name": "age", "type": "number" }
      ]
    },
    {
      "type": "table"
    }
  ]
}`)
  const [error, setError] = useState("")
  const [config, setConfig] = useState<any>(null)
  const [data, setData] = useState<any[]>([])

  const handleGenerate = () => {
    try {
      const parsed = JSON.parse(json)
      setConfig(parsed)
      setError("")
    } catch (err) {
      setError("Invalid JSON format")
      setConfig(null)
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI App Generator</h1>
      <p className="text-gray-400">
        Generate dynamic forms and tables from JSON configuration
      </p>


      <textarea
        className="border w-full p-2 h-40"
        placeholder="Paste JSON here..."
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Generate App
      </button>

      {error && <div className="text-red-500">{error}</div>}

      {config?.ui?.map((comp: any, i: number) => (
        <ComponentMapper
          key={i}
          component={comp}
          data={data}
          setData={setData}
        />
      ))}
    </main>
  )
}