import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json()
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })

  if (!session || session.user.clerkId !== clerkId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const score = session.scoreData ? JSON.parse(session.scoreData) : null
  if (!score) {
    return NextResponse.json({ error: 'No score data' }, { status: 400 })
  }

  const verdictColor =
    score.verdict === 'Hire' ? '#34d399' :
    score.verdict === 'Consider' ? '#fbbf24' : '#f87171'

  const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/report/${sessionId}`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0e0e0e;font-family:Inter,system-ui,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px;">
      <div style="width:28px;height:28px;background:#a3e635;border-radius:6px;display:flex;align-items:center;justify-content:center;">
        <span style="color:#0e0e0e;font-weight:900;font-size:14px;">D</span>
      </div>
      <span style="font-weight:700;font-size:15px;letter-spacing:0.05em;">DevInterview</span>
    </div>

    <p style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#a3e635;text-transform:uppercase;margin-bottom:8px;">Interview Complete</p>
    <h1 style="font-size:28px;font-weight:800;margin:0 0 8px;">Your Results</h1>
    <p style="font-size:13px;color:rgba(255,255,255,0.45);margin:0 0 32px;">
      Problem: <strong style="color:#fff;">${session.problemTitle}</strong>
    </p>

    <div style="background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px 32px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin:0 0 8px;">Overall Score</p>
        <p style="font-size:56px;font-weight:800;margin:0;line-height:1;">${score.totalScore}<span style="font-size:22px;font-weight:400;color:rgba(255,255,255,0.3);">/100</span></p>
      </div>
      <div style="padding:10px 20px;border-radius:8px;background:${verdictColor}22;border:1px solid ${verdictColor}55;color:${verdictColor};font-weight:700;font-size:14px;">
        ${score.verdict}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
      ${[
        { label: 'Correctness', value: score.correctness, color: '#34d399' },
        { label: 'Complexity', value: score.complexity, color: '#fbbf24' },
        { label: 'Code Quality', value: score.codeQuality, color: '#818cf8' },
        { label: 'Communication', value: score.communication, color: '#a78bfa' },
      ].map(m => `
        <div style="background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 18px;">
          <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:0 0 4px;">${m.label}</p>
          <p style="font-size:20px;font-weight:700;color:${m.color};margin:0;">${m.value}<span style="font-size:12px;color:rgba(255,255,255,0.3);">/100</span></p>
        </div>
      `).join('')}
    </div>

    <div style="background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 22px;margin-bottom:20px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:0 0 10px;">Summary</p>
      <p style="font-size:13px;line-height:1.75;color:rgba(255,255,255,0.6);margin:0;">${score.summary}</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:32px;">
      <div style="background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 22px;">
        <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(52,211,153,0.7);margin:0 0 12px;">Strengths</p>
        ${score.strengths?.map((s: string) => `<p style="font-size:12px;color:rgba(255,255,255,0.6);margin:0 0 8px;"><span style="color:#34d399;">✓</span> ${s}</p>`).join('') ?? ''}
      </div>
      <div style="background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 22px;">
        <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(251,191,36,0.7);margin:0 0 12px;">To Improve</p>
        ${score.improvements?.map((s: string) => `<p style="font-size:12px;color:rgba(255,255,255,0.6);margin:0 0 8px;"><span style="color:#fbbf24;">→</span> ${s}</p>`).join('') ?? ''}
      </div>
    </div>

    <a href="${reportUrl}" style="display:block;text-align:center;background:#a3e635;color:#0e0e0e;font-weight:700;font-size:14px;padding:14px 24px;border-radius:12px;text-decoration:none;margin-bottom:32px;">
      View Full Report →
    </a>

    <p style="font-size:12px;color:rgba(255,255,255,0.2);text-align:center;margin:0;">
      Sent by DevInterview · Keep practicing and improving!
    </p>
  </div>
</body>
</html>`

  try {
    await resend.emails.send({
      from: 'DevInterview <results@yourdomain.com>',
      to: session.user.email,
      subject: `Your Interview Results — ${session.problemTitle} (${score.totalScore}/100)`,
      html,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}