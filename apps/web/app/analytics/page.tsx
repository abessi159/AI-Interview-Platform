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

type ScoreData = {
  totalScore: number
  correctness: number
  complexity: number
  codeQuality: number
  communication: number
  verdict: string
}

const metrics = [
  { key: 'correctness', label: 'Correctness', color: '#34d399' },
  { key: 'complexity', label: 'Complexity', color: '#fbbf24' },
  { key: 'codeQuality', label: 'Code Quality', color: '#818cf8' },
  { key: 'communication', label: 'Communication', color: '#a78bfa' },
]

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions')
      .then(r => r.json())
      .then(data => setSessions(data.sessions ?? []))
      .finally(() => setLoading(false))
  }, [])

  const parsed: ScoreData[] = sessions
    .map(s => s.scoreData ? JSON.parse(s.scoreData) : null)
    .filter(Boolean)

  const avg = (key: keyof ScoreData) =>
    parsed.length ? Math.round(parsed.reduce((a, s) => a + (s[key] as number), 0) / parsed.length) : 0

  const verdictCounts = parsed.reduce((acc, s) => {
    acc[s.verdict] = (acc[s.verdict] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const total = parsed.length

  const difficultyMap: Record<string, number[]> = {}
  sessions.forEach(s => {
    const sd = s.scoreData ? JSON.parse(s.scoreData) : null
    if (!sd) return
    const title = s.problemTitle
    if (!difficultyMap[title]) difficultyMap[title] = []
    difficultyMap[title].push(sd.totalScore)
  })

  const problemAvgs = Object.entries(difficultyMap).map(([title, scores]) => ({
    title,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    count: scores.length,
  })).sort((a, b) => b.avg - a.avg)

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
              color: item.label === 'Analytics' ? '#a3e635' : 'rgba(255,255,255,0.5)',
              borderBottom: item.label === 'Analytics' ? '2px solid #a3e635' : 'none',
              paddingBottom: item.label === 'Analytics' ? 2 : 0,
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
            Deep Dive
          </p>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 8 }}>Analytics</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Understand your performance patterns across all interviews.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>Loading analytics...</p>
          </div>
        ) : total === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>No data yet — complete some interviews first.</p>
            <Link href="/interview-mode" style={{ fontSize: 13, color: '#a3e635', textDecoration: 'none' }}>Start an interview →</Link>
          </div>
        ) : (
          <>
            {/* Metric Averages */}
            <div style={{
              background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '22px 24px', marginBottom: 16,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                Average Score by Metric
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {metrics.map(m => {
                  const val = avg(m.key as keyof ScoreData)
                  return (
                    <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: 0, width: 110, flexShrink: 0 }}>{m.label}</p>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${val}%`, background: m.color, borderRadius: 999, transition: 'width 0.8s ease' }} />
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: m.color, margin: 0, minWidth: 36, textAlign: 'right' }}>{val}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Verdict Distribution */}
            <div style={{
              background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '22px 24px', marginBottom: 16,
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
                Verdict Distribution
              </p>
              <div style={{ display: 'flex', gap: 14 }}>
                {[
                  { verdict: 'Hire', color: '#34d399' },
                  { verdict: 'Consider', color: '#fbbf24' },
                  { verdict: 'No Hire', color: '#f87171' },
                ].map(v => {
                  const count = verdictCounts[v.verdict] ?? 0
                  const pct = total ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={v.verdict} style={{
                      flex: 1, background: `${v.color}0f`,
                      border: `1px solid ${v.color}2a`,
                      borderRadius: 12, padding: '18px 20px', textAlign: 'center',
                    }}>
                      <p style={{ fontSize: 32, fontWeight: 800, color: v.color, margin: '0 0 4px', lineHeight: 1 }}>{pct}%</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: v.color, margin: '0 0 2px', letterSpacing: '0.08em' }}>{v.verdict}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0 }}>{count} session{count !== 1 ? 's' : ''}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Performance by Problem */}
            <div style={{
              background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, overflow: 'hidden',
            }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  Performance by Problem
                </p>
              </div>
              {problemAvgs.map((p, i) => {
                const color = p.avg >= 70 ? '#34d399' : p.avg >= 50 ? '#fbbf24' : '#f87171'
                return (
                  <div key={p.title} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px',
                    borderBottom: i < problemAvgs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>{p.title}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{p.count} attempt{p.count !== 1 ? 's' : ''}</p>
                    </div>
                    <div style={{ width: 160, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.avg}%`, background: color, borderRadius: 999 }} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color, margin: 0, minWidth: 36, textAlign: 'right' }}>{p.avg}</p>
                  </div>
                )
              })}
            </div>
          </>
        )}

      </main>
    </div>
  )
}