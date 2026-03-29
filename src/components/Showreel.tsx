import { motion } from "motion/react";
import { Maximize2, Volume2 } from "lucide-react";
import { SectionWrapper } from "./ui/SectionWrapper";
import { useSiteContent } from "../hooks/useSiteContent";
import { Asset } from "./ui/Asset";
import { VideoPlaceholder } from "./portfolio/ProjectPlaceholders";
import { useState, useRef } from "react";

export const Showreel = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const { content } = useSiteContent();
  const { showreel } = content;

  return (
    <SectionWrapper id="showreel" className="bg-bg-secondary/50">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Video Container - Dominant on Desktop, First on Mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-8 relative aspect-video group"
        >
          <div className="absolute -inset-6 bg-white/[0.01] rounded-[48px] blur-3xl -z-10 group-hover:bg-white/[0.03] transition-colors duration-1000" />
          
          <div className="relative w-full h-full rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/10 bg-black shadow-2xl">
            {videoError ? (
              <VideoPlaceholder />
            ) : (
              <div className="relative w-full h-full">
                <Asset
                  ref={videoRef}
                  src={showreel.videoUrl}
                  poster={showreel.poster}
                  alt={`${showreel.title} - Showreel`}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  autoPlay
                  onError={() => setVideoError(true)}
                />
                
                {/* Subtle Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <Volume2 className="w-5 h-5 text-white/60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-1">{showreel.videoLabel}</span>
                        <span className="text-sm font-bold text-white">{showreel.eyebrow}</span>
                      </div>
                    </div>
                    <Maximize2 className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Text Content - Supportive on Desktop, Below on Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-4 flex flex-col justify-center"
        >
          <div className="section-eyebrow mb-6 lg:mb-8">
            <div className="section-eyebrow-line" />
            {showreel.eyebrow}
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6 lg:mb-8 tracking-tighter leading-[1.1]">
            {showreel.title}
          </h2>
          
          <p className="text-base md:text-lg text-text-secondary font-medium leading-relaxed mb-10 lg:mb-12 max-w-xl lg:max-w-none">
            {showreel.description}
          </p>

          <div className="space-y-4 lg:space-y-5">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-text-muted block mb-2">{showreel.highlightsLabel}</span>
            <div className="flex flex-wrap lg:flex-col gap-3 lg:gap-4">
              {showreel.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-4 px-4 py-2 lg:px-0 lg:py-0 rounded-full bg-accent/5 lg:bg-transparent border border-accent/10 lg:border-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                  <span className="text-xs md:text-sm font-semibold text-text-secondary tracking-wide">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
