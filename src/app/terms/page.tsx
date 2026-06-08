"use client";

import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { motion } from "framer-motion";

export default function TermsPage() {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using the Pure Extract digital flagship, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. Our services are reserved for individuals who appreciate the highest standards of botanical purity."
    },
    {
      title: "2. Intellectual Property",
      content: "All content on this site, including but not limited to cinematic sequences, proprietary extraction data, photography, and brand identifiers, is the exclusive property of Pure Extract Co. Any unauthorized use, reproduction, or distribution is strictly prohibited."
    },
    {
      title: "3. Product Availability",
      content: "Due to the seasonal nature of our volcanic harvests, product availability is subject to change without notice. We reserve the right to limit quantities to ensure every customer receives the freshest possible extract."
    },
    {
      title: "4. User Conduct",
      content: "Users agree to use our platform for lawful purposes only. Any attempt to disrupt our high-performance systems or compromise the security of our boutique shopping experience will result in immediate termination of access."
    }
  ];

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden">
        <Header />
        
        <section className="pt-56 pb-24 px-8 md:px-24 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-16"
          >
            Terms of <br/><span className="text-zinc-800">Service</span>
          </motion.h1>
          
          <div className="flex flex-col gap-20">
            {terms.map((term, index) => (
              <motion.div 
                key={term.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-bold uppercase tracking-widest text-red-600 mb-6">{term.title}</h2>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">
                  {term.content}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-32 px-8 bg-zinc-950 border-t border-zinc-900">
           <div className="max-w-3xl mx-auto text-center">
              <p className="text-zinc-500 text-sm tracking-widest uppercase mb-4">Last Updated</p>
              <p className="text-white font-bold text-lg">May 2026</p>
           </div>
        </section>
      </main>
    </SmoothScroll>
  );
}
