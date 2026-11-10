'use client'

import { useState, use } from 'react'
import Editor from '@monaco-editor/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import '../../styles.css'

const problems: Record<string, { title: string; difficulty: string; description: string; starterCode: Record<string, string> }> = {
  '1': {
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // your code here\n}`,
      python: `def two_sum(nums, target):\n    # your code here\n    pass`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  // your code here\n}`,
    },
  },
  '2': {
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    starterCode: {
      javascript: `function isValid(s) {\n  // your code here\n}`,
      python: `def is_valid(s):\n    # your code here\n    pass`,
      typescript: `function isValid(s: string): boolean {\n  // your code here\n}`,
    },
  },
  '3': {
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    description: 'You are given an array prices. Find the maximum profit from a single buy and sell.',
    starterCode: {
      javascript: `function maxProfit(prices) {\n  // your code here\n}`,
      python: `def max_profit(prices):\n    # your code here\n    pass`,
      typescript: `function maxProfit(prices: number[]): number {\n  // your code here\n}`,
    },
  },
  '4': {
    title: 'Binary Search',
    difficulty: 'Easy',
    description: 'Given a sorted array, return the index of a target value. Return -1 if not found.',
    starterCode: {
      javascript: `function search(nums, target) {\n  // your code here\n}`,
      python: `def search(nums, target):\n    # your code here\n    pass`,
      typescript: `function search(nums: number[], target: number): number {\n  // your code here\n}`,
    },
  },
  '5': {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // your code here\n}`,
      python: `def length_of_longest_substring(s):\n    # your code here\n    pass`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  // your code here\n}`,
    },
  },
  '6': {
    title: 'Number of Islands',
    difficulty: 'Medium',
    description: 'Given an m x n 2D binary grid of 1s (land) and 0s (water), return the number of islands.',
    starterCode: {
      javascript: `function numIslands(grid) {\n  // your code here\n}`,
      python: `def num_islands(grid):\n    # your code here\n    pass`,
      typescript: `function numIslands(grid: string[][]): number {\n  // your code here\n}`,
    },
  },
  '7': {
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    description: 'Merge two sorted linked lists and return the merged list.',
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {\n  // your code here\n}`,
      python: `def merge_two_lists(list1, list2):\n    # your code here\n    pass`,
      typescript: `function mergeTwoLists(list1: any, list2: any): any {\n  // your code here\n}`,
    },
  },
  '8': {
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    description: 'Given the root of a binary tree, return its maximum depth.',
    starterCode: {
      javascript: `function maxDepth(root) {\n  // your code here\n}`,
      python: `def max_depth(root):\n    # your code here\n    pass`,
      typescript: `function maxDepth(root: any): number {\n  // your code here\n}`,
    },
  },
  '9': {
    title: 'Coin Change',
    difficulty: 'Medium',
    description: 'Given coins and an amount, return the fewest number of coins needed to make up that amount.',
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // your code here\n}`,
      python: `def coin_change(coins, amount):\n    # your code here\n    pass`,
      typescript: `function coinChange(coins: number[], amount: number): number {\n  // your code here\n}`,
    },
  },
  '10': {
    title: 'Word Search',
    difficulty: 'Medium',
    description: 'Given a board of characters and a word, return true if the word exists in the grid.',
    starterCode: {
      javascript: `function exist(board, word) {\n  // your code here\n}`,
      python: `def exist(board, word):\n    # your code here\n    pass`,
      typescript: `function exist(board: string[][], word: string): boolean {\n  // your code here\n}`,
    },
  },
  '11': {
    title: 'Merge Intervals',
    difficulty: 'Medium',
    description: 'Given an array of intervals, merge all overlapping intervals.',
    starterCode: {
      javascript: `function merge(intervals) {\n  // your code here\n}`,
      python: `def merge(intervals):\n    # your code here\n    pass`,
      typescript: `function merge(intervals: number[][]): number[][] {\n  // your code here\n}`,
    },
  },
  '12': {
    title: 'LRU Cache',
    difficulty: 'Hard',
    description: 'Design a data structure that follows the LRU cache policy with O(1) get and put.',
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    // your code here\n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        pass`,
      typescript: `class LRUCache {\n  constructor(capacity: number) {\n    // your code here\n  }\n}`,
    },
  },
}

const languages = ['javascript', 'python', 'typescript']

type Message = { role: 'ai' | 'user'; content: string }

export default function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const problem = problems[resolvedParams.id] ?? problems['1']
  const router = useRouter()

  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(problem.starterCode['javascript'])
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: `Hello! I'm your AI interviewer today. We'll be working on "${problem.title}". Take a moment to read the problem, then start coding whenever you're ready. Feel free to think out loud.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    setCode(problem.starterCode[lang] ?? '')
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    try {
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, code, problem: problem.title, history: messages }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'ai', content: data.reply }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [...prev, { role: 'ai', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const runCode = async () => {
    if (running) return
    setRunning(true)
    setOutput(null)
    try {
      const res = await fetch('/api/interview/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })
      const data = await res.json()
      setOutput(data.output)
    } catch {
      setOutput('Error running code.')
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/interview/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, problem: problem.title, history: messages }),
      })
      const data = await res.json()
      const encoded = encodeURIComponent(JSON.stringify(data))
      router.push(`/interview/${resolvedParams.id}/score?data=${encoded}`)
    } catch {
      alert('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <nav className="interview-nav">
        <Link href="/dashboard" className="text-xs" style={{ color: 'var(--faint)' }}>
          ← Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <span className={`interview-status ${
            problem.difficulty === 'Easy' ? 'interview-status-live' :
            problem.difficulty === 'Medium' ? 'interview-status-live' :
            'interview-status-live'
          }`} style={{
            background: problem.difficulty === 'Easy' ? 'rgba(34,197,94,0.1)' :
                        problem.difficulty === 'Medium' ? 'rgba(250,204,21,0.1)' :
                        'rgba(239,68,68,0.1)',
            color: problem.difficulty === 'Easy' ? 'rgba(34,197,94,0.9)' :
                   problem.difficulty === 'Medium' ? 'rgba(250,204,21,0.9)' :
                   'rgba(239,68,68,0.9)',
            border: `1px solid ${problem.difficulty === 'Easy' ? 'rgba(34,197,94,0.2)' :
                               problem.difficulty === 'Medium' ? 'rgba(250,204,21,0.2)' :
                               'rgba(239,68,68,0.2)'}`
          }}>
            {problem.difficulty}
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{problem.title}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="interview-btn"
          style={{ opacity: submitting ? '0.4' : '1' }}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden" style={{ borderRight: '1px solid var(--border)' }}>
          <div className="interview-panel">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{problem.description}</p>
          </div>

          <div className="interview-panel-header">
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`text-xs px-3 py-1 rounded-md transition-colors font-medium capitalize`}
                  style={{
                    background: language === lang ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: language === lang ? 'var(--text)' : 'var(--muted)',
                    border: 'none'
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              onClick={runCode}
              disabled={running}
              className="interview-btn interview-btn-secondary"
              style={{
                color: '#34d399',
                border: '1px solid rgba(52,211,153,0.2)',
                background: 'rgba(52,211,153,0.1)'
              }}
            >
              {running ? 'Running...' : '▶ Run Code'}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(val) => setCode(val ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 16 },
              }}
            />
          </div>

          {output !== null && (
            <div className="interview-panel" style={{ background: 'rgba(0,0,0,0.4)', maxHeight: '128px', overflowY: 'auto' }}>
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Output</p>
              <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: '#34d399' }}>{output}</pre>
            </div>
          )}
        </div>

        <div className="w-[380px] flex flex-col shrink-0 overflow-hidden">
          <div className="interview-panel-header">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>AI Interviewer</p>
          </div>

          <div className="interview-scroll px-5 py-4 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`interview-message ${msg.role === 'user' ? 'interview-message-user' : 'interview-message-ai'}`}>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>{msg.role === 'ai' ? 'Interviewer' : 'You'}</p>
                <div className={`interview-bubble ${msg.role === 'ai' ? 'interview-bubble-ai' : 'interview-bubble-user'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="interview-bubble interview-bubble-ai">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.3)', animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.3)', animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.3)', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="interview-input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask the interviewer something..."
              className="interview-input"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="interview-btn"
              style={{ opacity: loading ? '0.4' : '1' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}