import { currentUser } from '@clerk/nextjs/server'
import { SignUpButton } from '@clerk/nextjs'
import GetStartedButton from '@/components/GetStartedButton'
import Link from 'next/link'

export default async function HomePage() {
  const user = await currentUser()

  return (
    <div className="min-h-screen bg-[#080808] text-white">

     

      <main className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
          Practice interviews.<br />
          <span className="text-white/30">Get better. Get hired.</span>
        </h1>
        <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          DevInterview puts you in a real technical interview with an AI interviewer. Write code, answer follow-ups, get scored — just like the real thing.
        </p>

        {user ? (
          <Link href="/problems" className="inline-block text-sm font-semibold bg-white text-black px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">
            Start Practicing →
          </Link>
        ) : (
          <GetStartedButton />
        )}
      </main>
    </div>
  )
}