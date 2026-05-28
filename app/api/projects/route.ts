import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { validateConfig } from '@/lib/validator'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('GET projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json()
    const { name, description, config } = body

    const validation = validateConfig(config)
    if (!validation.valid) {
      return NextResponse.json({ error: 'Invalid config', details: validation.errors }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name: name || validation.sanitized.name,
        description: description || '',
        config: validation.sanitized as object,
        appType: validation.sanitized.appType,
        userId: user.id,
      },
    })

    // create a welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        projectId: project.id,
        title: 'App Created',
        message: `Your app "${project.name}" was created successfully.`,
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('POST projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}