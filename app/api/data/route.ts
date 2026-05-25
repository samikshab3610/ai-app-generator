import { NextResponse } from "next/server"

type DataItem = {
  id: number
  data: any
}

let storedData: DataItem[] = []

// GET all data
export async function GET() {
  return NextResponse.json({
    success: true,
    data: storedData
  })
}

// POST new data
export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "Empty payload" },
        { status: 400 }
      )
    }

    const newItem: DataItem = {
      id: Date.now(),
      data: body
    }

    storedData.push(newItem)

    return NextResponse.json({
      success: true,
      data: newItem
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 500 }
    )
  }
}