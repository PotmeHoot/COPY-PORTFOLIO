import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";
import { FADE_UP_VARIANTS, SCALE_VARIANTS, DEFAULT_TRANSITION } from "../constants/motion";
import { Icon } from "./ui/Icon";
import { SectionHeader } from "./ui/SectionHeader";
import { CardShell } from "./ui/CardShell";
import { SectionWrapper } from "./ui/SectionWrapper";

export const Expertise = () => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useSiteContent();
  const { about } = content;

  return (
    <SectionWrapper className="border-t border-border">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={shouldReduceMotion ? { opacity: 0 } : FADE_UP_VARIANTS.initial}
        whileInView={FADE_UP_VARIANTS.animate}
        viewport={{ once: true, margin: "-100px" }}
        transition={DEFAULT_TRANSITION}
        className="grid lg:grid-cols-2 gap-16 md:gap-32"
      >
        {/* Left: Experience */}
        <div>
          <SectionHeader 
            eyebrow={about.experienceEyebrow}
            title={about.experienceTitle}
            className="!mb-12"
          />
          <div className="space-y-8">
            {about.experience.map((item, i) => {
              return (
                <motion.div 
                  key={item.title}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...DEFAULT_TRANSITION, duration: 0.6, delay: shouldReduceMotion ? 0 : i * 0.05 }}
                  className="flex items-start gap-6 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-muted group-hover:bg-accent group-hover:text-white transition-all duration-500 shrink-0">
                    <Icon name={item.icon} className="w-4 h-4" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-base font-bold mb-1 group-hover:text-text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Tools */}
        <div>
          <SectionHeader 
            eyebrow={about.toolsEyebrow}
            title={about.toolsTitle}
            className="!mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {about.tools.map((tool, i) => (
              <motion.div 
                key={tool.name}
                initial={shouldReduceMotion ? { opacity: 0 } : SCALE_VARIANTS.initial}
                whileInView={SCALE_VARIANTS.animate}
                viewport={{ once: true }}
                transition={{ ...DEFAULT_TRANSITION, duration: 0.6, delay: shouldReduceMotion ? 0 : i * 0.05 }}
              >
                <CardShell variant="premium" className="hover:bg-accent/5 group h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[9px] uppercase tracking-widest font-bold text-text-muted">{tool.level}</div>
                    <CheckCircle2 className="w-3 h-3 text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <h4 className="text-base font-bold mb-1">{tool.name}</h4>
                  <p className="text-xs text-text-muted leading-tight">{tool.desc}</p>
                </CardShell>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
};
