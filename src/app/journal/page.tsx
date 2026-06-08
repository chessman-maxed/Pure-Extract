"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Calendar, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function JournalPage() {
  const articles = [
    {
      title: "The Volcanic Harvest: Summer 2026",
      category: "Field Notes",
      date: "May 12, 2026",
      image: "/sequence/00050.png",
      excerpt: "Deep into the harvest season, our master farmers reveal why this year's volcanic ash layer has produced our sweetest extract yet."
    },
    {
      title: "Molecular Gastronomy: The Art of Infusion",
      category: "The Lab",
      date: "April 28, 2026",
      image: "/sequence/00120.png",
      excerpt: "Exploring the boundary between science and taste with chef Marco Rossi and our cold-press engineers."
    },
    {
      title: "Sustainability: Zero Plastic Initiative",
      category: "Vision",
      date: "April 15, 2026",
      image: "/sequence/00180.png",
      excerpt: "Why we chose heavy-weight glass over every alternative, and how we are building a closed-loop system."
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30">
      <Header />
      
      {/* Editorial Hero */}
      <section className="pt-56 pb-32 px-8 md:px-24 max-w-7xl mx-auto border-b border-zinc-900">
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-red-500 font-bold tracking-[0.4em] uppercase text-xs mb-8 block"
        >
          The Journal
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.8] mb-16"
        >
          Liquid <br/><span className="text-zinc-800">Intelligence</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl text-zinc-500 font-light max-w-2xl leading-relaxed"
        >
          A quarterly exploration into the science, culture, and ethics of pure botanical extraction.
        </motion.p>
      </section>

      {/* Article Grid */}
      <section className="py-32 px-8 md:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col gap-32">
          {articles.map((article, index) => (
            <motion.article 
              key={article.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center group"
            >
              <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
                  <img src={article.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={article.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-6 text-zinc-500 text-xs uppercase font-bold tracking-widest">
                    <span className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">{article.category}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {article.date}</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-xl text-zinc-400 font-light leading-relaxed">
                    {article.excerpt}
                  </p>
                  {/* Read Feature links removed as requested */}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Subscription Block */}
      <section className="py-48 px-8 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-block p-6 rounded-full bg-red-600/10 border border-red-600/20 mb-12"
            >
              <Mail className="w-10 h-10 text-red-600" />
            </motion.div>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">Access the Archive</h3>
            <p className="text-xl text-zinc-500 font-light mb-16 max-w-xl mx-auto">Join 50,000+ botanical enthusiasts for our exclusive monthly scientific newsletter.</p>
            <div className="flex flex-col md:flex-row gap-4">
                <input type="email" placeholder="concierge@example.com" className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-red-600 transition-colors placeholder:text-zinc-700" />
                <button className="bg-red-600 hover:bg-red-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20">Subscribe</button>
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
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">Navigation</h4>
              <nav className="flex flex-col gap-4 text-zinc-500 font-medium">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/process" className="hover:text-white transition-colors">Process</Link>
                <Link href="/sustainability" className="hover:text-white transition-colors">Sustainability</Link>
                <Link href="/journal" className="text-red-500">Journal</Link>
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
          </div>
        </div>
      </footer>
    </main>
  );
}
