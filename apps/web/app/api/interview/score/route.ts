import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  const { code, language, problem, problemId, history } = await req.json()

  const prompt = `You are a senior software engineer evaluating a technical interview.

Problem: "${problem}"
Language: ${language}
Candidate's code:
\`\`\`${language}
${code}
\`\`\`

Interview conversation:
${history.map((m: { role: string; content: string }) => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n')}

Evaluate the candidate and respond ONLY with a valid JSON object in this exact format, no extra text:
{
  "totalScore": <number 0-100>,
  "correctness": <number 0-100>,
  "complexity": <number 0-100>,
  "codeQuality": <number 0-100>,
  "communication": <number 0-100>,
  "verdict": "<Hire | Consider | No Hire>",
  "summary": "<2-3 sentence overall summary>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  })

  const text = response.choices[0]?.message?.content ?? '{}'

  let result: any
  try {
    result = JSON.parse(text)
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0])
    } else {
      return NextResponse.json({ error: 'Failed to parse score' }, { status: 500 })
    }
  }

  // Save to DB
  try {
    const { userId: clerkId } = await auth()
    console.log('clerkId:', clerkId)

    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } })
      console.log('user found:', JSON.stringify(user))

      if (user) {
        let dbProblemId = problemId
        if (!dbProblemId) {
          const dbProblem = await prisma.problem.findFirst()
          dbProblemId = dbProblem?.id
        }
        console.log('dbProblemId:', dbProblemId)

        if (dbProblemId) {
          const session = await prisma.session.create({
            data: {
              userId: user.id,
              problemId: dbProblemId,
              problemTitle: problem,
              code,
              language,
              score: result.totalScore,
              scoreData: JSON.stringify(result),
              completedAt: new Date(),
            },
          })
          return NextResponse.json({ ...result, sessionId: session.id })
        }
      }
    }
  } catch (err) {
    console.error('Failed to save session:', err)
  }

  return NextResponse.json(result)
}