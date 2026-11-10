'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserButton, SignInButton, SignUpButton, useUser, SignOutButton } from '@clerk/nextjs'

export default function SideMenu() {
  const [open, setOpen] = useState(false)
  const { isSignedIn } = useUser()

  return (
    <>
      {/* Hamburger button */}
      <button
  onClick={() => setOpen(true)}
  className="fixed top-5 right-6 z-[9999] flex flex-col gap-1.5 p-2 group bg-white/5 rounded-lg border border-white/10"
  aria-label="Open menu"
>
        <span className="w-6 h-0.5 bg-white/70 group-hover:bg-white transition-colors" />
        <span className="w-6 h-0.5 bg-white/70 group-hover:bg-white transition-colors" />
        <span className="w-6 h-0.5 bg-white/70 group-hover:bg-white transition-colors" />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#0c0c0c] border-l border-white/8 z-50
          flex flex-col px-6 py-8 transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-10">
          <span className="text-sm font-bold tracking-widest uppercase">DevInterview</span>
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          <Link href="/" onClick={() => setOpen(false)} className="text-sm text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-colors">
            Home
          </Link>
          {isSignedIn && (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-colors">
                Dashboard
              </Link>
              <Link href="/problems" onClick={() => setOpen(false)} className="text-sm text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-colors">
                Problems
              </Link>
            </>
          )}
          <Link href="/about" onClick={() => setOpen(false)} className="text-sm text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-colors">
            About Us
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {isSignedIn ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <UserButton />
                <span className="text-xs text-white/40">Account</span>
              </div>
              <SignOutButton>
                <button className="text-sm text-left text-red-400/80 hover:text-red-400 hover:bg-red-400/5 px-3 py-2.5 rounded-lg transition-colors">
                  Log Out
                </button>
              </SignOutButton>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-left text-white/70 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-colors">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-semibold bg-white text-black px-3 py-2.5 rounded-lg hover:bg-white/90 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </>
  )
}