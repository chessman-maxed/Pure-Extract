"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart, showNotification } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: cartTotal,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create order");
      }

      const { order, keyId } = await response.json();

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Pure Extract",
        description: "Strawberry Juice Purchase",
        order_id: order.id,
        handler: function (paymentResponse: any) {
          // Save order details to localStorage before clearing the cart
          const orderId = `OD${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
          const orderDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
          const lastOrder = {
            id: orderId,
            date: orderDate,
            deliveryDate: deliveryDate,
            items: [...cart],
            total: cartTotal,
            count: cartCount,
            paymentId: paymentResponse?.razorpay_payment_id || `pay_${Math.random().toString(36).substr(2, 9)}`,
            email: user?.email || 'guest',
            createdAt: Date.now()
          };
          localStorage.setItem('last_order', JSON.stringify(lastOrder));

          // Save to persistent orders list in localStorage
          const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          existingOrders.push(lastOrder);
          localStorage.setItem('orders', JSON.stringify(existingOrders));

          showNotification("Payment Successfull!");
          clearCart();
          router.push("/order-success");
        },
        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
        },
        theme: {
          color: "#dc2626",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      console.error("Checkout payment error:", error);
      showNotification(error.message || "Payment initiation failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <SmoothScroll>
        <main className="min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden relative">
        {/* Cinematic Background Atmosphere */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-red-600/5 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-zinc-900/50 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-white/[0.02] uppercase select-none tracking-tighter">
            Cart
          </div>
        </div>

        <div className="grain-overlay" />
        <Header />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-24 pt-28 md:pt-44 pb-20 md:pb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2 mb-12 md:mb-16"
          >
            <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors group mb-4 w-fit">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs uppercase font-bold tracking-[0.2em]">Return to Gallery</span>
            </Link>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
              Your <br/><span className="text-red-600">Selection</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <AnimatePresence mode="popLayout">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex gap-4 md:gap-8 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-xl group hover:border-zinc-700/50 transition-all duration-500"
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl relative shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-0.5 md:py-2 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex flex-col gap-0.5 md:gap-1 min-w-0">
                            <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px] truncate">{item.desc}</span>
                            <h3 className="text-lg sm:text-xl md:text-3xl font-black text-white group-hover:text-red-500 transition-colors truncate">{item.name}</h3>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 md:p-3 rounded-full bg-zinc-950/50 text-zinc-600 hover:text-white hover:bg-red-600 transition-all shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 md:mt-0">
                          <div className="flex items-center gap-3 md:gap-6 px-3 py-1.5 md:px-6 md:py-3 bg-black/40 border border-zinc-800 rounded-xl md:rounded-2xl">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="text-zinc-500 hover:text-white transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                            <span className="w-4 md:w-6 text-center text-sm md:text-lg font-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-zinc-500 hover:text-white transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="block text-zinc-500 text-[8px] md:text-[10px] uppercase font-bold tracking-widest mb-0.5 md:mb-1">Item Total</span>
                            <span className="text-xl md:text-3xl font-black text-white tracking-tighter">{item.price}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-32 text-center bg-zinc-900/20 rounded-[4rem] border border-zinc-800/30 border-dashed"
                  >
                    <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-8 border border-zinc-800">
                      <ShoppingBag className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h2 className="text-3xl font-black mb-4 uppercase">The collection is empty</h2>
                    <p className="text-zinc-500 mb-10 max-w-xs text-lg font-light leading-relaxed">
                      Begin your journey by selecting from our premium botanical extracts.
                    </p>
                    <Link href="/#discover" className="bg-red-600 hover:bg-red-500 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-xl shadow-red-600/20">
                      Explore Gallery
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Checkout Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-40 w-full">
              <div className="p-6 sm:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-2xl shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
                
                <h2 className="text-2xl font-black mb-10 uppercase tracking-tighter flex items-center gap-3">
                  Checkout <span className="text-red-600">Details</span>
                </h2>
                
                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="text-xs uppercase font-bold tracking-widest">Subtotal ({cartCount})</span>
                    <span className="text-white font-black text-xl tracking-tighter">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400 pb-8 border-b border-zinc-800/50">
                    <span className="text-xs uppercase font-bold tracking-widest">Courier Delivery</span>
                    <span className="text-green-500 font-bold text-sm uppercase">Complimentary</span>
                  </div>
                  
                  <div className="pt-2 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase font-bold tracking-widest text-zinc-500 mb-1">Final Amount</span>
                      <span className="text-5xl font-black text-white tracking-tighter leading-none">₹{cartTotal}</span>
                    </div>
                  </div>
                </div>

                <motion.button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isProcessing}
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-6 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-red-600/20"
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirm Order
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
                
                <div className="mt-10 flex flex-col gap-6">
                  <div className="flex items-center gap-4 px-6 py-4 bg-black/40 rounded-2xl border border-zinc-800">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Security</span>
                      <span className="text-xs text-white font-medium">SSL Encrypted Checkout</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center items-center gap-4">
                    {/* UPI Logo */}
                    <div className="w-16 h-10 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-center backdrop-blur-md hover:border-zinc-700/50 hover:bg-zinc-900/50 transition-all duration-300 shadow-lg group/payment cursor-pointer overflow-hidden p-2" title="UPI">
                      <svg className="h-5 w-auto text-zinc-500 group-hover/payment:text-white transition-colors" viewBox="0 0 333334 199007" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M44732 130924h1856l-1738 7215c-265 1061-206 1885 147 2415 354 530 1001 795 1973 795 942 0 1737-265 2356-795 618-531 1031-1355 1296-2415l1737-7215h1885l-1767 7392c-383 1590-1060 2798-2061 3593-972 795-2268 1208-3858 1208s-2680-383-3269-1179c-589-795-707-2002-324-3592l1767-7421zm223507 11868l2826-11868h6449l-383 1649h-4564l-706 2974h4564l-413 1679h-4564l-913 3827h4565l-412 1738h-6449zm-177-8982c-413-470-913-824-1443-1031-531-235-1119-353-1797-353-1266 0-2385 412-3386 1237s-1649 1915-1973 3239c-295 1267-177 2327 413 3181 559 824 1442 1237 2620 1237 677 0 1355-118 2031-383 678-235 1356-619 2062-1119l-530 2179c-589 382-1207 648-1856 825-648 176-1296 265-2002 265-883 0-1679-148-2356-443-678-294-1236-736-1679-1324-441-560-706-1237-824-2002-117-766-88-1590 148-2474 206-883 559-1680 1031-2445 471-766 1089-1443 1796-2002 706-589 1472-1030 2297-1325 824-294 1648-441 2503-441 677 0 1295 88 1885 294 559 207 1089 500 1560 913l-500 1972zm-18317 4300h3209l-530-2710c-29-176-59-383-59-589-30-235-30-471-30-736-118 265-235 500-383 736-118 235-235 442-353 619l-1855 2680zm4093 4682l-589-3062h-4594l-2062 3062h-1972l8539-12338 2650 12338h-1972zm-15548 0l2827-11868h6449l-383 1649h-4565l-706 2945h4563l-412 1679h-4564l-1325 5565h-1885v30zm-5566-6832h353c1001 0 1679-118 2062-354 382-236 648-648 795-1267 146-648 88-1119-207-1384-293-265-913-413-1855-413h-354l-795 3417zm-471 1502l-1267 5300h-1767l2828-11867h2621c766 0 1354 59 1737 148 411 89 736 265 971 500 295 295 471 648 559 1119 89 443 59 943-59 1502-235 943-619 1709-1207 2238-589 530-1326 854-2209 972l2680 5387h-2121l-2562-5300h-206zm-11632 5330l2828-11868h6478l-382 1649h-4565l-706 2974h4564l-411 1679h-4565l-912 3827h4564l-413 1738h-6479zm-2031-10248l-2444 10218h-1884l2444-10218h-3063l383-1649h8010l-382 1649h-3063zm-19170 10248l2945-12338 5595 7244c148 206 294 413 441 648s295 501 471 794l1974-8216h1737l-2945 12310-5713-7392c-147-206-295-412-441-619-147-235-265-442-354-707l-1972 8245h-1737v30zm-4594 0l2827-11868h1884l-2827 11868h-1884zm-13870-2385l1678-707c29 530 176 942 501 1207 324 265 765 413 1354 413 559 0 1031-148 1443-471 412-324 678-736 795-1266 177-707-235-1326-1236-1855-147-89-235-148-325-177-1119-648-1825-1207-2120-1737-294-530-354-1149-176-1884 235-972 736-1738 1530-2356 796-589 1679-913 2740-913 854 0 1530 177 2031 500 501 325 766 825 854 1444l-1648 766c-148-383-325-648-560-825-235-176-530-265-884-265-501 0-942 147-1295 412-354 265-589 619-707 1090-176 707 325 1383 1472 2002 89 59 147 89 207 117 1001 530 1678 1061 1972 1591 295 529 354 1148 178 1943-266 1119-825 2002-1680 2680-853 647-1855 1002-3033 1002-971 0-1737-237-2267-708-589-471-854-1149-824-2002zm-1973-7863l-2444 10218h-1884l2444-10218h-3062l381-1649h8010l-383 1649h-3062zm-19170 10248l2944-12338 5596 7244c147 206 295 413 442 648 146 235 294 501 471 794l1973-8216h1737l-2944 12310-5713-7392c-148-206-294-412-442-619-147-235-265-442-353-707l-1973 8245h-1737v30zm-8599 0l2827-11868h6449l-383 1649h-4564l-707 2974h4564l-412 1679h-4564l-913 3827h4565l-413 1738h-6449zm-3121-5860c0-88 29-354 88-766 30-353 59-618 89-854-118 266-236 530-383 824-147 266-324 560-530 825l-4535 6331-1472-6448c-59-265-118-530-148-766-29-235-59-500-59-736-59 236-147 500-235 794-89 266-206 560-354 855l-2650 5831h-1737l5683-12368 1620 7479c29 118 59 324 89 589 29 266 88 619 147 1031 206-353 471-765 825-1296 88-146 176-235 206-324l5124-7479-177 12368h-1737l148-5890zm-17933 5860l1296-5418-2356-6420h1972l1472 4035c30 117 59 235 118 411 59 178 89 354 147 530 118-176 236-353 354-530 118-176 236-324 353-471l3446-3975h1884l-5506 6390-1296 5417h-1885v30zm-8746-4682h3209l-530-2710c-30-176-59-383-59-589-30-235-30-471-30-736-118 265-236 500-383 736-118 235-235 442-354 619l-1855 2680zm4063 4682l-589-3062h-4594l-2061 3062h-1973l8540-12338 2650 12338h-1973zm-11808-6920h471c1031 0 1767-118 2179-354 412-235 677-647 825-1237 146-618 58-1089-236-1324-324-265-972-383-1943-383h-471l-825 3299zm-501 1590l-1266 5330h-1767l2827-11868h2856c854 0 1443 59 1826 147s678 236 913 471c294 265 500 648 589 1119 88 472 59 972-59 1531-147 560-353 1090-677 1561s-707 854-1119 1119c-353 206-736 382-1148 471-412 88-1060 148-1885 148h-1089v-30zm-17580 3563h1590c854 0 1531-59 2003-176 471-117 883-324 1266-589 530-383 972-854 1325-1443 354-560 619-1237 795-2002 176-766 235-1414 147-1972-88-561-294-1061-648-1444-265-294-589-471-1030-589-442-118-1119-176-2091-176h-1354l-2003 8392zm-2297 1767l2828-11868h2532c1649 0 2798 88 3415 265 619 177 1148 442 1561 854 530 530 884 1208 1031 2002 147 825 88 1767-147 2798-266 1060-648 1972-1178 2796-530 825-1207 1473-2002 2003-589 413-1237 678-1944 854-677 177-1708 265-3063 265h-3033v30zm-8628 0l2827-11868h6449l-383 1649h-4565l-707 2974h4565l-412 1679h-4565l-913 3827h4565l-412 1738h-6449zm-4565 0l2827-11868h1884l-2827 11868h-1885zm-8540 0l2827-11868h6449l-383 1649h-4564l-707 2945h4564l-412 1679h-4565l-1325 5565h-1885v30zm-4565 0l2827-11868h1884l-2827 11868h-1885zm-13015 0l2944-12338 5595 7244c147 206 294 413 442 648 147 235 294 501 471 794l1973-8216h1737l-2944 12310-5713-7392c-147-206-294-412-442-619-147-235-265-442-353-707l-1973 8245h-1737v30z" fill="currentColor" />
                        <path d="M233961 120588h-12927l17963-64873h12927l-17963 64873zm-107424-4064c-707 2562-3063 4358-5713 4358H54185c-1826 0-3180-619-4064-1855-883-1238-1089-2769-559-4594l16255-58541h12928l-14518 52298h51710l14517-52298h12928l-16844 60632zm100710-58777c-883-1237-2268-1855-4152-1855h-71027l-3504 12721h64608l-3769 13576h-51680v-30h-12927l-10719 38724h12927l7185-25973h58100c1826 0 3534-619 5124-1855 1590-1237 2651-2768 3151-4594l7185-25972c559-1943 383-3504-501-4741z" fill="currentColor" />
                        <path fill="#10B981" d="M274245 55833l16344 32510-34365 32510 4087-14747 18794-17763-8941-17785z"/>
                        <path fill="#EF4444" d="M262762 55833l16343 32510-34395 32510z"/>
                      </svg>
                    </div>

                    {/* Mastercard Logo */}
                    <div className="w-16 h-10 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-center backdrop-blur-md hover:border-zinc-700/50 hover:bg-zinc-900/50 transition-all duration-300 shadow-lg group/payment cursor-pointer" title="Mastercard">
                      <svg className="h-5 w-auto" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7.5" cy="7.5" r="7.5" fill="#EB001B" />
                        <circle cx="16.5" cy="7.5" r="7.5" fill="#F79E1B" opacity="0.85" />
                        <path d="M12 7.5A7.47 7.47 0 0 1 14.15 2.1 7.47 7.47 0 0 1 12 12.9a7.47 7.47 0 0 1-2.15-5.4c0-2.02.8-3.85 2.15-5.4z" fill="#FF5F00" />
                      </svg>
                    </div>

                    {/* Visa Logo */}
                    <div className="w-16 h-10 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-center backdrop-blur-md hover:border-zinc-700/50 hover:bg-zinc-900/50 transition-all duration-300 shadow-lg group/payment cursor-pointer" title="Visa">
                      <svg className="h-4 w-auto text-zinc-500 group-hover/payment:text-blue-500 transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </main>
      </SmoothScroll>
    </>
  );
}
