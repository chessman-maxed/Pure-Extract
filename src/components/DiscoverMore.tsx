"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

const products = [
  { 
    id: 4, 
    name: "Exotic Dragonfruit", 
    image: "/dragonfruit.png", 
    desc: "Vibrant Extract",
    price: "₹249",
    longDesc: "A vibrant blend of pink dragonfruit and lychee. Exotic, refreshing, and naturally energizing."
  },
  { 
    id: 5, 
    name: "Ruby Pomegranate", 
    image: "/pomegranate.png", 
    desc: "Revitalizing Extract",
    price: "₹219",
    longDesc: "Heart-healthy pomegranate extract with a tart, refreshing finish. Cold-pressed to preserve every nutrient."
  },
  { 
    id: 2, 
    name: "Golden Mango", 
    image: "/mango.png", 
    desc: "Tropical Extract",
    price: "₹149",
    longDesc: "Sun-ripened Alphonso mangoes blended for a rich, velvety texture. Pure tropical bliss in every drop."
  },
  { 
    id: 3, 
    name: "Fresh Watermelon", 
    image: "/watermelon.png", 
    desc: "Hydration Extract",
    price: "₹129",
    longDesc: "The ultimate thirst quencher. Ultra-fresh watermelon with a hint of mint for maximum hydration."
  },
  { 
    id: 1, 
    name: "Wild Blueberry", 
    image: "/blueberry.png", 
    desc: "Antioxidant Extract",
    price: "₹199",
    longDesc: "Pure, wild-harvested blueberries pressed at peak ripeness. A powerful antioxidant boost for your daily routine."
  },
  { 
    id: 6, 
    name: "Sun-kissed Pineapple", 
    image: "/pineapple.png", 
    desc: "Energy Extract",
    price: "₹179",
    longDesc: "Zesty Costa Rican pineapples with a touch of ginger. The perfect natural energy booster for your afternoon."
  }
];

interface Product {
  id: number;
  name: string;
  image: string;
  desc: string;
  price: string;
  longDesc: string;
}

function ProductModal({ product, onClose }: { product: Product, onClose: () => void }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    addToCart(product);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-6"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-zinc-900/90 border border-zinc-800 rounded-[2.5rem] overflow-y-auto max-h-[90vh] max-w-4xl w-full flex flex-col md:flex-row shadow-2xl backdrop-blur-md"
      >
        <div className="w-full md:w-1/2 aspect-[4/5] overflow-hidden group shrink-0">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </div>
        <div className="p-6 sm:p-8 md:p-14 flex flex-col justify-center w-full md:w-1/2 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all z-20"
          >
            <X size={24} />
          </button>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-red-500 font-bold mb-2 md:mb-3 uppercase tracking-[0.2em] text-xs md:text-sm">{product.desc}</p>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight">{product.name}</h3>
          </motion.div>
 
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 mb-6 md:mb-10 leading-relaxed text-base md:text-xl font-light"
          >
            {product.longDesc}
          </motion.p>
 
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 md:gap-6 pt-6 md:pt-8 border-t border-zinc-800/50 mt-auto"
          >
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Total Price</span>
              <span className="text-3xl md:text-5xl font-black text-white">{product.price}</span>
            </div>
            <motion.button 
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0px 0px 0px rgba(220, 38, 38, 0)", "0px 0px 20px rgba(220, 38, 38, 0.4)", "0px 0px 0px rgba(220, 38, 38, 0)"]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-red-600 hover:bg-red-500 text-white px-10 py-4.5 rounded-2xl font-black text-lg transition-colors shadow-xl w-full sm:w-auto"
            >
              Add to Cart
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ExpandedGallery({ setIsExpanded, onProductClick }: { setIsExpanded: (val: boolean) => void, onProductClick: (p: Product) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Balanced sweep for zoomed-out cards: -78% is sufficient for 30vw cards
  const x = useTransform(scrollYProgress, [0, 0.9], ["0%", "-78%"]);

  return (
    <motion.div 
      key="gallery"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[800vh] bg-black relative"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-12 left-8 md:left-24 z-50 flex justify-between items-center w-[calc(100%-4rem)] md:w-[calc(100%-12rem)]"
        >
           <div className="flex flex-col">
              <span className="text-red-600 font-bold tracking-[0.4em] uppercase text-xs mb-2">The Collection</span>
              <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">Full Gallery</h2>
           </div>
           <button 
              onClick={() => setIsExpanded(false)}
              className="p-5 rounded-full bg-zinc-900 text-white hover:bg-red-600 transition-all border border-zinc-800 flex items-center justify-center group shadow-2xl"
           >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
           </button>
        </motion.div>

        {/* Zoomed out: Width reduced to 30vw (desktop) and 65vw (mobile) */}
        <motion.div style={{ x }} className="flex gap-16 px-[15vw] md:px-[25vw] items-center mt-20 w-[600vw] md:w-[350vw]">
          {products.map((product) => (
            <motion.div 
              layoutId={`product-container-${product.id}`}
              key={product.id} 
              className="w-[65vw] md:w-[30vw] flex-shrink-0 cursor-pointer group"
              onClick={() => onProductClick(product)}
            >
              <motion.div 
                layoutId={`product-image-${product.id}`}
                className="aspect-[4/5] bg-zinc-900 rounded-[3rem] overflow-hidden relative border border-zinc-800 shadow-2xl transition-all duration-700 group-hover:border-red-600/30"
              >
                 <motion.img 
                   layoutId={`img-${product.id}`}
                   src={product.image}
                   alt={`${product.name} Juice`}
                   className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-100"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent z-10 flex flex-col justify-end p-8 md:p-12">
                    <motion.h3 layoutId={`product-title-${product.id}`} className="text-2xl md:text-4xl font-black mb-3 text-white uppercase tracking-tighter leading-none">{product.name}</motion.h3>
                    <motion.p layoutId={`product-desc-${product.id}`} className="text-base md:text-lg text-zinc-400 font-light">{product.desc}</motion.p>
                 </div>
              </motion.div>
            </motion.div>
          ))}

          {/* Luxury Coming Soon Card */}
          <motion.div 
            className="w-[65vw] md:w-[30vw] flex-shrink-0 aspect-[4/5] bg-zinc-900/20 rounded-[3rem] border border-zinc-800 border-dashed flex flex-col items-center justify-center p-12 text-center backdrop-blur-xl"
          >
            <span className="text-zinc-600 font-bold tracking-[0.4em] uppercase text-xs mb-4">Discovery Phase</span>
            <h3 className="text-2xl md:text-4xl font-black mb-4 text-zinc-800 uppercase tracking-tighter">More Extracts</h3>
            <div className="w-12 h-px bg-zinc-800" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function DiscoverMore() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xTranslate = useTransform(scrollYProgress, [0, 1], ["50%", "-100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef} 
      id="discover" 
      className={cn(
        "relative z-20 bg-zinc-950 border-t border-zinc-900 transition-all duration-500",
        isExpanded ? "min-h-[800vh]" : "min-h-[100vh] overflow-hidden"
      )}
    >
      {/* Dynamic Background Animation: The Macro Sequence */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sticky top-0 h-screen">
        <motion.div 
          style={{ x: xTranslate, opacity }} 
          className="flex gap-40 px-[10vw] items-center h-full whitespace-nowrap"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-[25vw] font-black tracking-tighter text-white/5 uppercase leading-none outline-text">The Purity</h2>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-[25vw] font-black tracking-tighter text-red-600/5 uppercase leading-none">The Source</h2>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-[25vw] font-black tracking-tighter text-white/5 uppercase leading-none">The Result</h2>
          </div>
          <div className="w-96 h-96 rounded-full bg-red-600/10 blur-3xl" />
          <img src="/sequence/00150.png" className="w-[40vw] aspect-video object-cover opacity-5 rounded-[5rem] grayscale" alt="" />
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isExpanded ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="py-20 md:py-24 px-8 md:px-24 max-w-7xl mx-auto" // Reduced top padding
          >
            <div className="flex items-end justify-between mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Discover More</h2>
              <button 
                onClick={() => {
                  setIsExpanded(true);
                  // Snap will be handled by the ExpandedGallery's useEffect
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors"
              >
                View All <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <motion.div 
                  layoutId={`product-container-${product.id}`}
                  key={product.id} 
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <motion.div 
                    layoutId={`product-image-${product.id}`}
                    className="aspect-[4/5] bg-zinc-900 rounded-xl overflow-hidden mb-6 relative border border-zinc-800 transition-colors duration-500"
                  >
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"></div>
                     <motion.img 
                       layoutId={`img-${product.id}`}
                       src={product.image}
                       alt={`${product.name} Juice`}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                     />
                  </motion.div>
                  <motion.h3 layoutId={`product-title-${product.id}`} className="text-2xl font-medium mb-2 text-white transition-colors duration-500">{product.name}</motion.h3>
                  <motion.p layoutId={`product-desc-${product.id}`} className="text-zinc-500 transition-colors duration-500">{product.desc}</motion.p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <ExpandedGallery key="gallery-component" setIsExpanded={setIsExpanded} onProductClick={setSelectedProduct} />
        )}
      </AnimatePresence>
    </section>
  );
}
