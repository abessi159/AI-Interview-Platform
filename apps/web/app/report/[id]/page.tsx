'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'

const metricConfig = [
  { key: 'correctness', label: 'Correctness', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  { key: 'complexity', label: 'Complexity', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { key: 'codeQuality', label: 'Code Quality', color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
  { key: 'communication', label: 'Communication', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
]

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/session/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setSession(data)
        setIsPublic(data.isPublic)
      })
      .catch(() => setError('Failed to load report'))
      .finally(() => setLoading(false))
  }, [id])

  const togglePrivacy = async () => {
    setToggling(true)
    const res = await fetch(`/api/session/${id}/toggle-privacy`, { method: 'POST' })
    const data = await res.json()
    setIsPublic(data.isPublic)
    setToggling(false)
  }

  const sendEmail = async () => {
    setSending(true)
    await fetch('/api/send-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: id }),
    })
    setSent(true)
    setSending(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadPDF = () => window.print()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e0e' }}>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading report...</p>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e0e' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#f87171', fontSize: 14, marginBottom: 16 }}>
          {error === 'Private' ? 'This report is private.' : 'Report not found.'}
        </p>
        <Link href="/dashboard" style={{ color: '#a3e635', fontSize: 13 }}>← Back to Dashboard</Link>
      </div>
    </div>
  )

  const score = session.scoreData
  const verdictColor =
    score.verdict === 'Hire' ? { bg: 'rgba(52,211,153,0.15)', color: '#34d399', border: 'rgba(52,211,153,0.3)' } :
    score.verdict === 'Consider' ? { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' } :
    { bg: 'rgba(248,113,113,0.15)', color: '#f87171', border: 'rgba(248,113,113,0.3)' }

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
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>
            ← Dashboard
          </Link>
        </nav>

        <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 60px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#a3e635', textTransform: 'uppercase', marginBottom: 8 }}>
                Interview Report
              </p>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 6 }}>
                {session.problemTitle}
              </h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                {session.language} · {session.completedAt ? new Date(session.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </p>
            </div>
            <span style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              background: verdictColor.bg, color: verdictColor.color, border: `1px solid ${verdictColor.border}`,
            }}>
              {score.verdict}
            </span>
          </div>

          {/* Action Bar */}
          {session.isOwner && (
            <div className="no-print" style={{
              display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap',
            }}>
              {/* Privacy toggle */}
              <button
                onClick={togglePrivacy}
                disabled={toggling}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: isPublic ? 'rgba(163,230,53,0.1)' : 'rgba(255,255,255,0.06)',
                  color: isPublic ? '#a3e635' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${isPublic ? 'rgba(163,230,53,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  opacity: toggling ? 0.5 : 1,
                }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  {isPublic
                    ? <><circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="2" fill="currentColor"/></>
                    : <><rect x="2" y="5.5" width="9" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5.5V4a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.2"/></>
                  }
                </svg>
                {isPublic ? 'Public' : 'Private'}
              </button>

              {/* Copy link */}
              <button
                onClick={copyLink}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="4.5" y="1" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M8.5 8v2.5A1.5 1.5 0 017 12H2A1.5 1.5 0 01.5 10.5v-5A1.5 1.5 0 012 4H4.5" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>

              {/* Download PDF */}
              <button
                onClick={downloadPDF}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1v8M3.5 6.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M1 10.5v1A1.5 1.5 0 002.5 13h8a1.5 1.5 0 001.5-1.5v-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Download PDF
              </button>

              {/* Send Email */}
              <button
                onClick={sendEmail}
                disabled={sending || sent}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: sent ? 'default' : 'pointer',
                  background: sent ? 'rgba(52,211,153,0.1)' : '#a3e635',
                  color: sent ? '#34d399' : '#0e0e0e',
                  border: sent ? '1px solid rgba(52,211,153,0.3)' : 'none',
                  opacity: sending ? 0.5 : 1,
                }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1 1l11 5.5L1 12V8l8-1.5L1 5V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
                {sent ? 'Sent!' : sending ? 'Sending...' : 'Send Results'}
              </button>
            </div>
          )}

          {/* Overall Score */}
          <div style={{
            background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '28px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
                Overall Score
              </p>
              <p style={{ fontSize: 60, fontWeight: 800, color: '#fff', lineHeight: 1, margin: 0 }}>
                {score.totalScore}
                <span style={{ fontSize: 24, fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>/100</span>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Language</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0, textTransform: 'capitalize' }}>{session.language}</p>
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {metricConfig.map(m => {
              const val = score[m.key] ?? 0
              const barColor = val >= 70 ? '#34d399' : val >= 50 ? '#fbbf24' : '#f87171'
              return (
                <div key={m.key} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{m.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: m.color, margin: 0 }}>{val}/100</p>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${val}%`, background: barColor, borderRadius: 999 }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '22px 24px', marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>Summary</p>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{score.summary}</p>
          </div>

          {/* Strengths + Improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '22px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(52,211,153,0.7)', marginBottom: 14 }}>Strengths</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {score.strengths?.map((s: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                    <span style={{ color: '#34d399', flexShrink: 0 }}>✓</span>{s}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '22px 24px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(251,191,36,0.7)', marginBottom: 14 }}>To Improve</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {score.improvements?.map((s: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                    <span style={{ color: '#fbbf24', flexShrink: 0 }}>→</span>{s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code */}
          <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '22px 24px', marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
              Submitted Code · <span style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.25)' }}>{session.language}</span>
            </p>
            <pre style={{
              margin: 0, overflowX: 'auto',
              fontSize: 12, lineHeight: 1.7,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 10, padding: '16px 18px',
            }}>
              <code>{session.code}</code>
            </pre>
          </div>

          {/* Footer actions */}
          <div className="no-print" style={{ display: 'flex', gap: 12 }}>
            <Link href="/dashboard" style={{
              flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
              padding: '14px 24px', borderRadius: 12, textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              ← Back to Dashboard
            </Link>
            <Link href="/interview-mode" style={{
              flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 700,
              background: '#a3e635', color: '#0e0e0e',
              padding: '14px 24px', borderRadius: 12, textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              Try Another Interview →
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}