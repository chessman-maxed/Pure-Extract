"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from '@/utils/firebase/client';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = React.useMemo(() => createClient(), []);
  const router = useRouter();

  const refreshUser = async () => {
    console.log("AuthContext: Refreshing user state...");
    // Check Supabase first (source of truth for recurring logins)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("AuthContext: Supabase session error:", sessionError);
    }

    if (session?.user) {
      console.log("AuthContext: Found Supabase session for:", session.user.email);
      setUser({
        email: session.user.email,
        displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        photoURL: session.user.user_metadata?.avatar_url,
        uid: session.user.id,
        provider: 'supabase'
      });
      setLoading(false);
      return;
    }

    // Check Firebase fallback
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      console.log("AuthContext: Found Firebase user:", firebaseUser.email);
      setUser({
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid,
        provider: 'firebase'
      });
    } else {
      console.log("AuthContext: No active sessions found.");
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("AuthContext: Initializing listeners...");
    
    // 1. Listen to Supabase Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthContext: Supabase Auth Event:", event);
      if (session) {
        console.log("AuthContext: Supabase session detected via listener.");
        setUser({
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          photoURL: session.user.user_metadata?.avatar_url,
          uid: session.user.id,
          provider: 'supabase'
        });
        setLoading(false);
      } else {
        // If no Supabase session, check Firebase
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          setUser({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            uid: firebaseUser.uid,
            provider: 'firebase'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    });

    // 2. Listen to Firebase Auth Changes
    const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("AuthContext: Firebase Auth state changed.");
      if (firebaseUser) {
        // Only sync to profile if we don't already have a Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // Check if profile already exists in the database
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', firebaseUser.email)
            .maybeSingle();

          // A UUID represents a linked Supabase ID. Do not overwrite it!
          const isSupabaseId = existingProfile?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existingProfile.id);

          await supabase.from('profiles').upsert({
            email: firebaseUser.email,
            full_name: firebaseUser.displayName,
            avatar_url: firebaseUser.photoURL,
            id: isSupabaseId ? existingProfile.id : firebaseUser.uid,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
        }
      }
      refreshUser();
    });

    return () => {
      subscription.unsubscribe();
      unsubscribeFirebase();
    };
  }, [supabase]);

  const signInWithGoogle = async () => {
    try {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobileDevice) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // Silently handle the user closing the popup
        console.log("Sign-in popup closed by user.");
        return;
      }
      console.error("Google Sign-In Error:", error);
    }
  };

  const logout = async () => {
    try {
      // Sign out from both
      await signOut(auth);
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
