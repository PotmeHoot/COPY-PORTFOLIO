import { motion, useReducedMotion } from "motion/react";
import { useSiteContent } from "../hooks/useSiteContent";
import { FADE_UP_VARIANTS, DEFAULT_TRANSITION } from "../constants/motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { Linkedin, Video, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

export const About = () => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useSiteContent();
  const { about, contact } = content;

  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/jrjzck/", icon: Linkedin },
    { name: "TikTok", url: "https://www.tiktok.com/@p0tm3_h00t", icon: Video },
  ];

  return (
    <SectionWrapper id="about" className="bg-white" containerClassName="max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
        
        {/* Left Column: Image & Socials */}
        <motion.div 
          className="lg:col-span-5 space-y-12"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={DEFAULT_TRANSITION}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-bg-secondary group">
            <img 
              src="https://picsum.photos/seed/designer/800/1000" 
              alt="Juraj Žáček"
              className="w-full h-full object-cover grayscale transition-all duration-700 ease-out scale-105 group-hover:grayscale-0 group-hover:scale-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted">Connect</h4>
            <div className="flex flex-col gap-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group py-4 border-b border-border hover:border-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <link.icon className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                    <span className="text-lg font-medium text-text-primary">{link.name}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Content */}
        <motion.div 
          className="lg:col-span-7 space-y-16 md:space-y-24"
          initial={shouldReduceMotion ? { opacity: 0 } : FADE_UP_VARIANTS.initial}
          whileInView={FADE_UP_VARIANTS.animate}
          viewport={{ once: true }}
          transition={DEFAULT_TRANSITION}
        >
          {/* Intro */}
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">{about.eyebrow}</span>
              <h2 className="text-4xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1]">
                {about.title}
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-medium">
              {about.description}
            </p>
          </div>

          {/* Experience & Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Experience */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted">{about.experienceEyebrow}</h4>
                <div className="h-px w-8 bg-border" />
              </div>
              <div className="space-y-10">
                {about.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-2">
                    <h5 className="text-lg font-bold text-text-primary">{exp.title}</h5>
                    <p className="text-text-secondary leading-relaxed">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills/Tools */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted">{about.toolsEyebrow}</h4>
                <div className="h-px w-8 bg-border" />
              </div>
              <div className="space-y-10">
                {about.tools.map((tool, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-lg font-bold text-text-primary">{tool.name}</h5>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-accent">{tool.level}</span>
                    </div>
                    <p className="text-text-secondary leading-relaxed text-sm">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expertise List (Horizontal) */}
          <div className="pt-16 border-t border-border space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted">{about.expertiseLabel}</h4>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {about.expertise.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-accent" />
                  <span className="text-sm font-bold text-text-primary uppercase tracking-wider">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
