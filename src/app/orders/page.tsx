"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Package, 
  ArrowLeft, 
  Calendar, 
  ChevronRight, 
  ShoppingBag,
  TrendingUp,
  Clock
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
  email: string;
  createdAt?: number;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [tick, setTick] = useState(0);

  // Periodically refresh order status badges in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
      return;
    }

    if (user) {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        try {
          let allOrders: OrderDetails[] = JSON.parse(savedOrders);
          let isUpdated = false;

          // Auto-associate legacy orders (lacking email field) with the current logged-in user
          allOrders = allOrders.map((order) => {
            let changed = false;
            if (!order.email && user.email) {
              order.email = user.email;
              changed = true;
            }
            if (!order.createdAt) {
              order.createdAt = new Date(order.date).getTime() || Date.now();
              changed = true;
            }
            if (changed) {
              isUpdated = true;
            }
            return order;
          });

          if (isUpdated) {
            localStorage.setItem("orders", JSON.stringify(allOrders));
          }

          // Filter orders associated with the logged-in user's email
          const userOrders = allOrders.filter(
            (order) => order.email?.toLowerCase() === user.email?.toLowerCase()
          );
          
          // Sort: newest first
          userOrders.sort((a, b) => {
            const timeA = a.createdAt || new Date(a.date).getTime() || 0;
            const timeB = b.createdAt || new Date(b.date).getTime() || 0;
            return timeB - timeA;
          });

          setOrders(userOrders);
        } catch (e) {
          console.error("Failed to parse orders list from localStorage", e);
        }
      }
      setLoadingOrders(false);
    }
  }, [user, authLoading, router]);

  const getOrderStatus = (order: OrderDetails) => {
    const createdAt = order.createdAt || new Date(order.date).getTime() || Date.now();
    const timeDiff = Date.now() - createdAt;
    
    if (timeDiff >= 120 * 1000) {
      return { text: "Delivered", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" };
    }
    if (timeDiff >= 90 * 1000) {
      return { text: "Out for Delivery", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
    }
    if (timeDiff >= 60 * 1000) {
      return { text: "Shipped", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" };
    }
    if (timeDiff >= 30 * 1000) {
      return { text: "Packed", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" };
    }
    return { text: "Ordered", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" };
  };

  const handleTrackOrder = (order: OrderDetails) => {
    localStorage.setItem("last_order", JSON.stringify(order));
    router.push("/order-success");
  };

  if (authLoading || loadingOrders) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden relative pb-32">
        {/* Ambient background glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-red-600/5 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-zinc-900/50 blur-[120px] rounded-full" />
        </div>

        <div className="grain-overlay" />
        <Header />

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-40">
          
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2 mb-16"
          >
            <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors group mb-4 w-fit">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs uppercase font-bold tracking-[0.2em]">Return to Gallery</span>
            </Link>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Your <br/><span className="text-red-600">Orders</span>
            </h1>
          </motion.div>

          {/* Orders History List */}
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-8 rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-xl hover:border-zinc-700/50 transition-all duration-500 flex flex-col gap-6"
                  >
                    {/* Order Meta Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/60">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-0.5">Order ID</span>
                          <span className="font-mono text-sm font-black text-white">{order.id}</span>
                        </div>
                      </div>

                      {(() => {
                        const status = getOrderStatus(order);
                        return (
                          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-2 text-zinc-400">
                              <Calendar className="w-4 h-4 text-zinc-600" />
                              <span>{order.date}</span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${status.bg} ${status.color}`}>
                              <Clock className="w-3.5 h-3.5" />
                              <span className="uppercase tracking-wider text-[10px] font-black">{status.text}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex justify-between items-center gap-4">
                            <div>
                              <h4 className="text-sm font-black text-white">{item.name}</h4>
                              <span className="text-zinc-500 text-[10px] block mt-0.5">Quantity: {item.quantity}</span>
                            </div>
                            <span className="text-sm font-bold text-zinc-300">{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Details Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-zinc-800/60 mt-2">
                      <div className="flex items-end gap-3">
                        <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest pb-0.5">Amount Paid:</span>
                        <span className="text-2xl font-black text-white tracking-tighter">₹{order.total}</span>
                      </div>
                      
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-wider px-6 py-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 group shrink-0 active:scale-[0.98]"
                      >
                        Track Shipment
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/10 rounded-[3rem] border border-zinc-800/30 border-dashed"
                >
                  <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
                    <ShoppingBag className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h2 className="text-2xl font-black mb-3 uppercase">No orders found</h2>
                  <p className="text-zinc-500 mb-8 max-w-xs text-sm font-light leading-relaxed">
                    It looks like you haven't placed any orders yet. Discover our premium selections.
                  </p>
                  <Link href="/#discover" className="bg-red-600 hover:bg-red-500 text-white px-10 py-4.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 shadow-xl shadow-red-600/15">
                    Explore Gallery
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </SmoothScroll>
  );
}
