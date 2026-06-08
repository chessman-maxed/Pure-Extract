"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import { useRef, useState, useEffect } from "react";

interface StorySectionProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

export function StorySection({ children, align = "left", className }: StorySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Fade in as it enters, stay visible, then fade out as it leaves
  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [0, 1, 1, 0]);
  
  // Move up continuously to simulate a path
  const y = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [120, 0, 0, -120]);
  
  // Drift slightly inwards then outwards (normalized)
  const xRaw = useTransform(
    scrollYProgress, 
    [0.1, 0.4, 0.6, 0.9], 
    align === "left" ? [-1, 0, 0, -1] : align === "right" ? [1, 0, 0, 1] : [0, 0, 0, 0]
  );

  const drift = isMobile ? 20 : 80;
  const x = useTransform(xRaw, (val) => val * drift);

  // Add scale animation
  const scale = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [0.85, 1, 1, 0.85]);

  // Text reveal animation
  const clipPath = useTransform(
    scrollYProgress,
    [0.2, 0.45],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );

  return (
    <div
      ref={ref}
      className={cn(
        "h-[120vh] w-full flex items-center px-8 md:px-24",
        align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center",
        className
      )}
    >
      <motion.div
        style={{ opacity, y, x, scale, clipPath, translateZ: 0 }}
        className={cn(
          align === "center" ? "w-full flex flex-col items-center text-center" : "max-w-xl"
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}
