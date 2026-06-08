"use client";

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exchangeAttempted = useRef(false);

  useEffect(() => {
    if (exchangeAttempted.current) return;
    exchangeAttempted.current = true;

    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';
    const errorParam = searchParams.get('error') || searchParams.get('error_description');

    async function handleExchange() {
      const supabase = createClient();

      // 1. Check for error parameters in query string
      if (errorParam) {
        console.error("Auth callback received error query parameter:", errorParam);
        router.push('/auth/auth-code-error');
        return;
      }

      // 2. Handle Implicit Flow (hash parameters: #access_token=...&refresh_token=...)
      if (typeof window !== 'undefined' && (window.location.hash.includes('access_token') || window.location.hash.includes('refresh_token'))) {
        console.log("Auth callback: Implicit flow hash detected.");
        // Double-check if session is already parsed and established
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push(next);
          return;
        }

        // Poll for up to 3 seconds for client-side hash parsing to complete
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          const { data: { session: activeSession } } = await supabase.auth.getSession();
          if (activeSession) {
            clearInterval(interval);
            router.push(next);
          } else if (attempts >= 15) {
            clearInterval(interval);
            console.error("Auth callback: Implicit flow session polling timed out.");
            router.push('/auth/auth-code-error');
          }
        }, 200);
        return;
      }

      // 3. Handle PKCE Flow (query parameters: ?code=...)
      if (code) {
        console.log("Auth callback: PKCE flow code detected.");
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            router.push(next);
            return;
          } else {
            console.error("Auth callback PKCE code exchange error:", error);
            if (error.message.toLowerCase().includes('verifier') || error.name?.includes('Verifier') || error.message.toLowerCase().includes('storage')) {
              router.push('/auth/auth-code-error?error=pkce_missing');
              return;
            }
          }
        } catch (err: any) {
          console.error("Auth callback PKCE exception caught:", err);
          router.push('/auth/auth-code-error?error=pkce_missing');
          return;
        }
      } else {
        console.warn("Auth callback: No code or hash parameters found.");
        
        // Final fallback check: if there is ALREADY an active session, let them proceed
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            router.push(next);
            return;
          }
        } catch (e) {
          console.error("Session fallback exception:", e);
        }
      }

      router.push('/auth/auth-code-error');
    }

    handleExchange();
  }, [searchParams, router]);

  return (
    <div className="text-center relative z-10 flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      <p className="text-zinc-500 text-sm font-medium tracking-wide">Securing your session...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-red-900/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-zinc-900/20 blur-[120px] rounded-full" />
      </div>
      
      <Suspense fallback={
        <div className="text-center relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          <p className="text-zinc-500 text-sm font-medium tracking-wide">Loading callback...</p>
        </div>
      }>
        <CallbackHandler />
      </Suspense>
    </main>
  );
}
