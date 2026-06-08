import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-600/20">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Authentication <span className="text-red-600">Failed</span></h1>
        <p className="text-zinc-500 mb-10">We couldn't verify your credentials. Please check your email and password and try again.</p>
        <Link href="/signin" className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-colors border border-zinc-800 font-bold uppercase tracking-widest text-sm">
          <ArrowLeft className="w-4 h-4" />
          Try Again
        </Link>
      </div>
    </main>
  )
}
