'use client'

import { UserButton } from '@clerk/nextjs'
import { Search, Clock, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const problems = [
  { id: '1', title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays & Hashing', description: 'Given an array of integers, return indices of the two numbers that add up to a target.', time: '15 min', acceptance: '57.8%', companies: ['Google', 'Amazon', 'Microsoft'] },
  { id: '2', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', description: 'Determine if the input string of brackets is valid.', time: '20 min', acceptance: '68.7%', companies: ['Google', 'Amazon'] },
  { id: '3', title: 'Best Time to Buy Stock', difficulty: 'Easy', topic: 'Arrays', description: 'Find the maximum profit from a single buy and sell of stock.', time: '20 min', acceptance: '63.1%', companies: ['Amazon', 'Microsoft'] },
  { id: '4', title: 'Binary Search', difficulty: 'Easy', topic: 'Binary Search', description: 'Search in a sorted array using binary search. Return -1 if not found.', time: '15 min', acceptance: '71.2%', companies: ['Google', 'Meta'] },
  { id: '5', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Sliding Window', description: 'Find the length of the longest substring without repeating characters.', time: '25 min', acceptance: '45.3%', companies: ['Amazon', 'Google', 'Microsoft'] },
  { id: '6', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs / DFS', description: 'Count the number of islands in a 2D binary grid.', time: '30 min', acceptance: '49.2%', companies: ['Amazon', 'Google'] },
  { id: '7', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked Lists', description: 'Merge two sorted linked lists into one sorted list.', time: '20 min', acceptance: '60.2%', companies: ['Amazon', 'Microsoft'] },
  { id: '8', title: 'Max Depth of Binary Tree', difficulty: 'Easy', topic: 'Trees', description: 'Find the maximum depth of a binary tree using recursion.', time: '15 min', acceptance: '72.1%', companies: ['Google', 'Meta'] },
  { id: '9', title: 'Coin Change', difficulty: 'Medium', topic: 'Dynamic Programming', description: 'Find the minimum number of coins needed to make up a target amount.', time: '35 min', acceptance: '38.4%', companies: ['Amazon', 'Google', 'Apple'] },
  { id: '10', title: 'Word Search', difficulty: 'Medium', topic: 'Backtracking', description: 'Find if a word exists in a grid by moving through adjacent cells.', time: '30 min', acceptance: '41.2%', companies: ['Microsoft', 'Amazon'] },
  { id: '11', title: 'Merge Intervals', difficulty: 'Medium', topic: 'Sorting', description: 'Merge all overlapping intervals and return the result.', time: '25 min', acceptance: '43.6%', companies: ['Google', 'Amazon', 'Facebook'] },
  { id: '12', title: 'LRU Cache', difficulty: 'Hard', topic: 'Design', description: 'Design a cache that evicts the least recently used item when full.', time: '45 min', acceptance: '35.6%', companies: ['Google', 'Amazon', 'Microsoft', 'Meta'] },
]

const difficultyClass: Record<string, string> = {
  Easy: 'badge-easy',
  Medium: 'badge-medium',
  Hard: 'badge-hard',
}

const companyColors: Record<string, string> = {
  Google: '#4285f4',
  Amazon: '#ff9900',
  Microsoft: '#00a4ef',
  Meta: '#0668e1',
  Apple: '#555555',
  Facebook: '#1877f2',
}

export default function ProblemsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase()) || p.topic.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'All' || p.difficulty === filter
      return matchesSearch && matchesFilter
    })
  }, [query, filter])

  return (
    <div className="page">

      <header className="nav">
        <div className="nav-left">
          <Link href="/dashboard" className="logo" style={{ color: 'var(--text)' }}>DevInterview</Link>
          <nav className="nav-links">
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/problems" className="nav-link active">Practice</Link>
            <Link href="/interview-mode" className="nav-link">Interview</Link>
          </nav>
        </div>
        <div className="nav-right">
          <UserButton />
        </div>
      </header>

      <main className="container">

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

          {/* Left — problem list */}
          <div style={{ flex: 1, minWidth: 0 }}>

            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '8px' }}>
                Practice Problems
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
                Master technical interviews with carefully selected coding challenges.
              </p>
            </div>

            {/* Search */}
            <div className="search-box" style={{ marginBottom: '16px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }} />
              <input
                className="search-input"
                placeholder="Search problems, topics, companies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Filters */}
            <div className="filters" style={{ marginBottom: '24px' }}>
              {['All', 'Easy', 'Medium', 'Hard'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`filter ${filter === f ? 'active' : ''}`}>
                  {f !== 'All' && (
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '6px',
                      background: f === 'Easy' ? '#16a34a' : f === 'Medium' ? '#d97706' : '#dc2626'
                    }} />
                  )}
                  {f === 'All' ? 'All Problems' : f}
                </button>
              ))}
            </div>

            {/* Problem count */}
            <p style={{ fontSize: '13px', color: 'var(--faint)', marginBottom: '12px' }}>
              {filteredProblems.length} Problems
            </p>

            {/* Problem list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredProblems.map((problem) => (
                <div key={problem.id} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>

                  {/* Difficulty badge */}
                  <span className={difficultyClass[problem.difficulty]} style={{ flexShrink: 0, minWidth: '64px', textAlign: 'center' }}>
                    {problem.difficulty}
                  </span>

                  {/* Problem info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '11px', color: 'var(--faint)', marginBottom: '4px' }}>{problem.topic}</p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>{problem.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: '1.5' }}>{problem.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--faint)' }}>
                        <Clock size={12} /> {problem.time}
                      </span>
                      {problem.companies.map((c) => (
                        <span key={c} style={{ width: '16px', height: '16px', borderRadius: '3px', background: companyColors[c] ?? '#888', display: 'inline-block', opacity: 0.8 }} title={c} />
                      ))}
                    </div>
                  </div>

                  {/* Acceptance + action */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50',
                        background: parseFloat(problem.acceptance) >= 60 ? '#16a34a' : parseFloat(problem.acceptance) >= 45 ? '#d97706' : '#dc2626',
                        display: 'inline-block'
                      }} />
                      <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{problem.acceptance}</span>
                      <span style={{ fontSize: '11px', color: 'var(--faint)' }}>Acceptance</span>
                      <Bookmark size={14} style={{ color: 'var(--faint)', cursor: 'pointer', marginLeft: '4px' }} />
                    </div>
                    <Link href={`/interview/${problem.id}`} className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>
  Start Practice →
</Link>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '100px' }}>

            {/* Progress */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>Your Progress</p>
                <span style={{ fontSize: '11px', color: 'var(--accent)', cursor: 'pointer' }}>View all</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '6px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text)' }}>0%</span>
                  <span style={{ fontSize: '9px', color: 'var(--faint)' }}>Solved</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[{ label: 'Solved', value: '0' }, { label: 'Attempted', value: '0' }].map((s) => (
                  <div key={s.label}>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>{s.value}</p>
                    <p style={{ fontSize: '11px', color: 'var(--faint)' }}>{s.label}</p>
                  </div>
                ))}
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
              ].map((t) => (
                <div key={t.topic} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text)' }}>{t.topic}</span>
                  <span style={{ fontSize: '12px', color: 'var(--faint)' }}>{t.count} problems</span>
                </div>
              ))}
            </div>

            {/* Companies */}
            <div className="card" style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '14px' }}>Companies</p>
              {[
                { name: 'Google', count: 6 },
                { name: 'Amazon', count: 8 },
                { name: 'Microsoft', count: 5 },
                { name: 'Meta', count: 3 },
                { name: 'Apple', count: 2 },
              ].map((c) => (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: companyColors[c.name], display: 'inline-block' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--faint)' }}>{c.count} problems</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}