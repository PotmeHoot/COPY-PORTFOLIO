import { useState, lazy, Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSiteContent } from "../hooks/useSiteContent";
import { FADE_UP_VARIANTS, DEFAULT_TRANSITION } from "../constants/motion";
import { ProjectCard } from "./portfolio/ProjectCard";
import { SectionHeader } from "./ui/SectionHeader";
import { SectionWrapper } from "./ui/SectionWrapper";
import { Project } from "../types/content";
import { PreviewProvider } from "../context/PreviewContext";

const ProjectDetail = lazy(() => import("./portfolio/ProjectDetail").then(m => ({ default: m.ProjectDetail })));

export const Portfolio = () => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useSiteContent();
  const { projects, hero, portfolio } = content;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter out hidden projects and sort by order
  const visibleProjects = projects
    .filter(p => p.status !== 'hidden')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Extract unique clients for the "Trusted by" section
  const clients = Array.from(new Set(projects.map(p => p.client))).filter(c => c && c !== "Personal / R&D");

  return (
    <>
      <SectionWrapper id="work" className="bg-bg-primary">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-accent/[0.02] rounded-full blur-[120px] -z-10" />
        
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : FADE_UP_VARIANTS.initial}
          whileInView={FADE_UP_VARIANTS.animate}
          viewport={{ once: true, margin: "-100px" }}
          transition={DEFAULT_TRANSITION}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-32 gap-10"
        >
          <div className="max-w-2xl">
            <SectionHeader 
              eyebrow={portfolio.eyebrow}
              title={content.navigation.find(n => n.id === 'work')?.label || "Selected Work"}
              description={portfolio.description}
              className="!mb-0"
            />
          </div>
          
          {/* Client Tags */}
          <div className="flex flex-col gap-4">
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-text-muted">{portfolio.trustedByLabel}</span>
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-[11px] md:text-xs font-bold uppercase tracking-widest text-text-secondary">
              {clients.map((client) => (
                <span key={client} className="hover:text-accent transition-colors cursor-default border-b border-transparent hover:border-accent/20 pb-1">{client}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Portfolio Grid */}
        <PreviewProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 lg:gap-20">
            {visibleProjects.map((item, i) => (
              <ProjectCard 
                key={item.id} 
                item={item} 
                index={i} 
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        </PreviewProvider>
      </SectionWrapper>

      {/* Project Detail Modal */}
      <Suspense fallback={null}>
        {selectedProject && (
          <ProjectDetail 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </Suspense>
    </>
  );
};
