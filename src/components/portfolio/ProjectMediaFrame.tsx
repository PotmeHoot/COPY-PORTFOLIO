import { motion } from "motion/react";
import { Asset } from "../ui/Asset";
import { ImagePlaceholder } from "./ProjectPlaceholders";
import { Project } from "../../types/content";

interface ProjectMediaFrameProps {
  poster?: string;
  webpPoster?: string;
  title: string;
  isIdle: boolean;
  isActive: boolean;
}

export const ProjectMediaFrame = ({ poster, webpPoster, title, isIdle, isActive }: ProjectMediaFrameProps) => {
  const fallback = <ImagePlaceholder />;

  return (
    <motion.div
      initial={false}
      animate={{ 
        opacity: isIdle ? 1 : 0,
        scale: isActive ? 1.02 : 1,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute inset-0 z-10"
    >
      {poster ? (
        <Asset
          src={poster}
          webpSrc={webpPoster}
          alt={title}
          className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-700"
          containerClassName="w-full h-full"
          errorFallback={fallback}
        />
      ) : fallback}
    </motion.div>
  );
};
