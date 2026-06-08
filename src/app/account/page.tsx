"use client";

import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, User, Mail, Shield, Loader2, Check, X, Camera, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function AccountPage() {
  const { user: firebaseUser, loading: firebaseLoading } = useAuth();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(true);
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  // Password update states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Mouse position hooks for 3D card tilt
  const cardX = useMotionValue(175);
  const cardY = useMotionValue(250);

  const rotateX = useTransform(cardY, [0, 500], [12, -12]);
  const rotateY = useTransform(cardX, [0, 350], [-12, 12]);

  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const shineX = useTransform(cardX, [0, 350], ["0%", "100%"]);
  const shineY = useTransform(cardY, [0, 500], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    cardX.set(mouseX);
    cardY.set(mouseY);
  };

  const handleMouseLeave = () => {
    cardX.set(175);
    cardY.set(250);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordSuccess("Password updated successfully!");
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error("Error updating password:", err);
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  useEffect(() => {
    const checkSupabase = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setSupabaseUser(user);
      setSupabaseLoading(false);
    };
    checkSupabase();
  }, [supabase.auth]);

  const loading = firebaseLoading || supabaseLoading;
  const activeUser = firebaseUser || supabaseUser;

  useEffect(() => {
    if (!loading && !activeUser) {
      router.push('/signin');
    }
    
    if (activeUser) {
      fetchProfile();
    }
  }, [activeUser, loading, router]);

  const fetchProfile = async () => {
    const userId = firebaseUser ? firebaseUser.uid : supabaseUser?.id;
    if (!userId) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
      setEditName(data.full_name || '');
    }
  };

  const handleSave = async () => {
    const userId = firebaseUser ? firebaseUser.uid : supabaseUser?.id;
    if (!userId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editName, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
      
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!activeUser) return null;

  // Staggered layout variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden relative pb-24">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -120, 0],
              x: [0, Math.random() * 80 - 40, 0],
              scale: [1, 1.25, 1],
              opacity: [0.08, 0.22, 0.08]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bg-red-600 rounded-full blur-[80px]"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="grain-overlay" />

      {/* Cinematic Static Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 pt-28 md:pt-40 relative z-10">
        
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Back to Gallery</span>
          </Link>
        </motion.div>

        {/* Page Header */}
        <header className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-6 text-luxury"
          >
            Your <br/> <span className="text-red-600">Profile</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-500 text-lg md:text-xl font-light max-w-xl leading-relaxed"
          >
            Managing your connection to the source. Your data, your privacy, your pure experience.
          </motion.p>
        </header>

        {/* Staggered Content Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column - Details & Password */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Account Details */}
            <motion.section 
              variants={cardVariants}
              className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-[3rem] p-10 md:p-12 space-y-10 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Avatar container with dynamic glow */}
                <div className="relative group/avatar shrink-0 select-none">
                  <motion.div 
                    className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-red-600 to-rose-700 opacity-60 blur-md group-hover/avatar:opacity-100 transition-opacity"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                  <div className="relative rounded-full overflow-hidden bg-zinc-950 border border-zinc-800/80 w-24 h-24 shadow-2xl flex items-center justify-center">
                    {activeUser?.photoURL || profile?.avatar_url ? (
                      <img src={activeUser?.photoURL || profile?.avatar_url} alt={profile?.full_name || ''} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-zinc-600" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        key="editing-state"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        className="space-y-2 max-w-sm"
                      >
                        <input 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-zinc-950/80 border border-red-600/40 focus:border-red-600 rounded-xl px-4 py-2.5 text-xl font-bold text-white focus:outline-none transition-all shadow-inner"
                          placeholder="Full Name"
                          autoFocus
                        />
                        <p className="text-red-500 font-mono text-[9px] tracking-[0.2em] font-black">EDITING PROFILE DETAILS</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="viewing-state"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                      >
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
                          {profile?.full_name || activeUser?.displayName || 'Anonymous User'}
                        </h2>
                        <p className="text-zinc-500 font-mono text-[10px] tracking-widest mt-1 uppercase font-bold">
                          ID: {(firebaseUser ? firebaseUser.uid : supabaseUser?.id)?.slice(0, 10)}...
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Email Address</span>
                  </div>
                  <p className="text-white text-base font-light truncate bg-zinc-950/20 border border-zinc-900/80 rounded-xl px-4 py-3 font-mono text-zinc-300">
                    {activeUser?.email}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Security</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs uppercase font-black tracking-wider">Account Secured</span>
                  </div>
                </div>
              </div>

              {/* Edit Details Action */}
              <div className="pt-8 border-t border-zinc-800/60 flex gap-4">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div 
                      key="editing-actions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4 w-full"
                    >
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 bg-white text-black font-black uppercase tracking-widest py-4.5 rounded-2xl hover:bg-zinc-200 transition-colors shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(profile?.full_name || '');
                        }}
                        disabled={isSaving}
                        className="px-6 py-4.5 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button 
                      key="edit-button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={() => setIsEditing(true)}
                      className="px-8 py-4.5 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all shadow-xl active:scale-[0.98] text-xs"
                    >
                      Edit Profile Details
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Change Password (if credentials exist) */}
            {supabaseUser && (
              <motion.section 
                variants={cardVariants}
                className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-[3rem] p-10 md:p-12 space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Update Password</h3>
                  <p className="text-zinc-500 text-sm font-light">
                    Set a new secure password for your email login.
                  </p>
                </div>

                {passwordError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs text-center">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-xs text-center font-bold">
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">New Password</label>
                      <div className="relative group overflow-hidden rounded-xl border border-zinc-800/80">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                        <input 
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-zinc-950/60 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none transition-all text-sm placeholder:text-zinc-700 backdrop-blur-md"
                        />
                        {/* Interactive glow border line */}
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 group-focus-within:w-full transition-all duration-300" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Confirm Password</label>
                      <div className="relative group overflow-hidden rounded-xl border border-zinc-800/80">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                        <input 
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-zinc-950/60 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none transition-all text-sm placeholder:text-zinc-700 backdrop-blur-md"
                        />
                        {/* Interactive glow border line */}
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 group-focus-within:w-full transition-all duration-300" />
                      </div>
                    </div>

                  </div>

                  <button 
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full sm:w-auto px-8 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4.5 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                  >
                    {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                  </button>
                </form>
              </motion.section>
            )}
          </div>

          {/* Right Column - Premium 3D Membership card */}
          <div className="lg:col-span-4 lg:sticky lg:top-40 w-full max-w-md mx-auto lg:max-w-none">
            <motion.div
              variants={cardVariants}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: springX,
                rotateY: springY,
                transformStyle: "preserve-3d",
              }}
              className="relative bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-zinc-800 rounded-[2.5rem] p-10 text-white shadow-2xl hover:border-red-500/30 transition-colors cursor-pointer select-none group/card overflow-hidden"
            >
              {/* Holographic Shine Gradient */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle at var(--shine-x) var(--shine-y), rgba(239, 68, 68, 0.45) 0%, transparent 60%)`,
                  "--shine-x": shineX,
                  "--shine-y": shineY,
                } as any}
              />
              
              {/* Glowing crimson aura behind the pass */}
              <div className="absolute -inset-10 bg-red-600/10 rounded-full blur-[80px] opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none" />
              
              <div style={{ transform: "translateZ(50px)" }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">Membership Pass</h4>
                  <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                  </div>
                </div>
                
                <div>
                  <span className="text-3xl font-black tracking-tight uppercase block group-hover/card:text-red-500 transition-colors">Pure Extract</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mt-1">Official Collective Member</span>
                </div>
                
                <div className="w-full aspect-[1.8/1] bg-zinc-950/80 border border-zinc-900 rounded-3xl flex flex-col justify-between p-6 relative overflow-hidden mt-6 shadow-2xl">
                  {/* Shiny card text */}
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-black italic tracking-tighter text-white opacity-40">PURE</span>
                    <span className="text-[8px] font-bold text-zinc-600 tracking-widest uppercase bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">LEVEL 01</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-black mb-1">Pass ID</span>
                      <span className="font-mono text-xs text-white opacity-80 uppercase">PE-{(activeUser?.uid || 'GUEST')?.slice(0, 10)}</span>
                    </div>
                    
                    <div className="w-10 h-6 bg-red-600/20 border border-red-500/30 rounded-md flex items-center justify-center">
                      <svg className="w-6 h-auto text-red-500" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7.5" cy="7.5" r="7.5" fill="currentColor" opacity="0.3" />
                        <circle cx="16.5" cy="7.5" r="7.5" fill="currentColor" opacity="0.5" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <p className="text-zinc-500 text-xs font-light leading-snug pt-4 border-t border-zinc-900">
                  Authorized access to premium botanical selections. Benefits apply instantly at checkout.
                </p>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </main>
  );
}
