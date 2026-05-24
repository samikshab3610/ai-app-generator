"use client"

import { useState } from "react"

export default function Home() {
  const [json, setJson] = useState("")
  const [error, setError] = useState("")
  const [config, setConfig] = useState<any>(null)

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

      <textarea
        className="border w-full p-2 h-40"
        placeholder="Paste JSON here..."
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="bg-green-500 text-white px-4 py-2"
      >
        Generate App
      </button>

      {error && <div className="text-red-500">{error}</div>}

      {config?.ui?.map((comp: any, i: number) => {
        return (
          <div key={i} className="p-4 border rounded">
            Rendering component: {comp.type}
          </div>
        )
      })}
    </main>
  )
}