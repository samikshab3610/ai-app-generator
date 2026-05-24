"use client"

import Papa from "papaparse"
import { useState } from "react"

export default function FormRenderer({ component, data, setData }: any) {
    const [form, setForm] = useState<any>({})

    const fields = component?.fields || []

    if (!fields || fields.length === 0) {
        return (
            <div className="p-4 bg-yellow-100">
                No fields provided for form
            </div>
        )
    }

    const handleChange = (name: string, value: any) => {
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        setData((prev: any) => [...prev, form])
        setForm({})
    }

    const handleCSVUpload = (e: any) => {
        const file = e.target.files[0]

        if (!file) return

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                setData((prev: any) => [...prev, ...results.data])
            }
        })
    }

    return (
        <div>
            <div className="p-2 border mb-2">
                <input type="file" accept=".csv" onChange={handleCSVUpload} />
            </div>
            <form onSubmit={handleSubmit} className="space-y-2 p-4 border">
                <h2 className="font-bold">Dynamic Form</h2>

                {fields.map((field: any, i: number) => {
                    if (!field.name) {
                        return (
                            <div key={i} className="text-red-500">
                                Invalid field: missing name
                            </div>
                        )
                    }

                    if (!field.type || (field.type !== "text" && field.type !== "number")) {
                        return (
                            <div key={i} className="text-red-500">
                                Unsupported field type: {field.type}
                            </div>
                        )
                    }

                    return (
                        <input
                            key={i}
                            type={field.type === "number" ? "number" : "text"}
                            placeholder={field.name}
                            value={form[field.name] || ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="border p-2 w-full"
                        />
                    )
                })}

                <button className="bg-blue-500 text-white px-4 py-2">
                    Submit
                </button>
            </form>
        </div>
    )
}