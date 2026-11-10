'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useState } from 'react'

const metricConfig = [
  {
    key: 'correctness',
    label: 'Correctness',
    description: 'Solution produces the correct output',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="#34d399" strokeWidth="1.5" />
        <path d="M6 10l3 3 5-5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    iconBg: 'rgba(52,211,153,0.1)',
  },
  {
    key: 'complexity',
    label: 'Complexity',
    description: 'Efficiency and optimal approach',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="12" width="3" height="5" rx="1" fill="#fbbf24" />
        <rect x="8.5" y="8" width="3" height="9" rx="1" fill="#fbbf24" />
        <rect x="14" y="4" width="3" height="13" rx="1" fill="#fbbf24" />
      </svg>
    ),
    iconBg: 'rgba(251,191,36,0.1)',
  },
  {
    key: 'codeQuality',
    label: 'Code Quality',
    description: 'Clean, readable and maintainable code',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7 7l-4 3 4 3M13 7l4 3-4 3M11 5l-2 10" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    iconBg: 'rgba(129,140,248,0.1)',
  },
  {
    key: 'communication',
    label: 'Communication',
    description: 'Thought process and explanations',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 4h12a1 1 0 011 1v7a1 1 0 01-1 1H8l-4 3V5a1 1 0 011-1z" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    iconBg: 'rgba(167,139,250,0.1)',
  },
]

function ScoreCircle({ value }: { value: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = value >= 70 ? '#34d399' : value >= 50 ? '#fbbf24' : '#f87171'

  return (
    <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
      <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}%</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>Score</span>
      </div>
    </div>
  )
}

function ScoreContent() {
  const params = useSearchParams()
  const raw = params.get('data')
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  if (!raw) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e0e', color: '#fff' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>No score data found.</p>
      </div>
    )
  }

  const score = JSON.parse(decodeURIComponent(raw))

  const verdictColor =
    score.verdict === 'Hire' ? { bg: 'rgba(52,211,153,0.15)', color: '#34d399', border: 'rgba(52,211,153,0.3)' } :
    score.verdict === 'Consider' ? { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' } :
    { bg: 'rgba(248,113,113,0.15)', color: '#f87171', border: 'rgba(248,113,113,0.3)' }

  const scoreMotive =
    score.totalScore >= 70 ? 'Great performance! Keep it up.' :
    score.totalScore >= 50 ? 'Good effort. Room to improve.' :
    "Keep practicing! You'll improve with time."

  const metrics = metricConfig.map(m => ({
    ...m,
    value: score[m.key] ?? 0,
  }))

  const handleCopyLink = () => {
    const url = score.sessionId
      ? `${window.location.origin}/report/${score.sessionId}`
      : window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = async () => {
    if (!score.sessionId) return
    setSending(true)
    await fetch('/api/send-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: score.sessionId }),
    })
    setSent(true)
    setSending(false)
  }

  const handleDownloadPDF = () => window.print()

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Practice', href: '/problems' },
    { label: 'Interview', href: '/interview-mode' },
    { label: 'Progress', href: '/progress' },
    { label: 'Analytics', href: '/analytics' },
  ]

  const actionBtn = (onClick: () => void, label: string, disabled = false, active = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        background: active ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.06)',
        color: active ? '#34d399' : 'rgba(255,255,255,0.5)',
        border: `1px solid ${active ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
        opacity: disabled && !active ? 0.5 : 1,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #0e0e0e !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0e0e0e', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* Nav */}
        <nav className="no-print" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#a3e635', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1l1.8 3.6L13 5.6l-3 2.9.7 4.1L7 10.5l-3.7 2.1.7-4.1-3-2.9 4.2-.7z" fill="#0e0e0e" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.05em' }}>DevInterview</span>
          </div>
          <div style={{ display: 'flex', gap: 28, fontSize: 13 }}>
            {navLinks.map(item => (
              <Link key={item.label} href={item.href} style={{
                textDecoration: 'none',
                color: item.label === 'Interview' ? '#a3e635' : 'rgba(255,255,255,0.5)',
                borderBottom: item.label === 'Interview' ? '2px solid #a3e635' : 'none',
                paddingBottom: item.label === 'Interview' ? 2 : 0,
              }}>
                {item.label}
              </Link>
            ))}
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
            UD
          </div>
        </nav>

        <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 60px' }}>

          {/* Back */}
          <Link href="/dashboard" className="no-print" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 13, textDecoration: 'none', marginBottom: 28 }}>
            ← Back to Dashboard
          </Link>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#a3e635', textTransform: 'uppercase', marginBottom: 8 }}>
                Interview Complete
              </p>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 8 }}>Your Results</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                Here's how you performed in this technical interview.<br />
                Review your results and suggested improvements.
              </p>
            </div>
            <span style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              background: verdictColor.bg, color: verdictColor.color, border: `1px solid ${verdictColor.border}`,
              letterSpacing: '0.04em',
            }}>
              {score.verdict}
            </span>
          </div>

          {/* Action Bar */}
          <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            {actionBtn(handleCopyLink, copied ? '✓ Link Copied!' : '🔗 Share Link', false, copied)}
            {actionBtn(handleDownloadPDF, '⬇ Download PDF')}
            {score.sessionId && actionBtn(
              handleSendEmail,
              sent ? '✓ Email Sent!' : sending ? 'Sending...' : '✉ Send to Email',
              sending,
              sent
            )}
            {score.sessionId && (
              <Link href={`/report/${score.sessionId}`} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: '#a3e635', color: '#0e0e0e', textDecoration: 'none',
                border: 'none',
              }}>
                View Full Report →
              </Link>
            )}
          </div>

          {/* Overall Score Card */}
          <div style={{
            background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '28px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20,
          }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
                Overall Score
              </p>
              <p style={{ fontSize: 60, fontWeight: 800, color: '#fff', lineHeight: 1, margin: 0 }}>
                {score.totalScore}
                <span style={{ fontSize: 24, fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>/100</span>
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>{scoreMotive}</p>
            </div>
            <ScoreCircle value={score.totalScore} />
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            {metrics.map((m) => {
              const barColor = m.value >= 70 ? '#34d399' : m.value >= 50 ? '#fbbf24' : '#f87171'
              return (
                <div key={m.key} style={{
                  background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '20px 22px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: m.iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {m.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                          {m.label}
                        </p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>{m.value}/100</p>
                      </div>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0' }}>{m.description}</p>
                    </div>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${m.value}%`, background: barColor, borderRadius: 999, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div style={{
            background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '22px 24px', marginBottom: 20,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
              Summary
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{score.summary}</p>
          </div>

          {/* Strengths + Improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36 }}>
            <div style={{
              background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '22px 24px',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(52,211,153,0.7)', marginBottom: 14 }}>
                Strengths
              </p>
              {score.strengths && score.strengths.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {score.strengths.map((s: string, i: number) => (
                    <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                      <span style={{ color: '#34d399', flexShrink: 0, marginTop: 1 }}>✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Not enough data to evaluate strengths.</p>
                </div>
              )}
            </div>

            <div style={{
              background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '22px 24px',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(251,191,36,0.7)', marginBottom: 14 }}>
                To Improve
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {score.improvements?.map((s: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                    <span style={{ color: '#fbbf24', flexShrink: 0, marginTop: 1 }}>→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="no-print" style={{ display: 'flex', gap: 14 }}>
            <Link href="/dashboard" style={{
              flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
              padding: '14px 24px', borderRadius: 12, textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              ← Back to Dashboard
            </Link>
            <Link href="/interview-mode" style={{
              flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 700,
              background: '#a3e635', color: '#0e0e0e',
              padding: '14px 24px', borderRadius: 12, textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              Try Another Interview →
            </Link>
          </div>

        </main>
      </div>
    </>
  )
}

export default function InterviewModeScorePage() {
  return (
    <Suspense>
      <ScoreContent />
    </Suspense>
  )
}