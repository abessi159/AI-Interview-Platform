import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return NextResponse.json({ sessions: [] })

  const sessions = await prisma.session.findMany({
    where: { userId: user.id, completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    select: {
      id: true,
      problemTitle: true,
      language: true,
      score: true,
      scoreData: true,
      completedAt: true,
    },
  })

  return NextResponse.json({ sessions })
}