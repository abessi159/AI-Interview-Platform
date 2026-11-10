'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const roles = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Data Scientist', 'DevOps Engineer']
const levels = ['Junior', 'Mid-level', 'Senior', 'Staff']

export default function InterviewModeSetupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    if (!name || !role || !level) return
    setLoading(true)
    try {
      const res = await fetch('/api/interview-mode/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, level }),
      })
      const data = await res.json()
      router.push(`/interview-mode/${data.problemId}?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&level=${encodeURIComponent(level)}`)
    } catch {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="page">

      <header className="nav">
        <div className="nav-left">
          <Link href="/dashboard" className="logo">DevInterview</Link>
          <nav className="nav-links">
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/problems" className="nav-link">Practice</Link>
            <Link href="/interview-mode" className="nav-link active">Interview</Link>
          </nav>
        </div>
      </header>

      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '60px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(239,68,68,0.7)', marginBottom: '12px' }}>
              Real Interview Mode
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Ready to interview?
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.7' }}>
              Fill in your details. The AI will assign you a problem based on your role and level, then conduct a real interview — camera on, timer running.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Name */}
            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Role */}
            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                Role Applying For
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className="filter"
                    style={{
                      textAlign: 'left',
                      background: role === r ? 'rgba(124,140,255,0.12)' : undefined,
                      borderColor: role === r ? 'rgba(124,140,255,0.3)' : undefined,
                      color: role === r ? 'var(--accent)' : undefined,
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                Experience Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className="filter"
                    style={{
                      textAlign: 'center',
                      background: level === l ? 'rgba(124,140,255,0.12)' : undefined,
                      borderColor: level === l ? 'rgba(124,140,255,0.3)' : undefined,
                      color: level === l ? 'var(--accent)' : undefined,
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--faint)', marginBottom: '4px' }}>
                Interview Rules
              </p>
              {[
                'Camera and microphone will be active throughout',
                'You have 45 minutes to complete the interview',
                'The AI will speak and ask follow-up questions',
                'Do not leave the tab — 3 warnings will auto-submit',
                'Fullscreen mode will be enabled',
              ].map((rule, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--faint)', flexShrink: 0 }}>·</span>
                  {rule}
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleStart}
              disabled={!name || !role || !level || loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '14px',
                opacity: (!name || !role || !level || loading) ? 0.3 : 1,
                cursor: (!name || !role || !level || loading) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Setting up your interview...' : 'Begin Interview →'}
            </button>

          </div>
        </div>
      </main>
    </div>
  )
}