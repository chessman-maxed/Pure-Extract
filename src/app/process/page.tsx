"use client";

import { Header } from "@/components/Header";
import { motion, useScroll, useTransform } from "framer-motion";
import { Droplet, Wind, Zap, ShieldCheck, ArrowRight, Activity, Microscope } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function ProcessPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const steps = [
    {
      title: "Atmospheric Harvest",
      desc: "Hand-picked at peak ripeness from volcanic soils.",
      icon: <Wind className="w-8 h-8 text-red-600" />,
      detail: "Our strawberries are harvested only during the 'Golden Hour' (4:00 AM - 6:00 AM) to preserve the delicate fructose structures and volatile aromatic compounds."
    },
    {
      title: "Cold Pressure",
      desc: "10 tons of hydraulic pressure. Zero heat.",
      icon: <Droplet className="w-8 h-8 text-red-600" />,
      detail: "By avoiding centrifugal blades and heat, we prevent oxidation and keep every enzyme alive. This is extraction, not juicing."
    },
    {
      title: "Nano-Filtration",
      desc: "Clarification through silk membranes.",
      icon: <Zap className="w-8 h-8 text-red-600" />,
      detail: "A proprietary multi-stage filtration process that removes insoluble fibers while retaining 99.9% of the fruit's micronutrients."
    },
    {
      title: "Nitrogen Sealing",
      desc: "Nitrogen-flushed glass bottling.",
      icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
      detail: "Every bottle is a time capsule, sealed in a 100% oxygen-free environment. This ensures the first sip is as fresh as the day of harvest."
    }
  ];

  return (
    <main ref={containerRef} className="min-h-screen bg-black text-white selection:bg-red-500/30">
      <Header />
      
      {/* Cinematic Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black z-10" />
          <img 
            src="/sequence/00100.png" 
            className="w-full h-full object-cover opacity-40 grayscale" 
            alt="Process Laboratory" 
          />
        </motion.div>
        
        <motion.div 
          style={{ opacity: opacityHero }}
          className="relative z-20 text-center max-w-5xl px-8"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 font-bold tracking-[0.5em] uppercase text-xs mb-8 block"
          >
            The Methodology
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-12"
          >
            Pure <br/><span className="text-zinc-600 italic">Engineering</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            We don't just make juice. We engineer the biological preservation of liquid sunlight through advanced cold-press technology.
          </motion.p>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-px h-16 bg-gradient-to-b from-red-600 to-transparent" />
        </div>
      </section>

      {/* Methodology Grid */}
      <section className="py-48 px-8 md:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
              className="group p-12 rounded-[4rem] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl hover:bg-zinc-900/30 hover:border-red-600/20 transition-all duration-700"
            >
              <div className="w-20 h-20 rounded-2xl bg-zinc-950 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-zinc-800 shadow-2xl">
                {step.icon}
              </div>
              <span className="text-zinc-600 font-bold text-xs uppercase tracking-widest mb-4 block">Stage 0{index + 1}</span>
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter group-hover:text-red-500 transition-colors">{step.title}</h2>
              <p className="text-xl text-zinc-300 font-medium mb-6 leading-tight">{step.desc}</p>
              <p className="text-zinc-500 leading-relaxed font-light">
                {step.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-48 bg-zinc-950 border-y border-zinc-900 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-bold uppercase tracking-widest mb-16"
          >
            <Microscope className="w-4 h-4" /> Technical Specifications
          </motion.div>
          
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-24 leading-none">
            Zero Friction. <br/> <span className="text-red-600">Pure Life.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            {[
              { label: "7° Celsius", detail: "Maximum extraction temperature to prevent any thermal degradation of vitamins." },
              { label: "99.9% Oxygen-Free", detail: "Nitrogen blanket technology eliminates oxidation from first press to final seal." },
              { label: "48 Hour Window", detail: "Total time elapsed from farm harvest to glass bottle. Speed preserves life." }
            ].map((spec, i) => (
              <motion.div 
                key={spec.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-6"
              >
                <div className="text-white font-bold text-2xl tracking-tight">{spec.label}</div>
                <div className="w-12 h-0.5 bg-red-600" />
                <p className="text-zinc-500 text-base leading-relaxed">{spec.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="py-24 px-8 md:px-24 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-8">Pure <span className="text-red-600">Extract</span></h3>
              <p className="text-zinc-500 max-w-sm mb-8">
                The world's most scientifically advanced strawberry extract. Engineered for longevity, designed for pleasure.
              </p>
              <div className="flex gap-6">
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all cursor-pointer group">
                   <span className="text-[10px] group-hover:scale-110 transition-transform">IG</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all cursor-pointer group">
                   <span className="text-[10px] group-hover:scale-110 transition-transform">TW</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">Navigation</h4>
              <nav className="flex flex-col gap-4 text-zinc-500 font-medium">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/process" className="text-red-500">Process</Link>
                <Link href="/sustainability" className="hover:text-white transition-colors">Sustainability</Link>
                <Link href="/journal" className="hover:text-white transition-colors">Journal</Link>
              </nav>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">Contact</h4>
              <div className="flex flex-col gap-4 text-zinc-500 font-medium">
                <p>concierge@pureextract.dev</p>
                <p>+1 (800) PURE-EXT</p>
                <Link href="/legal" className="hover:text-white transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-zinc-900 flex flex-col md:row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
            <p>© 2026 Pure Extract Co. All Rights Reserved.</p>
            <div className="flex gap-12">
              <span>Terms of Service</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
