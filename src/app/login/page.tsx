"use client";

import { login } from '@/app/auth/actions'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft, Lock, Mail, AlertCircle, Globe, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CompleteAccountModal } from '@/components/CompleteAccountModal'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)
  const { user, signInWithGoogle, loading: authLoading } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [checkingSupabase, setCheckingSupabase] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (state?.success) {
      window.location.href = '/'
      return
    }

    async function checkSupabaseUser() {
      if (user && !authLoading) {
        setCheckingSupabase(true)
        
        // 1. Check if we already have an active Supabase session
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (supabaseUser) {
          router.push('/')
          setCheckingSupabase(false)
          return
        }

        // 2. Check if user already completed password setup in the past (profile has Supabase UUID)
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();

        const hasSetPassword = profile?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(profile.id);

        if (hasSetPassword) {
          // Already have a password set up, skip modal and go home
          router.push('/')
        } else {
          // First time logging in with Google, prompt to set password
          setShowModal(true)
        }
        setCheckingSupabase(false)
      }
    }
    checkSupabaseUser()
  }, [user, authLoading, router, supabase, state])

  return (
    <>
      <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-red-900/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-zinc-900/20 blur-[120px] rounded-full" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Source</span>
          </Link>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[3rem] p-10 shadow-2xl">
            <div className="text-center mb-10">
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-3 leading-none">
                Welcome <span className="text-red-600">Back</span>
              </h1>
              <p className="text-zinc-500 font-light text-sm">The essence awaits your return.</p>
            </div>

            {/* Google Sign In - Now primary for first-time */}
            <button 
              onClick={signInWithGoogle}
              disabled={authLoading || checkingSupabase}
              className="w-full mb-8 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 border border-zinc-700 active:scale-[0.98] disabled:opacity-50"
            >
              {authLoading || checkingSupabase ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
              <span className="relative px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 bg-[#0c0c0c]">Or Email</span>
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
                  <p className="text-xs text-red-200 leading-relaxed">{state.error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-600 transition-colors" />
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="name@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Password</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-600 transition-colors" />
                  <input 
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
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <CompleteAccountModal 
        email={user?.email || ''} 
        isOpen={showModal} 
        onComplete={() => router.push('/')} 
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
