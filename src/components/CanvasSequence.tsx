"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import { Leaf, Droplet } from "lucide-react";

interface CanvasSequenceProps {
  children?: React.ReactNode;
}

export function CanvasSequence({ children }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const frameCount = 192;

  // Stabilize random values for particles
  // Stabilize random values for particles
  const particles = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      driftX: (Math.random() - 0.5) * 20,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 10,
      scale: 1 + Math.random() * 0.5
    }));
  }, []);

  // Hoist Transforms to Top Level (Avoid Hook Rules Violation)
  const leaf1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const leaf1Rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const leaf1Scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  const leaf2Y = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const leaf2Rotate = useTransform(scrollYProgress, [0, 1], [-15, -60]);
  const leaf2Scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);

  const dropY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const dropRotate = useTransform(scrollYProgress, [0, 1], [45, 180]);

  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.5, 0.2]);

  const sweepX = useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]);
  
  // Luxury Refractive Light
  const refractiveY = useTransform(scrollYProgress, [0, 0.5, 1], ["-20%", "50%", "120%"]);
  const refractiveOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]);
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgba(239, 68, 68, 0.15)", "rgba(220, 38, 38, 0.25)", "rgba(185, 28, 28, 0.15)"]
  );

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // Files are named 00001.png, 00002.png, etc.
      const indexStr = i.toString().padStart(5, '0');
      img.src = `/sequence/${indexStr}.png`;
      
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };
      imgArray.push(img);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setImages(imgArray);
    imagesRef.current = imgArray;
  }, []);

  // Direct Canvas Rendering Loop (No React State)
  useEffect(() => {
    if (!loaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const renderFrame = (v: number) => {
      const frameIndex = Math.min(frameCount - 1, Math.floor(v * frameCount));
      const img = imagesRef.current[frameIndex];
      if (!img) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    // Initial render
    renderFrame(scrollYProgress.get());

    // Subscribe to scroll changes without re-rendering component
    const unsubscribe = scrollYProgress.on("change", (v) => {
      requestAnimationFrame(() => renderFrame(v));
    });

    return () => unsubscribe();
  }, [loaded, images.length, scrollYProgress]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && imagesRef.current.length > 0) {
        // Force a re-render of the current frame on resize
        const v = scrollYProgress.get();
        const frameIndex = Math.min(frameCount - 1, Math.floor(v * frameCount));
        const img = imagesRef.current[frameIndex];
        if (img) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d", { alpha: false });
          if (ctx) {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          }
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative w-full bg-black" style={{ height: "1200vh" }}>
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {!loaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center bg-black z-50 overflow-hidden"
          >
            {/* Background Kinetic Glows */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], x: [-20, 20, -20], y: [-20, 20, -20] }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-red-900/40 blur-[150px] rounded-full" 
               />
               <motion.div 
                 animate={{ scale: [1.2, 1, 1.2], x: [20, -20, 20], y: [20, -20, 20] }}
                 transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                 className="absolute -bottom-[20%] -right-[20%] w-[80%] h-[80%] bg-zinc-900/40 blur-[150px] rounded-full" 
               />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Massive Counting Number */}
              <div className="flex items-baseline gap-2">
                <motion.span 
                  className="text-[25vw] md:text-[20vw] font-thin tracking-tighter leading-none text-white/90 select-none"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {loadProgress.toString().padStart(2, '0')}
                </motion.span>
                <span className="text-4xl md:text-6xl font-bold text-red-600">%</span>
              </div>

              {/* Cycling Brand Keywords */}
              <div className="h-8 overflow-hidden mt-[-2vw]">
                <motion.div
                  animate={{ y: `-${Math.floor(loadProgress / 20) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="flex flex-col text-center"
                >
                  {["HARVESTING", "PRESSING", "CLARIFYING", "INFUSING", "BOTTLING", "READY"].map((text) => (
                    <span key={text} className="text-lg md:text-xl font-bold uppercase tracking-[0.6em] text-zinc-500 h-8 flex items-center justify-center">
                      {text}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Bottom Brand Identity */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-white/5 pt-8">
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Purity Standard</span>
                  <span className="text-sm font-medium text-white/40 tracking-widest uppercase">Pure Extract © 2026</span>
               </div>
               <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Status</span>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                     <span className="text-sm font-medium text-white/40 tracking-widest uppercase">System Optimal</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
        
        <canvas
          ref={canvasRef}
          className={cn(
            "w-full h-full transition-opacity duration-[1500ms] ease-in-out",
            loaded ? "opacity-100 delay-[800ms]" : "opacity-0"
          )}
          style={{
             width: '100%',
             height: '100%',
          }}
        />
        
        {/* Dynamic Floating Elements Layer */}
        {loaded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            {/* Particles */}
            {particles.map((p) => (
              <motion.div
                key={`particle-${p.id}`}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                initial={{ 
                  x: `${p.x}vw`, 
                  y: `${p.y}vh`,
                  opacity: 0 
                }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  y: ["-10vh", "110vh"],
                  x: `${p.driftX}vw`
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: p.delay
                }}
                style={{
                  filter: "blur(1px)",
                  scale: p.scale
                }}
              />
            ))}

            {/* Botanical Elements */}
            <motion.div
              className="absolute top-[20%] left-[15%] text-red-600/40 dark:text-red-500/20 blur-[2px]"
              style={{ y: leaf1Y, rotate: leaf1Rotate, scale: leaf1Scale, translateZ: 0 }}
            >
              <Leaf className="w-16 h-16 md:w-[120px] md:h-[120px]" strokeWidth={1} />
            </motion.div>

            <motion.div
              className="absolute top-[60%] right-[10%] text-green-600/30 dark:text-green-500/15 blur-[3px]"
              style={{ y: leaf2Y, rotate: leaf2Rotate, scale: leaf2Scale, translateZ: 0 }}
            >
              <Leaf className="w-24 h-24 md:w-[180px] md:h-[180px]" strokeWidth={0.5} />
            </motion.div>

            <motion.div
              className="absolute bottom-[20%] left-[25%] text-red-600/40 dark:text-red-500/20 blur-[1px]"
              style={{ y: dropY, rotate: dropRotate, translateZ: 0 }}
            >
              <Droplet className="w-12 h-12 md:w-[80px] md:h-[80px]" strokeWidth={1} />
            </motion.div>

            {/* Optimized Refractive Light Sweep */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5 skew-y-12 pointer-events-none"
              style={{ y: refractiveY, opacity: refractiveOpacity, translateZ: 0 }}
            />

            {/* Dynamic Environmental Glow (Optimized) */}
            <motion.div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{ 
                background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`,
                scale: glowScale,
                translateZ: 0 
              }}
            />
            
            {/* Juice Ripples / Energy Rings */}
            {[...Array(3)].map((_, i) => (
              <JuiceRipple key={`ripple-${i}`} index={i} scrollYProgress={scrollYProgress} />
            ))}

            {/* Subtle light sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12"
              style={{ x: sweepX, translateZ: 0 }}
            />
          </motion.div>
        )}

        {/* Subtle gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
      </div>
      
      {/* Scrollable Story Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col"
      >
        {children}
      </motion.div>
    </div>
  );
}

function JuiceRipple({ index, scrollYProgress }: { index: number, scrollYProgress: any }) {
  const width = useTransform(scrollYProgress, [0, 1], [200 + index * 100, 1200 + index * 200]);
  const height = useTransform(scrollYProgress, [0, 1], [200 + index * 100, 1200 + index * 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6 - index * 0.1, 0]);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/20 dark:border-red-500/10"
      style={{ width, height, opacity, translateZ: 0 }}
    />
  );
}
