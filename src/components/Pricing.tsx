import { motion, useReducedMotion } from "motion/react";
import { useSiteContent } from "../hooks/useSiteContent";
import { FADE_UP_VARIANTS, DEFAULT_TRANSITION } from "../constants/motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { SectionHeader } from "./ui/SectionHeader";
import { cn } from "../lib/utils";
import { ArrowRight } from "lucide-react";

export const Pricing = () => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useSiteContent();
  const { pricing, settings } = content;

  if (!pricing) return null;

  return (
    <SectionWrapper id="pricing" className="bg-bg-secondary" containerClassName="max-w-7xl">
      <SectionHeader 
        eyebrow={pricing.eyebrow}
        title={pricing.title}
        description={pricing.description}
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {pricing.plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={shouldReduceMotion ? { opacity: 0 } : FADE_UP_VARIANTS.initial}
            whileInView={FADE_UP_VARIANTS.animate}
            viewport={{ once: true }}
            transition={{ ...DEFAULT_TRANSITION, delay: idx * 0.1 }}
            className={cn(
              "relative flex flex-col p-8 md:p-10 bg-white rounded-2xl border transition-all duration-250",
              plan.featured 
                ? "border-accent shadow-xl shadow-accent/5 lg:scale-105 z-10" 
                : "border-border hover:border-accent/30 hover:-translate-y-1 hover:shadow-sm"
            )}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-text-primary mb-2">{plan.title}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-text-primary tracking-tight">{plan.price}</span>
                <span className="text-text-muted text-sm">/projekt</span>
              </div>
            </div>

            <p className="text-text-secondary leading-relaxed mb-10 flex-grow">
              {plan.description}
            </p>

            <a
              href={`mailto:${settings.email}?subject=Inquiry regarding ${plan.title} package`}
              className={cn(
                "w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all group",
                plan.featured
                  ? "bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20"
                  : "bg-bg-secondary text-text-primary hover:bg-border"
              )}
            >
              <span>{plan.cta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};
