"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  MapPin, 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  image: string;
  desc: string;
  price: string;
  quantity: number;
}

interface OrderDetails {
  id: string;
  date: string;
  deliveryDate: string;
  items: CartItem[];
  total: number;
  count: number;
  paymentId: string;
  createdAt?: number;
}

export default function OrderSuccessPage() {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update tracking bar progress status in real-time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedOrder = localStorage.getItem("last_order");
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (e) {
        console.error("Failed to parse order from localStorage", e);
      }
    }
    setLoadingOrder(false);
  }, []);

  if (authLoading || loadingOrder) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-zinc-800">
          <ShoppingBag className="w-8 h-8 text-zinc-600" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">No Order Details Found</h1>
        <p className="text-zinc-500 mb-10 max-w-sm">We couldn't retrieve your latest order details. If you just placed an order, it was processed successfully.</p>
        <Link href="/" className="bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all hover:scale-105">
          Go to Home
        </Link>
      </main>
    );
  }

  // Calculate dynamic status intervals
  const createdAt = order.createdAt || new Date(order.date).getTime() || Date.now();
  const timeDiff = currentTime - createdAt;

  const isOrderedCompleted = true;
  const isPackedCompleted = timeDiff >= 30 * 1000;
  const isShippedCompleted = timeDiff >= 60 * 1000;
  const isOutOfDeliveryCompleted = timeDiff >= 90 * 1000;
  const isDeliveredCompleted = timeDiff >= 120 * 1000;

  // Delivery status tracking stages (Flipkart style)
  const trackingStages = [
    { 
      label: "Ordered", 
      description: order.date, 
      completed: isOrderedCompleted, 
      active: !isPackedCompleted 
    },
    { 
      label: "Packed", 
      description: isPackedCompleted ? "Ready for dispatch" : "Packing your items", 
      completed: isPackedCompleted, 
      active: isPackedCompleted && !isShippedCompleted 
    },
    { 
      label: "Shipped", 
      description: isShippedCompleted ? "In transit" : "Awaiting pickup", 
      completed: isShippedCompleted, 
      active: isShippedCompleted && !isOutOfDeliveryCompleted 
    },
    { 
      label: "Out for Delivery", 
      description: isOutOfDeliveryCompleted ? "Near your hub" : "Awaiting transit", 
      completed: isOutOfDeliveryCompleted, 
      active: isOutOfDeliveryCompleted && !isDeliveredCompleted 
    },
    { 
      label: "Delivered", 
      description: isDeliveredCompleted ? "Package delivered!" : `Expected by ${order.deliveryDate.split(',')[1] || order.deliveryDate}`, 
      completed: isDeliveredCompleted, 
      active: isDeliveredCompleted 
    },
  ];

  // Calculate dynamic line progress percentage (4 steps of 25% each)
  let progressPercent = 0;
  if (isDeliveredCompleted) {
    progressPercent = 100;
  } else if (isOutOfDeliveryCompleted) {
    progressPercent = 75 + ((timeDiff - 90 * 1000) / (30 * 1000)) * 25;
  } else if (isShippedCompleted) {
    progressPercent = 50 + ((timeDiff - 60 * 1000) / (30 * 1000)) * 25;
  } else if (isPackedCompleted) {
    progressPercent = 25 + ((timeDiff - 30 * 1000) / (30 * 1000)) * 25;
  } else {
    progressPercent = (timeDiff / (30 * 1000)) * 25;
  }
  progressPercent = Math.max(0, Math.min(100, progressPercent));

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden relative pb-32">
        {/* Cinematic Glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-red-600/5 blur-[150px] rounded-full animate-pulse" />
        </div>

        <div className="grain-overlay" />
        <Header />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-12 pt-28 md:pt-40">
          {/* Success Header Block */}
          <div className="flex flex-col items-center text-center mb-16">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none"
            >
              Payment <span className="text-emerald-500">Successfull!</span>
            </motion.h1>
            <p className="text-zinc-500 text-lg font-light max-w-md">
              Thank you for your order. Your shipment of premium botanical extract is being prepared.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column - Tracking & Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Order Info Summary & Est. Delivery */}
              <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Order ID</span>
                    <span className="font-mono text-lg font-black text-white">{order.id}</span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Estimated Delivery</span>
                    <span className="text-emerald-500 font-bold text-lg">{order.deliveryDate}</span>
                  </div>
                </div>

                {/* Flipkart Style Delivery Tracker */}
                <div className="pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-8">Delivery Progress</h3>
                  
                  {/* Vertical layout for mobile, horizontal layout for desktop */}
                  <div className="hidden md:flex justify-between items-start relative select-none">
                    {/* Connecting Line */}
                    <div className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-zinc-800 z-0">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {trackingStages.map((stage, idx) => (
                      <div key={stage.label} className="flex flex-col items-center text-center w-1/5 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          stage.completed 
                            ? "bg-emerald-500 border-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                            : stage.active
                            ? "bg-zinc-900 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            : "bg-zinc-950 border-zinc-800 text-zinc-600"
                        }`}>
                          {stage.completed ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="font-bold text-sm">{idx + 1}</span>
                          )}
                        </div>
                        <span className={`mt-4 text-xs font-bold uppercase tracking-tight block ${stage.completed || stage.active ? "text-white" : "text-zinc-500"}`}>
                          {stage.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 mt-1 max-w-[110px] block leading-tight font-medium">
                          {stage.description}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Vertical Timeline */}
                  <div className="flex flex-col gap-6 md:hidden relative pl-4">
                    {/* Connecting line */}
                    <div className="absolute top-4 left-8 w-[2px] bottom-4 bg-zinc-800 z-0">
                      <div className="w-full bg-emerald-500 transition-all duration-300" style={{ height: `${progressPercent}%` }} />
                    </div>

                    {trackingStages.map((stage, idx) => (
                      <div key={stage.label} className="flex gap-6 items-start relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                          stage.completed 
                            ? "bg-emerald-500 border-emerald-400 text-black" 
                            : stage.active
                            ? "bg-zinc-900 border-emerald-500 text-emerald-500"
                            : "bg-zinc-950 border-zinc-800 text-zinc-600"
                        }`}>
                          {stage.completed ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="font-bold text-xs">{idx + 1}</span>
                          )}
                        </div>
                        <div className="flex flex-col justify-center pt-0.5">
                          <span className={`text-xs font-bold uppercase tracking-tight block ${stage.completed || stage.active ? "text-white" : "text-zinc-500"}`}>
                            {stage.label}
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-0.5 block leading-tight font-medium">
                            {stage.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Items Details */}
              <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Order Items ({order.count})</h3>
                
                <div className="divide-y divide-zinc-800/60">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-6 flex gap-6 items-center first:pt-0 last:pb-0">
                      <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-red-500 font-bold uppercase tracking-[0.2em] text-[9px] block mb-0.5">{item.desc}</span>
                          <h4 className="text-lg font-black text-white leading-tight">{item.name}</h4>
                          <span className="text-zinc-500 text-xs mt-1 block">Quantity: {item.quantity}</span>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <span className="text-white font-bold text-lg">{item.price}</span>
                          {item.quantity > 1 && (
                            <span className="text-zinc-500 text-[10px] block mt-0.5">
                              (₹{parseInt(item.price.replace('₹', '')) * item.quantity} Total)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column - Shipping & Price Details */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Delivery Details */}
              <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" /> Shipping Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Customer Name</span>
                    <span className="text-sm font-bold text-white">{user?.displayName || "Guest Customer"}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Email Address</span>
                    <span className="text-sm text-zinc-300 font-light truncate">{user?.email || "guest@example.com"}</span>
                  </div>
                  
                  <div className="flex flex-col pt-2 border-t border-zinc-800/60">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1.5">Shipping Address</span>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      16, Marine Drive, Netaji Subhash Chandra Bose Road,<br />
                      Opposite Wankhede Stadium, Churchgate,<br />
                      Mumbai, Maharashtra 400020
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-xl space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-red-500" /> Price Details
                </h3>
                
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="font-light">Subtotal ({order.count} items)</span>
                    <span className="text-white font-bold">₹{order.total}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-zinc-400 pb-4 border-b border-zinc-800/60">
                    <span className="font-light">Delivery Fee</span>
                    <span className="text-emerald-500 font-bold text-xs uppercase">Free</span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest leading-none pb-0.5">Amount Paid</span>
                    <span className="text-3xl font-black text-white tracking-tighter leading-none">₹{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Security Shield */}
              <div className="flex items-center gap-3 px-6 py-4 bg-zinc-900/20 rounded-2xl border border-zinc-800/40">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                  Razorpay Secured Transaction
                </span>
              </div>

              {/* Primary Call to Action */}
              <div className="pt-2">
                <Link 
                  href="/" 
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-[1.5rem] font-bold text-base transition-all flex items-center justify-center gap-3 group shadow-xl shadow-red-600/10 active:scale-[0.98]"
                >
                  Continue Shopping
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </main>
    </SmoothScroll>
  );
}
