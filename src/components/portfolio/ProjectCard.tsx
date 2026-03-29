import { useState, memo, useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Project } from "../../types/content";
import { useProjectPreviewLoop } from "../../hooks/useProjectPreviewLoop";
import { ProjectMetaOverlay } from "./ProjectMetaOverlay";
import { usePreview } from "../../context/PreviewContext";
import { cn } from "../../lib/utils";

interface ProjectCardProps {
  item: Project;
  index: number;
  onSelect: (project: Project) => void;
}

export const ProjectCard = memo(({ item, index, onSelect }: ProjectCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { activePreviewId, requestPreview, clearPreview } = usePreview();
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  // Derive isActive from the centralized context
  const isActive = activePreviewId === item.id;

  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "400px", threshold: 0.01 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const {
    isVideoPlaying,
    videoRef,
    handleLoadedMetadata,
    handleVideoError,
    handleVideoEnded,
    isVideoActive,
    previewVideo,
    isHoverSupported,
  } = useProjectPreviewLoop(item, isInView, isActive);

  const handleMouseEnter = useCallback(() => {
    if (isHoverSupported) {
      requestPreview(item.id);
    }
  }, [isHoverSupported, item.id, requestPreview]);

  const handleMouseLeave = useCallback(() => {
    if (isHoverSupported) {
      clearPreview(item.id);
    }
  }, [isHoverSupported, item.id, clearPreview]);

  return (
    <motion.article 
      ref={cardRef as any}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className="group relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(item)}
    >
      <motion.div 
        className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl bg-bg-secondary border border-border shadow-sm"
        whileHover={shouldReduceMotion || !isHoverSupported ? {} : { scale: 1.03, y: -4 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Poster Image */}
        <motion.img
          src={`/assets/work/${item.folder}/${item.poster}`}
          alt={item.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isActive && isVideoPlaying ? "opacity-0" : "opacity-100"
          )}
          referrerPolicy="no-referrer"
        />

        {/* Video Layer */}
        {isVideoActive && (
          <video
            ref={videoRef}
            src={previewVideo}
            muted
            playsInline
            loop
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleVideoError}
            onEnded={handleVideoEnded}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Subtle Play Indicator for Video Projects */}
        {item.assets.some(a => a.type === 'video') && !isActive && (
          <div className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Overlay with Title & Category */}
        <ProjectMetaOverlay item={item} />
      </motion.div>
    </motion.article>
  );
});

ProjectCard.displayName = "ProjectCard";
