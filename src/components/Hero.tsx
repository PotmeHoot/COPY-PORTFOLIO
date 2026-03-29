import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";
import { FADE_UP_VARIANTS, DEFAULT_TRANSITION } from "../constants/motion";

import { Button } from "./ui/Button";
import { PillLabel } from "./ui/PillLabel";
import { Asset } from "./ui/Asset";

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useSiteContent();
  const { hero } = content;

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 md:pt-0 md:pb-0 px-6 overflow-hidden bg-bg-primary">
      {/* Background: Subtle Grid */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="section-container z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Content */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 0 } : FADE_UP_VARIANTS.initial}
            animate={FADE_UP_VARIANTS.animate}
            transition={DEFAULT_TRANSITION}
            className="flex flex-col items-start"
          >
            <PillLabel className="mb-8 bg-accent/5 border-accent/10 text-accent">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {hero.availabilityLabel}
            </PillLabel>
            
            <div className="mb-6">
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.4em] text-text-muted block mb-4">
                {hero.eyebrow}
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-text-primary mb-6 leading-[1.05] md:leading-[0.95] font-display">
                {hero.title}
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-text-secondary max-w-xl mb-10 md:mb-12 leading-relaxed font-normal">
              {hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto">
              <Button href={hero.ctaPrimary.href} variant="primary" className="w-full sm:w-auto group">
                {hero.ctaPrimary.label} 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              
              <Button href={hero.ctaSecondary.href} variant="secondary" className="w-full sm:w-auto group border-border">
                <Mail className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors duration-200" />
                {hero.ctaSecondary.label}
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8 w-full max-w-md">
              {hero.stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-xl md:text-2xl font-bold text-text-primary mb-0.5">{stat.value}</div>
                  <div className="text-[9px] uppercase tracking-widest text-text-muted font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ ...DEFAULT_TRANSITION, delay: 0.2 }}
            className="relative aspect-square lg:aspect-[4/5] w-full max-w-2xl mx-auto lg:mx-0"
          >
            <div className="absolute inset-0 bg-accent/5 rounded-3xl -rotate-3 -z-10" />
            <div className="absolute inset-0 bg-bg-secondary rounded-3xl border border-border overflow-hidden shadow-2xl shadow-accent/5">
              <Asset 
                src={hero.backgroundImage}
                alt="Juraj Žáček Visual"
                loading="eager"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                containerClassName="w-full h-full"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 p-4 glass rounded-2xl shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Specialist</div>
                  <div className="text-xs font-bold text-text-primary">Motion + AI + AR</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-6 flex items-center gap-4 text-text-muted hidden lg:flex"
      >
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
        <span className="text-[10px] uppercase tracking-widest font-bold vertical-text rotate-180">{hero.scrollLabel}</span>
      </motion.div>
    </section>
  );
};
