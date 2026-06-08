"use client";

import { Menu, X, ShoppingBag, Home, User, LogOut, LogIn, ChevronRight, Package } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount, showNotification } = useCart();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      showNotification("Signed out successfully.");
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      showNotification("Failed to sign out.");
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Cart", href: user ? "/cart" : "/signin", icon: ShoppingBag, count: cartCount, isSpecial: true },
    ...(user 
      ? [
          { name: "My Orders", href: "/orders", icon: Package },
          { name: "Account", href: "/account", icon: User },
          { name: "Sign Out", onClick: handleLogout, icon: LogOut, isSignOut: true, isLoading: isLoggingOut }
        ]
      : [{ name: "Sign In", href: "/signin", icon: LogIn, isSpecial: true }])
  ];

  return (
    <header className="fixed top-0 left-0 w-full p-4 md:p-12 z-50 flex justify-between items-start pointer-events-none">
      <div className="relative pointer-events-auto">
        {/* Magnetic Menu Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "p-4 rounded-2xl bg-zinc-900/90 text-white transition-all shadow-2xl border border-zinc-800/50 backdrop-blur-md active:scale-95 group relative overflow-hidden",
            isMenuOpen ? "bg-red-600 border-red-500" : "hover:bg-zinc-800"
          )}
          aria-label="Menu"
        >
          {/* Button Shine Effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isMenuOpen ? "close" : "open"}
              initial={{ opacity: 0, scale: 0.5, rotate: -45, y: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(20px)", rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", rotateX: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.8, filter: "blur(20px)", rotateX: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
              className="absolute top-full left-0 mt-4 w-[calc(100vw-2rem)] sm:w-80 bg-zinc-950/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 origin-top-left overflow-hidden flex flex-col"
              style={{ perspective: "1000px" }}
            >
              {/* Background Particles Animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -100, 0],
                      x: [0, Math.random() * 50 - 25, 0],
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                      duration: 5 + Math.random() * 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute bg-red-600 rounded-full blur-2xl"
                    style={{
                      width: Math.random() * 60 + 20,
                      height: Math.random() * 60 + 20,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>

              {/* Profile Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-8 pb-4 border-b border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent relative z-10"
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-white font-bold text-xl shadow-2xl shadow-red-600/30 ring-1 ring-white/20"
                  >
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      user?.displayName?.[0] || 'G'
                    )}
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-base tracking-tight truncate max-w-[160px]">
                      {user?.displayName || (user ? 'Authenticated' : 'Guest Traveler')}
                    </span>
                    <span className="text-zinc-500 text-[10px] tracking-[0.2em] font-black">
                      {user?.email ? user.email.toLowerCase() : 'THE SOURCE AWAITS'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Items */}
              <motion.nav 
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                }}
                className="p-4 py-8 flex flex-col gap-2 relative z-10"
              >
                {menuItems.map((item: any) => (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                    }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        disabled={item.isLoading}
                        className={cn(
                          "w-full p-4 rounded-2xl flex items-center justify-between group transition-all relative overflow-hidden",
                          item.isSignOut ? "hover:bg-red-600/10" : "hover:bg-white/[0.05]"
                        )}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <motion.div 
                            whileHover={{ rotate: -10 }}
                            className={cn(
                              "w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-lg",
                              item.isSignOut ? "bg-red-600/20 text-red-500 group-hover:bg-red-600 group-hover:text-white" : "bg-zinc-900 text-zinc-400 group-hover:text-white group-hover:bg-red-600"
                            )}
                          >
                            {item.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <item.icon className="w-5 h-5" />}
                          </motion.div>
                          <span className={cn(
                            "font-bold text-sm tracking-wide transition-colors",
                            item.isSignOut ? "text-zinc-500 group-hover:text-red-500" : "text-zinc-400 group-hover:text-white"
                          )}>
                            {item.name}
                          </span>
                        </div>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white" />
                        </motion.div>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full p-4 rounded-2xl flex items-center justify-between group transition-all hover:bg-white/[0.05]"
                      >
                        <div className="flex items-center gap-4">
                          <motion.div 
                            whileHover={{ rotate: 10 }}
                            className="w-11 h-11 rounded-xl bg-zinc-900 text-zinc-400 flex items-center justify-center group-hover:text-white group-hover:bg-red-600 transition-all shadow-lg"
                          >
                            <item.icon className="w-5 h-5" />
                          </motion.div>
                          <div className="flex flex-col">
                            <span className="text-zinc-400 font-bold text-sm tracking-wide group-hover:text-white transition-colors flex items-center gap-2">
                              {item.name}
                              {item.count !== undefined && item.count > 0 && (
                                <motion.span 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-md leading-none shadow-lg shadow-red-600/40"
                                >
                                  {item.count}
                                </motion.span>
                              )}
                            </span>
                          </div>
                        </div>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white" />
                        </motion.div>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.nav>

              {/* Enhanced Glow Effect */}
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-red-600/10 blur-[80px] pointer-events-none rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
