"use client";

import { useRef } from "react";
import { CanvasSequence } from "@/components/CanvasSequence";
import { StorySection } from "@/components/StorySection";
import { Leaf, Droplet, ShieldCheck, Mail, Phone, ArrowRight } from "lucide-react";
import { DiscoverMore } from "@/components/DiscoverMore";
import { Header } from "@/components/Header";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const horizontalSectionRef = useRef(null);
  const harvestSectionRef = useRef(null);

  const { scrollYProgress: horizontalScrollProgress } = useScroll({
    target: horizontalSectionRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: harvestScrollProgress } = useScroll({
    target: harvestSectionRef,
    offset: ["start end", "end start"]
  });

  const xTranslate = useTransform(horizontalScrollProgress, [0, 1], ["20%", "-120%"]);
  const xTranslateReverse = useTransform(harvestScrollProgress, [0, 1], ["-80%", "40%"]);

  return (
      <main className="min-h-screen w-full overflow-clip selection:bg-red-500/30">
      <div className="grain-overlay" />
      <Header />
      
      {/* Hero Section: Scroll-driven Canvas Sequence */}
      <CanvasSequence>
        {/* ... (StorySections) */}
        <StorySection align="left">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Pure <br/> <span className="text-red-600">Extract</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Experience the vibrant essence of strawberries and moreee. 
            Discover the pinnacle of nature.
          </p>
        </StorySection>

        <StorySection align="right">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Hand <br/> <span className="text-red-600">Picked</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Every strawberry is selected by hand at the exact moment of peak ripeness.
          </p>
        </StorySection>

        <StorySection align="left">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            100% <br/> <span className="text-red-600">Organic</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Grown directly on our sustainable farms. Zero pesticides. Zero compromise.
          </p>
        </StorySection>

        <StorySection align="right">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Locally <br/> <span className="text-red-600">Sourced</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Soil to bottle in record time. Guaranteed freshness in every drop.
          </p>
        </StorySection>

        <StorySection align="left">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Cold <br/> <span className="text-red-600">Pressed</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Hydraulic extraction ensures zero heat compromises the delicate enzymes.
          </p>
        </StorySection>

        <StorySection align="right">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Nutrient <br/> <span className="text-red-600">Dense</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Preserving vitamins, minerals, and the true, raw taste of the fruit.
          </p>
        </StorySection>

        <StorySection align="left">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Zero <br/> <span className="text-red-600">Additives</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Nothing but pure strawberries. No water, no sugar, no preservatives.
          </p>
        </StorySection>

        <StorySection align="right">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Unfiltered <br/> <span className="text-red-600">Experience</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            We leave the pulp exactly where it belongs. Authentic. Raw. Pure.
          </p>
        </StorySection>

        <StorySection align="left">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Rich <br/> & <span className="text-red-600">Thick</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Unparalleled mouthfeel, bursting with the freshness of summer harvest.
          </p>
        </StorySection>

        <StorySection align="right">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Antioxidant <br/> <span className="text-red-600">Power</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Packed with Vitamin C to rejuvenate your body and energize your day.
          </p>
        </StorySection>

        <StorySection align="left">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl">
            Small <br/> <span className="text-red-600">Batches</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-sm leading-relaxed">
            Highly limited production for strict quality control on every bottle.
          </p>
        </StorySection>

        <StorySection align="center" className="pb-32 h-[180vh] flex items-center justify-center">
          <h2 className="text-5xl md:text-[7.5vw] font-black tracking-tighter mb-8 text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.9)] leading-[0.9] text-center uppercase px-4">
            Taste the <br/> <span className="text-red-600">Difference.</span>
          </h2>
        </StorySection>
      </CanvasSequence>

      {/* About Us Section */}
      <section id="about" className="py-48 px-8 md:px-24 bg-zinc-100 dark:bg-zinc-950 relative z-20 transition-colors duration-500 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1"
            >
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 text-zinc-900 dark:text-white transition-colors duration-500 leading-[0.9] uppercase">
                The Art of <br/> <span className="text-red-600">Pure Extraction</span>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-10 text-xl leading-relaxed transition-colors duration-500 font-light max-w-lg">
                We believe in uncompromising quality. From the mineral-rich soil to the hand-sealed bottle,
                every step of our journey is a testament to the pursuit of perfection.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col gap-4 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-xl border border-zinc-200 dark:border-zinc-800 group-hover:border-red-500/50 transition-colors">
                    <Leaf className="w-8 h-8 text-green-600 dark:text-green-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors duration-500">Sustainable Farms</h3>
                  <p className="text-zinc-600 dark:text-zinc-500 leading-relaxed">Grown without harmful pesticides, honoring the earth that provides.</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-4 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-xl border border-zinc-200 dark:border-zinc-800 group-hover:border-red-500/50 transition-colors">
                    <Droplet className="w-8 h-8 text-red-600 dark:text-red-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors duration-500">Zero Additives</h3>
                  <p className="text-zinc-600 dark:text-zinc-500 leading-relaxed">No water, no sugar. Just the raw, crystalline essence of fruit.</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 w-full relative group"
            >
              <div className="absolute inset-0 bg-red-600/10 blur-[60px] group-hover:bg-red-600/20 transition-colors duration-700" />
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white dark:bg-zinc-900 border-8 border-white dark:border-zinc-900 shadow-2xl">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1.5 }}
                  src="/sequence/00100.png" 
                  alt="Strawberry Process" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <p className="text-white font-black text-4xl tracking-tighter uppercase opacity-30">Our Legacy</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Horizontal Feature Section */}
      <section ref={horizontalSectionRef} className="relative h-[300vh] bg-black overflow-clip">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div 
            style={{ x: xTranslate }} 
            className="flex gap-16 md:gap-32 px-[10vw] items-center whitespace-nowrap"
          >
            <div className="flex flex-col gap-4">
              <h2 className="text-[15vw] font-black tracking-tighter text-white uppercase leading-none opacity-20 outline-text">The Purity</h2>
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                <div className="w-[80vw] h-[35vh] sm:w-96 sm:h-[50vh] md:h-[60vh] rounded-[2rem] md:rounded-[3rem] bg-zinc-900 overflow-hidden relative border border-zinc-800 shrink-0">
                  <img src="/sequence/00150.png" className="w-full h-full object-cover opacity-60" alt="Detail" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-2xl md:text-3xl font-black uppercase tracking-widest">Macro</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:gap-6 max-w-md whitespace-normal">
                  <h3 className="text-3xl md:text-5xl font-black text-red-600 uppercase italic">Zero Compromise</h3>
                  <p className="text-base md:text-2xl text-zinc-400 font-light leading-relaxed">
                    Every fiber, every enzyme, and every drop is preserved through our proprietary cold-press method.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[15vw] font-black tracking-tighter text-white uppercase leading-none opacity-20">The Source</h2>
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                <div className="w-[80vw] h-[35vh] sm:w-96 sm:h-[50vh] md:h-[60vh] rounded-[2rem] md:rounded-[3rem] bg-zinc-900 overflow-hidden relative border border-zinc-800 shrink-0">
                  <img src="/sequence/00050.png" className="w-full h-full object-cover opacity-60" alt="Detail" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-2xl md:text-3xl font-black uppercase tracking-widest">Origin</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:gap-6 max-w-md whitespace-normal">
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase">Volcanic Soil</h3>
                  <p className="text-base md:text-2xl text-zinc-400 font-light leading-relaxed">
                    Our strawberries are grown in nutrient-dense volcanic soil, giving them a unique mineral profile and depth of flavor.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[15vw] font-black tracking-tighter text-red-600 uppercase leading-none opacity-20">The Result</h2>
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                <div className="w-[80vw] h-[35vh] sm:w-96 sm:h-[50vh] md:h-[60vh] rounded-[2rem] md:rounded-[3rem] bg-zinc-900 overflow-hidden relative border border-zinc-800 shrink-0">
                  <img src="/sequence/00190.png" className="w-full h-full object-cover opacity-60" alt="Detail" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-2xl md:text-3xl font-black uppercase tracking-widest">Purity</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:gap-6 max-w-md whitespace-normal">
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic">Ultra Raw</h3>
                  <p className="text-base md:text-2xl text-zinc-400 font-light leading-relaxed">
                    Unfiltered, unpasteurized, and completely raw. The way nature intended it to be experienced.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <DiscoverMore />

      {/* Advanced Horizontal Feature Section 2: The Harvest */}
      <section ref={harvestSectionRef} className="relative h-[300vh] bg-zinc-950 overflow-clip">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div 
            style={{ x: xTranslateReverse }} 
            className="flex gap-24 md:gap-48 px-[10vw] items-center whitespace-nowrap"
          >
            <div className="flex flex-col gap-6">
              <h2 className="text-[18vw] font-black tracking-tighter text-white uppercase leading-none opacity-5">Extraction</h2>
              <div className="flex flex-col md:flex-row gap-6 md:gap-20 items-center md:items-end">
                <div className="w-[80vw] md:w-[30vw] aspect-[16/9] rounded-[2rem] md:rounded-[4rem] bg-zinc-900 overflow-hidden relative border border-zinc-800 rotate-[-2deg] shrink-0">
                  <img src="/sequence/00120.png" className="w-full h-full object-cover opacity-80 scale-125" alt="Detail" />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent" />
                </div>
                <div className="flex flex-col gap-4 md:gap-8 pb-4 md:pb-12 whitespace-normal max-w-xl">
                  <span className="text-red-500 font-bold tracking-[0.5em] uppercase text-sm">Phase 01</span>
                  <h3 className="text-3xl md:text-6xl font-black text-white uppercase leading-[0.85]">Cold Hydraulic <br/> Pressing</h3>
                  <p className="text-base md:text-xl text-zinc-500 font-light leading-relaxed">
                    Zero friction. Zero heat. We use 10 tons of hydraulic pressure to gently release the cellular water of the fruit.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-[18vw] font-black tracking-tighter text-red-600 uppercase leading-none opacity-10">Purity</h2>
              <div className="flex flex-col md:flex-row gap-6 md:gap-20 items-center md:items-end">
                <div className="w-[80vw] md:w-[35vw] aspect-[16/9] rounded-[2rem] md:rounded-[4rem] bg-zinc-900 overflow-hidden relative border border-zinc-800 rotate-[2deg] shrink-0">
                  <img src="/sequence/00150.png" className="w-full h-full object-cover opacity-80" alt="Detail" />
                </div>
                <div className="flex flex-col gap-4 md:gap-8 pb-4 md:pb-12 whitespace-normal max-w-xl">
                  <span className="text-red-500 font-bold tracking-[0.5em] uppercase text-sm">Phase 02</span>
                  <h3 className="text-3xl md:text-6xl font-black text-white uppercase leading-[0.85]">Nano-Filter <br/> Clarification</h3>
                  <p className="text-base md:text-xl text-zinc-500 font-light leading-relaxed">
                    We remove only the largest fibers, leaving the vital micronutrients and natural sediment that define our signature texture.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-[18vw] font-black tracking-tighter text-white uppercase leading-none opacity-5">The Bottle</h2>
              <div className="flex flex-col md:flex-row gap-6 md:gap-20 items-center md:items-end">
                <div className="w-[80vw] md:w-[40vw] aspect-[4/3] md:aspect-square rounded-[2rem] md:rounded-[5rem] bg-zinc-900 overflow-hidden relative border border-zinc-800 shrink-0">
                  <img src="/sequence/00180.png" className="w-full h-full object-cover opacity-90" alt="Detail" />
                </div>
                <div className="flex flex-col gap-4 md:gap-8 pb-6 md:pb-20 whitespace-normal max-w-xl">
                  <span className="text-red-500 font-bold tracking-[0.5em] uppercase text-sm">Final Phase</span>
                  <h3 className="text-3xl md:text-6xl font-black text-white uppercase leading-[0.85]">Nitrogen <br/> Sealed</h3>
                  <p className="text-base md:text-xl text-zinc-500 font-light leading-relaxed">
                    Every bottle is sealed under a nitrogen blanket to prevent oxidation, locking in the harvest-day freshness for your first sip.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-zinc-950 pt-32 pb-16 px-8 md:px-24 border-t border-zinc-900 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            {/* Brand Identity */}
            <div className="col-span-1 lg:col-span-1">
              <h3 className="text-3xl font-black tracking-tighter text-white uppercase mb-8">Pure <br/><span className="text-red-600">Extract</span></h3>
              <p className="text-zinc-500 text-lg leading-relaxed mb-10 max-w-xs">
                Defining the new standard of cold-pressed excellence. Crafted for the uncompromising.
              </p>
              <div className="flex gap-5">
                {["instagram", "twitter", "facebook"].map((social) => (
                  <motion.a 
                    key={social}
                    href={`https://${social}.com`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -5 }}
                    className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors overflow-hidden"
                  >
                    <span className="sr-only">{social}</span>
                    {social === "instagram" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    )}
                    {social === "twitter" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                      </svg>
                    )}
                    {social === "facebook" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    )}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="grid grid-cols-2 gap-8 col-span-1 lg:col-span-1">
              <div className="flex flex-col gap-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Experience</h4>
                <div className="flex flex-col gap-4 text-zinc-500 text-sm">
                  {[
                    { name: "Collection", href: "/#discover" },
                    { name: "Process", href: "/process" },
                    { name: "Sustainability", href: "/sustainability" },
                    { name: "Impact", href: "/sustainability" }
                  ].map(link => (
                    <Link key={link.name} href={link.href} className="hover:text-white transition-colors">{link.name}</Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Company</h4>
                <div className="flex flex-col gap-4 text-zinc-500 text-sm">
                  {[
                    { name: "Journal", href: "/journal" },
                    { name: "Press", href: "/journal" },
                    { name: "Careers", href: "/legal" },
                    { name: "Legal", href: "/legal" }
                  ].map(link => (
                    <Link key={link.name} href={link.href} className="hover:text-white transition-colors">{link.name}</Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-8 col-span-1">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Concierge</h4>
              <div className="flex flex-col gap-6">
                <a href="mailto:hello@pureextract.com" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-red-500 transition-colors border border-zinc-800">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-xs uppercase tracking-tighter">Email Support</span>
                    <span className="text-white text-sm">concierge@pure.com</span>
                  </div>
                </a>
                <a href="tel:+18001234567" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-red-500 transition-colors border border-zinc-800">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-xs uppercase tracking-tighter">Direct Line</span>
                    <span className="text-white text-sm">+1 800 PURE EXT</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="col-span-1">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Newsletter</h4>
              <p className="text-zinc-500 text-sm mb-6">Access seasonal releases and private events.</p>
              <form className="relative group">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-600"
                  required
                />
                <button 
                  type="button" 
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-red-600 hover:bg-red-500 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-red-600/20"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-zinc-600 text-xs uppercase tracking-widest">
              <span>© 2026 PURE EXTRACT CO.</span>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Encrypted Checkout</span>
              </div>
              <div className="flex gap-3 items-center">
                {/* SSL Secure Certificate */}
                <div className="w-10 h-10 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex items-center justify-center backdrop-blur-md hover:border-red-500/30 hover:bg-zinc-900/50 transition-all duration-300 shadow-lg group/security cursor-pointer" title="SSL Secured Connection">
                  <svg className="w-5 h-5 text-zinc-500 group-hover/security:text-red-500 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1.5" />
                  </svg>
                </div>

                {/* PCI DSS Compliant */}
                <div className="w-10 h-10 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex items-center justify-center backdrop-blur-md hover:border-red-500/30 hover:bg-zinc-900/50 transition-all duration-300 shadow-lg group/security cursor-pointer" title="PCI-DSS Compliant Security">
                  <svg className="w-5 h-5 text-zinc-500 group-hover/security:text-red-500 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 11 2 2 4-4" />
                  </svg>
                </div>

                {/* Verified Trust Seal */}
                <div className="w-10 h-10 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex items-center justify-center backdrop-blur-md hover:border-red-500/30 hover:bg-zinc-900/50 transition-all duration-300 shadow-lg group/security cursor-pointer" title="Verified Trust Seal">
                  <svg className="w-5 h-5 text-zinc-500 group-hover/security:text-red-500 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
