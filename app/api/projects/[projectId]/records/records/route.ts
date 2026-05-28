import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const records = await prisma.appRecord.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ records })
  } catch (error) {
    console.error('GET records error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await req.json()

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const record = await prisma.appRecord.create({
      data: { projectId, data: body },
    })

    // notify project owner
    const session = await getServerSession()
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })
      if (user) {
        await prisma.notification.create({
          data: {
            userId: project.userId,
            projectId,
            title: 'New Submission',
            message: `A new record was submitted to "${project.name}".`,
          },
        })
      }
    }

    return NextResponse.json({ record }, { status: 201 })
  } catch (error) {
    console.error('POST records error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}