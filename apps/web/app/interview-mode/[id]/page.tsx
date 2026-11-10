'use client'

import { useState, use, useEffect, useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'
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
    description: 'You are given an array prices where prices[i] is the price of a stock on day i. Find the maximum profit you can achieve from a single buy and sell.',
    starterCode: {
      javascript: `function maxProfit(prices) {\n  // your code here\n}`,
      python: `def max_profit(prices):\n    # your code here\n    pass`,
      typescript: `function maxProfit(prices: number[]): number {\n  // your code here\n}`,
    },
  },
  '4': {
    title: 'Binary Search',
    difficulty: 'Easy',
    description: 'Given a sorted array of integers and a target value, return the index of the target if it exists, otherwise return -1.',
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
    description: 'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
    starterCode: {
      javascript: `function numIslands(grid) {\n  // your code here\n}`,
      python: `def num_islands(grid):\n    # your code here\n    pass`,
      typescript: `function numIslands(grid: string[][]): number {\n  // your code here\n}`,
    },
  },
  '7': {
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    description: 'You are given the heads of two sorted linked lists. Merge them into one sorted linked list and return its head.',
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
    description: 'Given an integer array coins and an integer amount, return the fewest number of coins needed to make up that amount.',
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // your code here\n}`,
      python: `def coin_change(coins, amount):\n    # your code here\n    pass`,
      typescript: `function coinChange(coins: number[], amount: number): number {\n  // your code here\n}`,
    },
  },
  '10': {
    title: 'Word Search',
    difficulty: 'Medium',
    description: 'Given an m x n grid of characters and a string word, return true if word exists in the grid.',
    starterCode: {
      javascript: `function exist(board, word) {\n  // your code here\n}`,
      python: `def exist(board, word):\n    # your code here\n    pass`,
      typescript: `function exist(board: string[][], word: string): boolean {\n  // your code here\n}`,
    },
  },
  '11': {
    title: 'Merge Intervals',
    difficulty: 'Medium',
    description: 'Given an array of intervals, merge all overlapping intervals and return the result.',
    starterCode: {
      javascript: `function merge(intervals) {\n  // your code here\n}`,
      python: `def merge(intervals):\n    # your code here\n    pass`,
      typescript: `function merge(intervals: number[][]): number[][] {\n  // your code here\n}`,
    },
  },
  '12': {
    title: 'LRU Cache',
    difficulty: 'Hard',
    description: 'Design a data structure that follows the LRU cache policy, supporting O(1) get and put operations.',
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    // your code here\n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        pass`,
      typescript: `class LRUCache {\n  constructor(capacity: number) {\n    // your code here\n  }\n}`,
    },
  },
}

const languages = ['javascript', 'python', 'typescript']
const INTERVIEW_DURATION = 45 * 60

type Message = { role: 'ai' | 'user'; content: string }

export default function InterviewModePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const problem = problems[resolvedParams.id] ?? problems['1']
  const router = useRouter()

  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(problem.starterCode['javascript'])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_DURATION)
  const [started, setStarted] = useState(false)
  const [tabWarnings, setTabWarnings] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [inputText, setInputText] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const cameraStreamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<Message[]>([])
  const codeRef = useRef(code)
  const loadingRef = useRef(false)

  useEffect(() => { messagesRef.current = messages }, [messages])
  useEffect(() => { codeRef.current = code }, [code])
  useEffect(() => { loadingRef.current = loading }, [loading])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!started) return
    if (timeLeft <= 0) { handleSubmit(); return }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [started, timeLeft])

  useEffect(() => {
    if (!started) return
    const handleVisibility = () => {
      if (document.hidden) {
        setTabWarnings((w) => {
          const newW = w + 1
          if (newW >= 3) {
            alert('You have left the tab too many times. The interview will now be submitted.')
            handleSubmit()
          } else {
            alert(`Warning ${newW}/3: Please stay on this tab during the interview.`)
          }
          return newW
        })
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [started])

  useEffect(() => {
    return () => { cameraStreamRef.current?.getTracks().forEach((t) => t.stop()) }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      cameraStreamRef.current = stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      }, 500)
    } catch {
      setCameraError(true)
    }
  }

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')
    )
    if (preferred) utterance.voice = preferred
    utterance.rate = 0.95
    utterance.pitch = 1.0
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [])

  const sendMessageDirect = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || loadingRef.current) return
    const currentMessages = messagesRef.current
    const currentCode = codeRef.current
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    loadingRef.current = true
    try {
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          code: currentCode,
          problem: problem.title,
          history: currentMessages,
          mode: 'real',
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'ai', content: data.reply }])
      speak(data.reply)
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Something went wrong.' }])
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [problem.title, speak])

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported. Please use Chrome.')
      return
    }
    if (recognitionRef.current) recognitionRef.current.stop()
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (e: any) => {
      let finalTranscript = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript
        }
      }
      if (finalTranscript.trim()) {
        setInputText(finalTranscript.trim())
        sendMessageDirect(finalTranscript.trim())
        recognition.stop()
      }
    }
    recognition.onerror = (e: any) => {
      console.error('Speech recognition error:', e.error)
      setIsListening(false)
    }
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }, [sendMessageDirect])

  const startInterview = async () => {
    await startCamera()
    document.documentElement.requestFullscreen?.()
    setStarted(true)
    const opening = `Hello! Welcome to your technical interview. Today you will be solving "${problem.title}", a ${problem.difficulty} level problem. Please read the problem carefully and feel free to think out loud as you code. I will be asking you questions throughout. Let us begin — can you start by explaining your initial approach?`
    setMessages([{ role: 'ai', content: opening }])
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => speak(opening)
    } else {
      speak(opening)
    }
  }

  const handleSubmit = async () => {
  if (submitting) return
  setSubmitting(true)
  window.speechSynthesis?.cancel()
  cameraStreamRef.current?.getTracks().forEach((t) => t.stop())
  try { await document.exitFullscreen?.() } catch {}
  try {
    const res = await fetch('/api/interview/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: codeRef.current,
        language,
        problem: problem.title,
        problemId: resolvedParams.id,
        history: messagesRef.current,
      }),
    })
    const data = await res.json()
    console.log('Score API response:', data)
    const encoded = encodeURIComponent(JSON.stringify(data))
    router.push(`/interview-mode/${resolvedParams.id}/score?data=${encoded}`)
  } catch {
    alert('Failed to submit.')
    setSubmitting(false)
  }
}

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const timerColor = timeLeft < 300 ? 'text-red-400' : timeLeft < 600 ? 'text-amber-400' : 'text-emerald-400'

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="max-w-lg w-full text-center">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--faint)' }}>Real Interview Mode</p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>{problem.title}</h1>
          <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>{problem.difficulty} · 45 minutes</p>
          <div className="card text-left mb-8 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--faint)' }}>Before you begin</p>
            {[
              'Your camera and microphone will be active during the interview',
              'The interview will run in fullscreen — do not exit',
              'Leaving the tab 3 times will auto-submit your interview',
              'The AI interviewer will speak to you and ask follow-up questions',
              'You have 45 minutes to complete the interview',
            ].map((rule, i) => (
              <div key={i} className="flex gap-3 text-sm" style={{ color: 'var(--muted)' }}>
                <span className="shrink-0" style={{ color: 'var(--faint)' }}>·</span>{rule}
              </div>
            ))}
          </div>
          <button
            onClick={startInterview}
            className="interview-btn w-full"
          >
            Start Interview
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <nav className="interview-nav">
        <div className="interview-nav-left">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text)' }}>DevInterview</span>
          <span style={{ color: 'var(--faint)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Real Interview Mode</span>
        </div>
        <div className="interview-nav-right">
          {tabWarnings > 0 && (
            <span className="interview-status interview-status-live" style={{
              background: 'rgba(250,204,21,0.1)',
              color: 'rgba(250,204,21,0.9)',
              border: '1px solid rgba(250,204,21,0.2)'
            }}>
              {tabWarnings}/3 warnings
            </span>
          )}
          {isSpeaking && (
            <span className="interview-status interview-status-speaking">AI Speaking...</span>
          )}
          <span className={`interview-timer ${timerColor}`}>{formatTime(timeLeft)}</span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="interview-btn"
            style={{ opacity: submitting ? '0.4' : '1' }}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden" style={{ borderRight: '1px solid var(--border)' }}>
          <div className="interview-panel">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{problem.title}</h2>
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
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{problem.description}</p>
          </div>

          <div className="interview-panel-header">
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setCode(problem.starterCode[lang] ?? '') }}
                  className="text-xs px-3 py-1 rounded-md transition-colors font-medium capitalize"
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
        </div>

        <div className="w-[380px] flex flex-col shrink-0 overflow-hidden">
          <div className="shrink-0 relative" style={{ height: '180px', background: 'black', borderBottom: '1px solid var(--border)' }}>
            {cameraError ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs" style={{ color: 'var(--faint)' }}>Camera unavailable</p>
              </div>
            ) : (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ opacity: '0.9' }} />
            )}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <span className="interview-status-dot" style={{ background: '#ef4444' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Live</span>
            </div>
          </div>

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
              <div className="flex items-start">
                <div className="interview-bubble interview-bubble-ai">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.3)', animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.3)', animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.3)', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="interview-input-group">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`interview-btn interview-btn-secondary shrink-0`}
              style={{
                background: isListening ? 'rgba(239,68,68,0.2)' : 'var(--card)',
                color: isListening ? 'rgba(239,68,68,0.9)' : 'var(--muted)',
                border: `1px solid ${isListening ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`
              }}
            >
              {isListening ? 'Listening...' : 'Mic'}
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputText.trim()) {
                  sendMessageDirect(inputText.trim())
                  setInputText('')
                }
              }}
              placeholder="Type or use mic..."
              className="interview-input"
            />
            <button
              onClick={() => {
                if (inputText.trim()) {
                  sendMessageDirect(inputText.trim())
                  setInputText('')
                }
              }}
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
