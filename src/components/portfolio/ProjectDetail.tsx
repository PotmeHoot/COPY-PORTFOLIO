import { motion, AnimatePresence } from "motion/react";
import { X, ArrowLeft, Play, Image as ImageIcon } from "lucide-react";
import { Project } from "../../types/content";
import { Asset } from "../ui/Asset";
import { PillLabel } from "../ui/PillLabel";
import { useSiteContent } from "../../hooks/useSiteContent";
import { useEffect } from "react";
import { cn } from "../../lib/utils";

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetail = ({ project, onClose }: ProjectDetailProps) => {
  const { content } = useSiteContent();
  const { portfolio } = content;

  // Prevent scrolling when detail is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [project]);

  if (!project) return null;

  const isMotionOrAR = project.category.toLowerCase().includes('motion') || 
                       project.category.toLowerCase().includes('ar') || 
                       project.category.toLowerCase().includes('ai');

  const heroAsset = project.assets.find(a => a.type === 'video') || project.assets[0];
  const heroUrl = heroAsset ? `/assets/work/${project.folder}/${heroAsset.file}` : `/assets/work/${project.folder}/${project.poster}`;
  const isHeroVideo = heroAsset?.type === 'video';

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-bg-primary overflow-y-auto scrollbar-hide"
        >
          {/* Navigation Bar */}
          <div className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-border">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{portfolio.backToProjectsLabel}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-bg-secondary hover:bg-border text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
 
          {/* Hero Section */}
          <section className="relative w-full aspect-video md:aspect-[21/9] bg-bg-secondary overflow-hidden">
            {isHeroVideo ? (
              <Asset
                src={heroUrl}
                alt={project.title}
                autoPlay
                muted
                loop
                playsInline
                loading="eager"
                preload="auto"
                className="w-full h-full object-cover"
              />
            ) : (
              <Asset
                src={`/assets/work/${project.folder}/${project.poster}`}
                webpSrc={project.webpPoster ? `/assets/work/${project.folder}/${project.webpPoster}` : undefined}
                alt={project.title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <PillLabel className="bg-white border-border mb-4">
                    {project.category}
                  </PillLabel>
                  <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-text-primary mb-6 tracking-tight">
                    {project.title}
                  </h1>
                </motion.div>
              </div>
            </div>
          </section>
 
          {/* Content Section */}
          <section className="max-w-7xl mx-auto px-6 py-16 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
              {/* Info Column */}
              <div className="lg:col-span-4 space-y-12">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted">{portfolio.projectDetailsLabel}</h2>
                    <div className="h-px w-8 bg-border" />
                  </div>
                  
                  <div className="space-y-6">
                    {project.client && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">{portfolio.clientLabel}</span>
                        <span className="text-lg text-text-primary font-medium">{project.client}</span>
                      </div>
                    )}
                    {project.agency && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">{portfolio.agencyLabel}</span>
                        <span className="text-lg text-text-primary font-medium">{project.agency}</span>
                      </div>
                    )}
                    {project.year && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">{portfolio.yearLabel}</span>
                        <span className="text-lg text-text-primary font-medium">{project.year}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted">{portfolio.descriptionLabel}</h2>
                    <div className="h-px w-8 bg-border" />
                  </div>
                  <p className="text-xl text-text-secondary leading-relaxed font-medium">
                    {project.shortDescription}
                  </p>
                </div>

                {project.process && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted">{portfolio.processLabel}</h2>
                      <div className="h-px w-8 bg-border" />
                    </div>
                    <p className="text-lg text-text-secondary leading-relaxed">
                      {project.process}
                    </p>
                  </div>
                )}
              </div>
 
              {/* Gallery Column */}
              <div className="lg:col-span-8 space-y-16 md:space-y-24">
                <div className={cn(
                  "grid gap-12 md:gap-20",
                  isMotionOrAR ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                )}>
                  {project.assets.map((asset, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "relative overflow-hidden bg-bg-secondary border border-border",
                        isMotionOrAR ? "rounded-xl" : "rounded-lg aspect-square md:aspect-auto"
                      )}
                    >
                      {asset.type === 'video' ? (
                        <div className="relative group">
                          <Asset
                            src={`/assets/work/${project.folder}/${asset.file}`}
                            alt={`${project.title} video ${index + 1}`}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-auto"
                          />
                          <div className="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                            <Play className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative group">
                          <Asset
                            src={`/assets/work/${project.folder}/${asset.file}`}
                            webpSrc={asset.webpFile ? `/assets/work/${project.folder}/${asset.webpFile}` : undefined}
                            srcSet={asset.srcSet}
                            alt={`${project.title} asset ${index + 1}`}
                            className="w-full h-auto"
                          />
                          <div className="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
 
          {/* Footer CTA */}
          <footer className="bg-bg-secondary border-t border-border">
            <div className="max-w-7xl mx-auto px-6 py-32 md:py-48 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-text-muted">{portfolio.nextProjectLabel}</span>
                  <h2 className="text-4xl md:text-6xl font-bold text-text-primary tracking-tight">
                    {portfolio.interestedLabel}
                  </h2>
                </div>
                
                <a
                  href={`mailto:${content.settings.email}?subject=Inquiry regarding ${project.title}`}
                  className="inline-flex items-center gap-6 px-10 py-5 rounded-full bg-accent text-white font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-accent/20 group"
                >
                  <span>{portfolio.startConversationLabel}</span>
                  <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="pt-12">
                  <button
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-muted hover:text-accent transition-colors"
                  >
                    {portfolio.backToProjectsLabel}
                  </button>
                </div>
              </motion.div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
