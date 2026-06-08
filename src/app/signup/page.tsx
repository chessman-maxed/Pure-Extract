"use client";

import { signup } from '@/app/auth/actions'
import { ArrowLeft, Lock, Mail, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null)

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium uppercase tracking-widest">Back to Pure</span>
        </Link>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
              Join the <span className="text-red-600">Pure</span>
            </h1>
            <p className="text-zinc-500 font-light">Experience the future of organic extraction.</p>
          </div>

          <AnimatePresence mode="wait">
            {state?.error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200 leading-relaxed">{state.error}</p>
              </motion.div>
            )}
            {state?.success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-200 leading-relaxed">{state.success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-600 transition-colors" />
                <input 
                  id="full_name" 
                  name="full_name" 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-600 transition-colors" />
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-600 transition-colors" />
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm">
              Already a member? {' '}
              <Link href="/signin" className="text-red-500 hover:text-red-400 font-bold underline underline-offset-4 decoration-red-500/30">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
