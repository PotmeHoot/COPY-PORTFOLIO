import { motion, useReducedMotion } from "motion/react";
import { SectionHeader } from "./ui/SectionHeader";
import { CardShell } from "./ui/CardShell";
import { SectionWrapper } from "./ui/SectionWrapper";
import { useSiteContent } from "../hooks/useSiteContent";
import { Icon } from "./ui/Icon";
import { FADE_UP_VARIANTS, DEFAULT_TRANSITION } from "../constants/motion";

export const Collaboration = () => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useSiteContent();
  const { collaboration } = content;

  return (
    <SectionWrapper className="bg-bg-secondary">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHeader 
          eyebrow={collaboration.eyebrow}
          title={collaboration.title}
          description={collaboration.description}
          centered
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collaboration.steps.sort((a, b) => a.order - b.order).map((step, i) => (
            <motion.div 
              key={step.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                delay: shouldReduceMotion ? 0 : i * 0.05 
              }}
            >
              <CardShell className="group h-full flex flex-col items-center text-center p-8 md:p-10">
                <div className="w-16 h-16 rounded-full bg-bg-primary border border-border flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <Icon name={step.icon} className="w-8 h-8" />
                </div>
                
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted mb-4">{collaboration.stepLabel} 0{i + 1}</div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-text-primary transition-colors">{step.title}</h3>
                <p className="text-sm text-text-secondary transition-colors leading-relaxed">
                  {step.description}
                </p>
              </CardShell>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
};
