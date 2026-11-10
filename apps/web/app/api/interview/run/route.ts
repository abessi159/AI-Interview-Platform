import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { code, language } = await req.json()

  const languageMap: Record<string, { language: string; version: string }> = {
    javascript: { language: 'javascript', version: '18.15.0' },
    typescript: { language: 'typescript', version: '5.0.3' },
    python: { language: 'python', version: '3.10.0' },
  }

  const lang = languageMap[language] ?? languageMap['javascript']

  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: lang.language,
      version: lang.version,
      files: [{ content: code }],
    }),
  })

  const data = await response.json()
  const output = data.run?.output ?? data.run?.stderr ?? 'No output'

  return NextResponse.json({ output })
}