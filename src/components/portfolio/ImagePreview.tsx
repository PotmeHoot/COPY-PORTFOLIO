import { motion } from "motion/react";
import { Asset } from "../ui/Asset";
import { ImagePlaceholder } from "./ProjectPlaceholders";

import { PreviewState } from "../../hooks/useProjectPreviewLoop";

interface ImagePreviewProps {
  images: string[];
  activeSegmentIndex: number;
  isVisible: boolean;
  previewState: PreviewState;
  shouldReduceMotion: boolean;
  projectTitle: string;
  isHoverSupported: boolean;
}

export const ImagePreview = ({
  images,
  activeSegmentIndex,
  isVisible,
  previewState,
  shouldReduceMotion,
  projectTitle,
  isHoverSupported,
}: ImagePreviewProps) => {
  if (images.length === 0) return null;

  // Optimization: Only render the full sequence when actively previewing.
  // Otherwise, only render the first frame to "prepare" the visual.
  const renderedImages = previewState === 'previewing' ? images : [images[0]];

  return (
    <div className="absolute inset-0">
      {renderedImages.map((src, idx) => (
        <motion.div
          key={idx}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: isVisible && idx === activeSegmentIndex ? 1 : 0,
            scale: isVisible && idx === activeSegmentIndex ? 1.05 : 1,
          }}
          transition={{
            opacity: {
              duration: idx === 0 && activeSegmentIndex === 0 ? 0.4 : (isHoverSupported ? 1 : 0.4),
              ease: [0.22, 1, 0.36, 1],
            },
            scale: {
              duration: 12,
              ease: "linear",
            },
          }}
          style={{ willChange: "opacity, transform" }}
        >
          <Asset
            src={src}
            alt={`${projectTitle} - Preview ${idx + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
            containerClassName="w-full h-full"
            errorFallback={<ImagePlaceholder />}
          />
        </motion.div>
      ))}
    </div>
  );
};
