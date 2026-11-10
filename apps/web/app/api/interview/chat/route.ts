import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  const { message, code, problem, history } = await req.json()

  const systemPrompt = `You are a professional technical interviewer conducting a coding interview. 
The candidate is solving "${problem}".
Their current code is:
\`\`\`
${code}
\`\`\`

Your role:
- Ask clarifying questions about their approach
- Give hints if they are stuck but never give the full answer
- Challenge their time and space complexity reasoning
- Be encouraging but professional
- Keep responses concise and focused (2-4 sentences max)`

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.map((m: { role: string; content: string }) => ({
      role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.content,
    })),
    { role: 'user' as const, content: message },
  ]

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 1024,
  })

  const reply = response.choices[0]?.message?.content ?? ''

  return NextResponse.json({ reply })
}