"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function Notification() {
  const { notification } = useCart();
  
  const isCartNotification = notification?.toLowerCase().includes("added to");

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
        >
          <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 text-white pl-6 pr-4 py-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-8 min-w-[380px] pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-bold text-sm tracking-tight text-zinc-100 max-w-[200px] truncate">
                {isCartNotification 
                  ? `${notification.split(/ added to /i)[0] || "Item"} Added!` 
                  : notification
                }
              </span>
            </div>
            
            {isCartNotification && (
              <Link 
                href="/cart"
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] flex items-center gap-2 group"
              >
                Go to Cart
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
