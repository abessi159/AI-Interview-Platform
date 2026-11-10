import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { userId: clerkId } = await auth()

  const session = await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!session) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const isOwner = clerkId && session.user.clerkId === clerkId

  if (!session.isPublic && !isOwner) {
    return NextResponse.json({ error: 'Private' }, { status: 403 })
  }

  return NextResponse.json({
    id: session.id,
    problemTitle: session.problemTitle,
    code: session.code,
    language: session.language,
    scoreData: session.scoreData ? JSON.parse(session.scoreData) : null,
    isPublic: session.isPublic,
    completedAt: session.completedAt,
    isOwner: !!isOwner,
  })
}