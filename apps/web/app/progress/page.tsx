'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Practice', href: '/problems' },
  { label: 'Interview', href: '/interview-mode' },
  { label: 'Progress', href: '/progress' },
  { label: 'Analytics', href: '/analytics' },
]

type Session = {
  id: string
  problemTitle: string
  language: string
  score: number
  scoreData: string
  completedAt: string
}

function ScoreBar({ value }: { value: number }) {
  const color = value >= 70 ? '#34d399' : value >= 50 ? '#fbbf24' : '#f87171'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function MiniChart({ sessions }: { sessions: Session[] }) {
  if (sessions.length < 2) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Complete more interviews to see your trend</p>
    </div>
  )

  const scores = [...sessions].reverse().map(s => s.score ?? 0)
  const max = 100
  const min = 0
  const w = 780
  const h = 120
  const padX = 10
  const padY = 10
  const points = scores.map((s, i) => {
    const x = padX + (i / (scores.length - 1)) * (w - padX * 2)
    const y = padY + (1 - (s - min) / (max - min)) * (h - padY * 2)
    return `${x},${y}`
  })
  const polyline = points.join(' ')
  const area = `${padX},${h - padY} ${polyline} ${w - padX},${h - padY}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#grad)" />
      <polyline points={polyline} fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {scores.map((s, i) => {
        const [x, y] = points[i].split(',').map(Number)
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#a3e635" />
      })}
    </svg>
  )
}

export default function ProgressPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions')
      .then(r => r.json())
      .then(data => setSessions(data.sessions ?? []))
      .finally(() => setLoading(false))
  }, [])

  const best = sessions.length ? Math.max(...sessions.map(s => s.score ?? 0)) : null
  const worst = sessions.length ? Math.min(...sessions.map(s => s.score ?? 0)) : null
  const avg = sessions.length ? Math.round(sessions.reduce((a, s) => a + (s.score ?? 0), 0) / sessions.length) : null

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e0e', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{
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
              color: item.label === 'Progress' ? '#a3e635' : 'rgba(255,255,255,0.5)',
              borderBottom: item.label === 'Progress' ? '2px solid #a3e635' : 'none',
              paddingBottom: item.label === 'Progress' ? 2 : 0,
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

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#a3e635', textTransform: 'uppercase', marginBottom: 8 }}>
            Your Journey
          </p>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 8 }}>Progress</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Track your improvement across all interviews.
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Total Interviews', value: sessions.length, suffix: '', color: '#a3e635' },
            { label: 'Best Score', value: best ?? '—', suffix: best ? '/100' : '', color: '#34d399' },
            { label: 'Average Score', value: avg ?? '—', suffix: avg ? '/100' : '', color: '#fbbf24' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '20px 22px',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: 36, fontWeight: 800, color: stat.color, margin: 0, lineHeight: 1 }}>
                {stat.value}
                <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>{stat.suffix}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Score Chart */}
        <div style={{
          background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '22px 24px', marginBottom: 20,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
            Score Over Time
          </p>
          <div style={{ height: 120 }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Loading...</p>
              </div>
            ) : (
              <MiniChart sessions={sessions} />
            )}
          </div>
        </div>

        {/* Best & Worst */}
        {sessions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Best Session', score: best, color: '#34d399', session: sessions.find(s => s.score === best) },
              { label: 'Worst Session', score: worst, color: '#f87171', session: sessions.find(s => s.score === worst) },
            ].map(item => (
              <div key={item.label} style={{
                background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '20px 22px',
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
                  {item.label}
                </p>
                {item.session && (
                  <>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{item.session.problemTitle}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '0 0 12px', textTransform: 'capitalize' }}>{item.session.language}</p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: item.color, margin: 0, lineHeight: 1 }}>
                      {item.score}
                      <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>/100</span>
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Session History */}
        <div style={{
          background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Session History
            </p>
          </div>

          {loading ? (
            <div style={{ padding: '40px 22px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', margin: 0 }}>Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: '40px 22px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', margin: 0 }}>No interviews completed yet.</p>
              <Link href="/interview-mode" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#a3e635', textDecoration: 'none' }}>
                Start your first interview →
              </Link>
            </div>
          ) : (
            sessions.map((s, i) => {
              const scoreData = s.scoreData ? JSON.parse(s.scoreData) : null
              const verdictColor =
                scoreData?.verdict === 'Hire' ? '#34d399' :
                scoreData?.verdict === 'Consider' ? '#fbbf24' : '#f87171'
              const scoreColor = (s.score ?? 0) >= 70 ? '#34d399' : (s.score ?? 0) >= 50 ? '#fbbf24' : '#f87171'
              return (
                <Link key={s.id} href={`/report/${s.id}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 22px', textDecoration: 'none',
                  borderBottom: i < sessions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 3px' }}>{s.problemTitle}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0, textTransform: 'capitalize' }}>
                      {s.language} · {s.completedAt ? new Date(s.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {scoreData?.verdict && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: verdictColor, padding: '3px 10px', borderRadius: 6, background: `${verdictColor}18`, border: `1px solid ${verdictColor}33` }}>
                        {scoreData.verdict}
                      </span>
                    )}
                    <span style={{ fontSize: 20, fontWeight: 800, color: scoreColor, minWidth: 44, textAlign: 'right' }}>
                      {s.score ?? '—'}
                    </span>
                  </div>
                </Link>
              )
            })
          )}
        </div>

      </main>
    </div>
  )
}