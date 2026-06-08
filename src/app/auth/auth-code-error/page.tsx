"use client";

import { AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorCardContent() {
  const searchParams = useSearchParams();
  const isPkceMissing = searchParams.get('error') === 'pkce_missing';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-[3rem] p-10 shadow-2xl text-center"
    >
      <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        {isPkceMissing ? (
          <ShieldAlert className="w-8 h-8 text-red-600" />
        ) : (
          <AlertCircle className="w-8 h-8 text-red-600" />
        )}
      </div>
      
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
        {isPkceMissing ? (
          <>Browser <span className="text-red-600">Mismatch</span></>
        ) : (
          <>Link <span className="text-red-600">Expired</span></>
        )}
      </h1>
      
      <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
        {isPkceMissing ? (
          "Security verifier not found. This occurs if you requested the password reset link in one browser (e.g. Chrome) but clicked the email link in a different browser/private window. Please copy the link from your email and paste it directly into the browser window where you clicked 'Forgot Password'."
        ) : (
          "The password reset link is invalid, expired, or has already been used. Supabase recovery links are single-use only for security."
        )}
      </p>

      <div className="space-y-4">
        <Link
          href="/signin"
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-3 text-xs"
        >
          Get New Link
        </Link>

        <Link
          href="/"
          className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs border border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-red-900/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-zinc-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Suspense fallback={
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-[3rem] p-10 shadow-2xl text-center flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-t-2 border-red-600 rounded-full animate-spin" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Verifying error status...</p>
          </div>
        }>
          <ErrorCardContent />
        </Suspense>
      </div>
    </main>
  );
}
