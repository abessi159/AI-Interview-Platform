import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowRight, Zap, Code2, Brain, Trophy, Target } from 'lucide-react'

const steps = [
  { number: '01', title: 'Choose a Problem', description: 'Browse curated interview problems sorted by difficulty and topic.', icon: Target },
  { number: '02', title: 'Code in Real Time', description: 'Solve inside a real coding environment with instant feedback.', icon: Code2 },
  { number: '03', title: 'AI Interviewer', description: 'Get challenged with follow-up questions like a real interviewer.', icon: Brain },
  { number: '04', title: 'Get Scored', description: 'Receive detailed feedback on logic, complexity, and communication.', icon: Trophy },
]

export default async function DashboardPage() {
  const user = await currentUser()
  const firstName = user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? 'there'

  return (
    <div className="page">

      <header className="nav">
        <div className="nav-left">
          <Link href="/dashboard" className="logo" style={{ color: 'var(--text)' }}>DevInterview</Link>
          <nav className="nav-links">
            <Link href="/dashboard" className="nav-link active">Dashboard</Link>
            <Link href="/problems" className="nav-link">Practice</Link>
            <Link href="/interview-mode" className="nav-link">Interview</Link>
          </nav>
        </div>
        <div className="nav-right">
          <span className="user-name">{firstName}</span>
          <UserButton />
        </div>
      </header>

      <main className="container">
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

          {/* Left main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Hero */}
            <section className="hero" style={{ marginBottom: '32px' }}>
              <div className="hero-badge" style={{ color: 'var(--muted)' }}>
                AI-powered interview training
              </div>
              <h1 className="hero-title" style={{ color: 'var(--text)', fontSize: '44px' }}>
                Welcome back, {firstName}.<br />
                <span style={{ color: 'var(--muted)' }}>Ready to practice?</span>
              </h1>
              <p className="hero-desc">
                DevInterview simulates real technical interviews with an AI interviewer. Code, explain, and get scored just like a real company interview.
              </p>
              <div className="hero-actions">
                <Link href="/interview-mode" className="btn-primary">
                  Start Interview <ArrowRight size={16} />
                </Link>
                <Link href="/problems" className="btn-secondary">
                  Browse Problems
                </Link>
              </div>
              <div className="hero-glow" />
            </section>

            {/* Quick action */}
            <div className="card highlight" style={{ marginBottom: '32px' }}>
              <div>
                <h2 style={{ color: 'var(--text)', fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Today's Challenge</h2>
                <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Solve one problem to keep your streak alive.</p>
              </div>
              <Link href="/problems" className="btn-primary small">
                Start Challenge <Zap size={14} />
              </Link>
            </div>

            {/* How it works */}
            <div>
              <h3 className="section-title">How it works</h3>
              <div className="grid-4">
                {steps.map((step) => {
                  const Icon = step.icon
                  return (
                    <div key={step.number} className="card step">
                      <div className="step-icon"><Icon size={18} /></div>
                      <p className="step-number">{step.number}</p>
                      <h4 className="step-title" style={{ color: 'var(--text)' }}>{step.title}</h4>
                      <p className="step-desc">{step.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Right sidebar */}
          <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '100px' }}>

            {/* Progress card */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>Your Progress</p>
                <Link href="/problems" style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '600' }}>View all</Link>
              </div>

              {/* Circular progress */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#c8f135" strokeWidth="10"
                      strokeDasharray="251.2" strokeDashoffset="251.2"
                      strokeLinecap="round" transform="rotate(-90 50 50)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text)' }}>0%</span>
                    <span style={{ fontSize: '10px', color: 'var(--faint)' }}>Solved</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[{ label: 'Solved Problems', value: '0' }, { label: 'Total Attempted', value: '0' }].map((s) => (
                  <div key={s.label}>
                    <p style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text)' }}>{s.value}</p>
                    <p style={{ fontSize: '11px', color: 'var(--faint)' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Difficulty breakdown */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[
                  { label: 'Easy', value: '0/4', color: '#16a34a' },
                  { label: 'Medium', value: '0/6', color: '#d97706' },
                  { label: 'Hard', value: '0/2', color: '#dc2626' },
                ].map((d) => (
                  <div key={d.label} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: d.color, fontWeight: '600', marginBottom: '4px' }}>{d.label}</p>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)' }}>{d.value}</p>
                    <div style={{ width: '48px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', marginTop: '4px' }}>
                      <div style={{ width: '0%', height: '100%', background: d.color, borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem breakdown donut */}
            <div className="card" style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '16px' }}>Problem Breakdown</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#16a34a" strokeWidth="12"
                      strokeDasharray="188.5" strokeDashoffset="94.25"
                      strokeLinecap="butt" transform="rotate(-90 40 40)" />
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#d97706" strokeWidth="12"
                      strokeDasharray="188.5" strokeDashoffset="118.76"
                      strokeLinecap="butt" transform="rotate(90 40 40)" />
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#dc2626" strokeWidth="12"
                      strokeDasharray="188.5" strokeDashoffset="160.23"
                      strokeLinecap="butt" transform="rotate(198 40 40)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text)' }}>12</span>
                    <span style={{ fontSize: '9px', color: 'var(--faint)' }}>Total</span>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Easy', count: '4 (33%)', color: '#16a34a' },
                    { label: 'Medium', count: '6 (50%)', color: '#d97706' },
                    { label: 'Hard', count: '2 (17%)', color: '#dc2626' },
                  ].map((d) => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: 'var(--muted)', flex: 1 }}>{d.label}</span>
                      <span style={{ fontSize: '12px', color: 'var(--faint)' }}>{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending topics */}
            <div className="card" style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '14px' }}>Trending Topics</p>
              {[
                { topic: 'Arrays', count: 3 },
                { topic: 'Dynamic Programming', count: 1 },
                { topic: 'Binary Search', count: 1 },
                { topic: 'Linked Lists', count: 1 },
                { topic: 'Trees', count: 1 },
              ].map((t, i) => (
                <div key={t.topic} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text)' }}>{t.topic}</span>
                  <span style={{ fontSize: '12px', color: 'var(--faint)' }}>{t.count} problems</span>
                </div>
              ))}
              <Link href="/problems" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', display: 'block', marginTop: '12px' }}>
                View all topics
              </Link>
            </div>

            {/* Companies */}
            <div className="card" style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '14px' }}>Companies</p>
              {[
                { name: 'Google', count: 6, color: '#4285f4' },
                { name: 'Amazon', count: 8, color: '#ff9900' },
                { name: 'Microsoft', count: 5, color: '#00a4ef' },
                { name: 'Meta', count: 3, color: '#0668e1' },
                { name: 'Apple', count: 2, color: '#555555' },
              ].map((c, i) => (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: c.color, display: 'inline-block' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--faint)' }}>{c.count} problems</span>
                </div>
              ))}
              <Link href="/problems" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', display: 'block', marginTop: '12px' }}>
                View all companies
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}