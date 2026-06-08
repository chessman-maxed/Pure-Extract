"use client";

import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { motion } from "framer-motion";

export default function LegalPage() {
  const sections = [
    {
      title: "Privacy Policy",
      content: "At Pure Extract, your data privacy is as important as our juice purity. We use SSL encryption for all transactions and never share your culinary preferences with third parties. Your data is used solely to enhance your bespoke shopping experience."
    },
    {
      title: "Terms of Service",
      content: "By accessing Pure Extract, you agree to our terms of premium service. All content, including cinematic sequences and proprietary botanical data, is protected under international copyright law. Unauthorized duplication is strictly prohibited."
    },
    {
      title: "Shipping & Handling",
      content: "We provide global complimentary courier shipping for all orders over ₹1000. Every bottle is shipped in temperature-controlled, shock-absorbent eco-packaging to ensure 'Harvest-Day' freshness upon arrival."
    }
  ];

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden">
        <Header />
        
        {/* Minimalist Hero */}
        <section className="pt-56 pb-24 px-8 md:px-24 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-16"
          >
            Legal <br/><span className="text-zinc-800">& Governance</span>
          </motion.h1>
          
          <div className="flex flex-col gap-24">
            {sections.map((section, index) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="max-w-3xl"
              >
                <h2 className="text-2xl font-bold uppercase tracking-widest text-red-600 mb-8">{section.title}</h2>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">
                  {section.content}
                </p>
                <div className="mt-12 h-px bg-zinc-900 w-full" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-32 px-8 bg-zinc-950 border-t border-zinc-900">
           <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-xl font-bold text-white uppercase tracking-[0.3em] mb-6">Need Clarity?</h3>
              <p className="text-zinc-500 mb-8 leading-relaxed">Our legal team and concierge are available for any inquiries regarding our governance and data practices.</p>
              <a href="mailto:legal@pureextract.com" className="text-red-600 font-bold hover:text-red-500 transition-colors">legal@pureextract.com</a>
           </div>
        </section>
      </main>
    </SmoothScroll>
  );
}
