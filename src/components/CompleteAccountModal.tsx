"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Loader2, X, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export function CompleteAccountModal({ 
  email, 
  isOpen, 
  onComplete,
  onClose
}: { 
  email: string; 
  isOpen: boolean; 
  onComplete: () => void;
  onClose: () => void;
}) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create the user in Supabase Auth
      let { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      // If already registered, attempt to sign in with this password
      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('already registered') || 
            signUpError.message.toLowerCase().includes('already exists')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            setError("This email is already registered. Please check your password or use the Forgot Password option.");
            setLoading(false);
            return;
          }
          signUpData = signInData;
        } else {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
      }

      // Link the existing profile to this new Supabase ID
      if (signUpData?.user) {
        await supabase.from('profiles').upsert({
          email: email,
          id: signUpData.user.id,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
      }

      onComplete();
    } catch (err: any) {
      console.error("Signup exception:", err);
      setError(
        err.message === 'Failed to fetch' 
          ? 'Network error: Failed to connect to Supabase. If you recently updated your .env.local file, please stop (Ctrl+C) and restart (npm run dev) your Next.js development server.'
          : err.message || 'An unexpected error occurred.'
      );
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setResetting(true);
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/callback?next=/update-password',
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setResetSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <AnimatePresence mode="wait">
            {resetSuccess ? (
              <motion.div 
                key="success-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl text-center z-10"
              >
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Check Your Email</h2>
                <p className="text-zinc-500 text-sm mb-8">
                  We've sent a password reset link to <span className="text-zinc-300 font-bold">{email}</span>. Click the link to secure your account.
                </p>

                <button 
                  onClick={onClose}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all active:scale-[0.98]"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="form-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl z-10"
              >
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Secure Your Account</h2>
                  <p className="text-zinc-500 text-sm">
                    Set a password to log in with <span className="text-zinc-300 font-bold">{email}</span> next time using the email form.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs text-center leading-relaxed">
                    {error}
                  </div>
                )}

                <form onSubmit={handleComplete} className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Choose Password</label>
                      <button 
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={resetting || loading}
                        className="text-xs text-red-500 hover:text-red-400 font-bold tracking-wider hover:underline focus:outline-none transition-colors"
                      >
                        {resetting ? 'Sending...' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-red-600 transition-colors" />
                      <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Complete Signup
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
