import { NextResponse } from "next/server"

let storedData: any[] = []

export async function GET() {
  return NextResponse.json(storedData)
}

export async function POST(req: Request) {
  const body = await req.json()
  storedData.push(body)
  return NextResponse.json({ success: true })
}