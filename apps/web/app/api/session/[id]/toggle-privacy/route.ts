import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!session || session.user.clerkId !== clerkId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.session.update({
    where: { id },
    data: { isPublic: !session.isPublic },
  })

  return NextResponse.json({ isPublic: updated.isPublic })
}