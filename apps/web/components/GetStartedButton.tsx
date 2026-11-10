'use client'

import { SignUpButton } from '@clerk/nextjs'

export default function GetStartedButton() {
  return (
    <SignUpButton mode="modal">
      <button className="text-sm font-semibold bg-white text-black px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">
        Get Started Free →
      </button>
    </SignUpButton>
  )
}