import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split('\n').filter((l) => l.trim())
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV must have a header row and at least one data row' }, { status: 400 })
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''))
    const records = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''))
      if (values.length === 0) continue

      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      records.push(row)
    }

    // bulk insert
    const created = await prisma.$transaction(
      records.map((data) =>
        prisma.appRecord.create({
          data: { projectId, data },
        })
      )
    )

    // notify owner
    await prisma.notification.create({
      data: {
        userId: project.userId,
        projectId,
        title: 'CSV Imported',
        message: `${created.length} records imported into "${project.name}".`,
      },
    })

    return NextResponse.json({
      success: true,
      imported: created.length,
      headers,
    })
  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}