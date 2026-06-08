"use client";

import { Header } from "@/components/Header";
import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, Recycle, Globe, Zap, ArrowRight, ShieldCheck, Droplet } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function SustainabilityPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const initiatives = [
    {
      title: "Volcanic Regeneration",
      desc: "Our farms use 100% organic volcanic compost.",
      icon: <Globe className="w-8 h-8 text-emerald-500" />,
      detail: "We've restored over 500 acres of soil health using ancient mineral re-infusion techniques that bypass synthetic fertilizers."
    },
    {
      title: "Circular Glass",
      desc: "Infinite recyclability with zero plastics.",
      icon: <Recycle className="w-8 h-8 text-emerald-500" />,
      detail: "Our proprietary heavy-weight glass bottles are designed for up to 50 reuses and are 100% infinitely recyclable."
    },
    {
      title: "Solar Pressing",
      desc: "100% powered by on-site solar arrays.",
      icon: <Zap className="w-8 h-8 text-emerald-500" />,
      detail: "Every hydraulic press in our facility is powered by clean, renewable energy harvested from our 2-megawatt solar farm."
    },
    {
      title: "Ethical Harvest",
      desc: "Fair-trade labor and living wages.",
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      detail: "We pay our farmers 3x the market average, ensuring the highest quality of life and crop consistency."
    }
  ];

  return (
    <main ref={containerRef} className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <Header />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-10" />
          <div className="absolute inset-0 bg-emerald-950/10 mix-blend-overlay z-10" />
          <img 
            src="/sequence/00020.png" 
            className="w-full h-full object-cover scale-110 opacity-40 grayscale" 
            alt="Sustainability Landscape" 
          />
        </motion.div>
        
        <motion.div 
          style={{ opacity: opacityHero }}
          className="relative z-20 text-center max-w-5xl px-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-bold tracking-[0.3em] uppercase mb-8"
          >
            Environmental Stewardship
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-12"
          >
            Planet <br/><span className="text-zinc-600 italic">Positive</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Luxury is temporary. The earth is permanent. We design every drop to give back more than it takes.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-8 border-y border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { label: "Carbon Negative", value: "2.4x", sub: "Offsets per bottle" },
            { label: "Water Saved", value: "85%", sub: "Vs industry standard" },
            { label: "Plastic Free", value: "100%", sub: "Committed since day one" }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl md:text-7xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4">{stat.label}</div>
              <div className="text-zinc-500 text-sm">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Initiatives Detailed Grid */}
      <section className="py-48 px-8 md:px-24 max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-600 rounded-full blur-[160px]" />
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-900 rounded-full blur-[160px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 relative z-10">
          {initiatives.map((item, index) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
              className="group relative p-12 rounded-[3rem] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl hover:bg-zinc-900/30 hover:border-emerald-500/20 transition-all duration-700"
            >
              <div className="w-20 h-20 rounded-2xl bg-zinc-950 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-zinc-800 shadow-2xl">
                {item.icon}
              </div>
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">{item.title}</h2>
              <p className="text-xl text-zinc-300 font-medium mb-6 leading-tight">{item.desc}</p>
              <p className="text-zinc-500 leading-relaxed font-light">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-64 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-color" />
        <div className="max-w-5xl text-center relative z-10 px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block p-6 rounded-full bg-emerald-600/10 border border-emerald-600/20 mb-16"
          >
            <Leaf className="w-16 h-16 text-emerald-500" />
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-16 leading-[0.9]">
            Leaving the <br/> soil <span className="italic text-zinc-500">purer</span> than <br/> we <span className="text-emerald-500">found it.</span>
          </h2>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-black font-bold uppercase tracking-widest text-sm cursor-pointer hover:bg-emerald-500 hover:text-white transition-all duration-300"
          >
            Read Our 2026 Report <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="py-24 px-8 md:px-24 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-8">Pure <span className="text-emerald-500">Extract</span></h3>
              <p className="text-zinc-500 max-w-sm mb-8">
                The world's most scientifically advanced strawberry extract. Sustainable by nature, premium by design.
              </p>
              <div className="flex gap-6">
                {/* Social icons could go here */}
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all cursor-pointer">IG</div>
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white transition-all cursor-pointer">TW</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">Navigation</h4>
              <nav className="flex flex-col gap-4 text-zinc-500 font-medium">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/process" className="hover:text-white transition-colors">Process</Link>
                <Link href="/sustainability" className="text-emerald-500">Sustainability</Link>
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
