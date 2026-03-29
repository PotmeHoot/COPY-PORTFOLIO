import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Video, QrCode, ExternalLink } from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";
import { FADE_UP_VARIANTS, SCALE_VARIANTS, DEFAULT_TRANSITION } from "../constants/motion";
import { PillLabel } from "./ui/PillLabel";
import { Asset } from "./ui/Asset";

import { SectionWrapper } from "./ui/SectionWrapper";

export const ARShowcase = () => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useSiteContent();
  const { arItems, arShowcase } = content;

  // Filter out hidden filters and sort by order
  const visibleFilters = arItems
    .filter(f => f.status !== 'hidden')
    .sort((a, b) => a.order - b.order);

  return (
    <SectionWrapper className="bg-bg-primary" showGlow={false}>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-accent/5 rounded-full blur-[120px] -z-10" />
      
      <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center mb-16 md:mb-20">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={DEFAULT_TRANSITION}
          >
            <PillLabel className="bg-accent/10 border-accent/20 text-accent mb-6">
              <Sparkles className="w-3 h-3" />
              {arShowcase.eyebrow}
            </PillLabel>
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 tracking-tight text-text-primary">{arShowcase.title}</h2>
            <p className="section-description mb-8">
              {arShowcase.description}
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3 text-text-secondary">
                <Video className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">{arShowcase.platformLabel}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : SCALE_VARIANTS.initial}
            whileInView={SCALE_VARIANTS.animate}
            viewport={{ once: true }}
            transition={DEFAULT_TRANSITION}
            className="grid grid-cols-2 gap-4"
          >
            {visibleFilters.map((filter, i) => (
              <div key={filter.id} className="relative aspect-[2/3] card-base card-hover group border border-border">
                <Asset 
                  src={filter.previewImage || ""} 
                  alt={`${filter.title} AR filter for ${filter.platform}`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  loading="lazy"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[8px] uppercase tracking-widest font-bold text-text-muted mb-1">{filter.platform}</div>
                  <div className="text-sm font-bold text-text-primary">{filter.title}</div>
                  {filter.status === 'coming_soon' && (
                    <div className="text-[8px] uppercase tracking-widest font-bold text-accent mt-1">{arShowcase.comingSoonLabel}</div>
                  )}
                </div>
                
                {filter.link && (
                  <a 
                    href={filter.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md border border-border rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <ExternalLink className="w-5 h-5 text-text-secondary" />
                  </a>
                )}
                
                {filter.qrCode && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md border border-border rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <QrCode className="w-5 h-5 text-text-secondary" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Horizontal Feature List */}
        <div className="grid md:grid-cols-3 gap-8 border-t border-border pt-16">
          {arShowcase.features.map((feat, i) => (
            <div key={i}>
              <h3 className="text-lg font-bold mb-2 text-accent">{feat.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
};
