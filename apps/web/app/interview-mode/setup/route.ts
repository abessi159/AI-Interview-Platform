import { NextRequest, NextResponse } from 'next/server'

const problemMap: Record<string, string[]> = {
  'Frontend Engineer': ['1', '2', '5'],
  'Backend Engineer': ['1', '6', '9', '11', '12'],
  'Full Stack Engineer': ['1', '2', '5', '6', '9'],
  'Data Scientist': ['4', '9', '11'],
  'DevOps Engineer': ['4', '6', '11'],
}

const levelDifficulty: Record<string, string[]> = {
  'Junior': ['1', '2', '3', '4', '7', '8'],
  'Mid-level': ['1', '2', '5', '6', '9', '10', '11'],
  'Senior': ['5', '6', '9', '10', '11', '12'],
  'Staff': ['9', '10', '11', '12'],
}

export async function POST(req: NextRequest) {
  try {
    const { role, level } = await req.json()

    const rolePools = problemMap[role] ?? ['1', '2', '3', '4', '5']
    const levelPools = levelDifficulty[level] ?? ['1', '2', '3', '4', '5']

    const intersection = rolePools.filter((id) => levelPools.includes(id))
    const pool = intersection.length > 0 ? intersection : rolePools

    const problemId = pool[Math.floor(Math.random() * pool.length)]

    return NextResponse.json({ problemId })
  } catch (err) {
    console.error('Setup error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}