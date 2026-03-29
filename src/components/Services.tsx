import { motion, useReducedMotion } from "motion/react";
import { useSiteContent } from "../hooks/useSiteContent";
import { FADE_UP_VARIANTS, DEFAULT_TRANSITION } from "../constants/motion";
import { Icon } from "./ui/Icon";
import { SectionHeader } from "./ui/SectionHeader";
import { CardShell } from "./ui/CardShell";
import { SectionWrapper } from "./ui/SectionWrapper";

export const Services = () => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useSiteContent();
  const { services } = content;

  return (
    <SectionWrapper>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/[0.03] rounded-full blur-[120px] -z-10" />
      
      <motion.div
        variants={FADE_UP_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={DEFAULT_TRANSITION}
      >
        <SectionHeader 
          eyebrow={services.eyebrow}
          title={services.title}
          description={services.description}
          centered
        />
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.items.sort((a, b) => a.order - b.order).map((service, i) => {
            return (
              <motion.div 
                key={service.id}
                variants={FADE_UP_VARIANTS}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ 
                  ...DEFAULT_TRANSITION, 
                  delay: shouldReduceMotion ? 0 : i * 0.05 
                }}
              >
                <CardShell className="group h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-bg-primary flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <Icon name={service.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {service.description}
                  </p>
                </CardShell>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </SectionWrapper>
  );
};
