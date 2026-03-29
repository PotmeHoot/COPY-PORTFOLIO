import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Send, CheckCircle2 } from "lucide-react";
import { FADE_UP_VARIANTS, DEFAULT_TRANSITION } from "../constants/motion";
import { PillLabel } from "./ui/PillLabel";
import { useSiteContent } from "../hooks/useSiteContent";
import { SectionWrapper } from "./ui/SectionWrapper";
import { cn } from "../lib/utils";

export const Contact = () => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useSiteContent();
  const { contact, settings } = content;
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", message: "" });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <SectionWrapper id="contact" className="bg-bg-primary overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
        {/* Left Column: Content */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : FADE_UP_VARIANTS.initial}
          whileInView={FADE_UP_VARIANTS.animate}
          viewport={{ once: true }}
          transition={DEFAULT_TRANSITION}
        >
          <PillLabel className="mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {contact.status}
          </PillLabel>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            {contact.title} <span className="text-text-muted">{contact.highlight}</span>
          </h2>
          
          <p className="text-xl text-text-secondary leading-relaxed mb-12 max-w-xl">
            {contact.description}
          </p>

          <div className="space-y-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted block mb-4">
                {contact.directLabel}
              </span>
              <a 
                href={`mailto:${settings.email}`} 
                className="text-2xl md:text-3xl font-bold hover:text-accent transition-colors break-all"
              >
                {settings.email}
              </a>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted block mb-6">
                {contact.socialLabel}
              </span>
              <div className="flex flex-wrap gap-x-12 gap-y-6">
                {contact.socials.map((social) => (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-lg font-bold text-text-secondary hover:text-accent transition-colors"
                  >
                    <span>{social.name}</span>
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ ...DEFAULT_TRANSITION, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-bg-secondary/50 backdrop-blur-sm p-8 md:p-12 rounded-[32px] border border-border">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
                  {contact.form.nameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder={contact.form.namePlaceholder}
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-4 px-1 text-lg focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
                  {contact.form.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder={contact.form.emailPlaceholder}
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-4 px-1 text-lg focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
                  {contact.form.messageLabel}
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder={contact.form.messagePlaceholder}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-4 px-1 text-lg focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/30 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={cn(
                  "w-full group relative flex items-center justify-center gap-3 py-6 rounded-2xl font-bold text-xl transition-all overflow-hidden",
                  isSubmitted 
                    ? "bg-green-500 text-white" 
                    : "bg-accent text-white hover:bg-accent-hover shadow-xl shadow-accent/20 active:scale-[0.98]"
                )}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>{contact.form.successMessage}</span>
                  </>
                ) : (
                  <>
                    <span>{contact.form.submitLabel}</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
