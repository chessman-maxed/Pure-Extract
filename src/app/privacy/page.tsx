"use client";

import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const policies = [
    {
      title: "Data Purity",
      content: "Just as we filter our extracts, we filter our data practices. We only collect the essential information required to deliver your boutique shopping experience. Your data is never sold, traded, or compromised."
    },
    {
      title: "Security & Encryption",
      content: "All transactions are processed through SSL-encrypted gateways. We use the highest industry standards to protect your personal and financial information, ensuring your journey with Pure Extract is always secure."
    },
    {
      title: "Cookies & Tracking",
      content: "We use minimalist tracking to understand how you interact with our cinematic content. This allows us to optimize our performance and deliver a more personalized experience without intruding on your digital privacy."
    },
    {
      title: "Your Rights",
      content: "You have the full right to access, modify, or delete your personal data from our systems at any time. Our concierge is available to assist you with any privacy-related requests."
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
            Privacy <br/><span className="text-zinc-800">Policy</span>
          </motion.h1>
          
          <div className="flex flex-col gap-20">
            {policies.map((policy, index) => (
              <motion.div 
                key={policy.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-bold uppercase tracking-widest text-red-600 mb-6">{policy.title}</h2>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">
                  {policy.content}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-32 px-8 bg-zinc-950 border-t border-zinc-900">
           <div className="max-w-3xl mx-auto text-center">
              <p className="text-zinc-500 text-sm tracking-widest uppercase mb-4">Integrity Guarantee</p>
              <p className="text-white font-bold text-lg">Your data belongs to you.</p>
           </div>
        </section>
      </main>
    </SmoothScroll>
  );
}
