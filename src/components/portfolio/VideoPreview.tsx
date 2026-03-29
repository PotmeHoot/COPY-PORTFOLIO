import { motion } from "motion/react";
import { RefObject } from "react";
import { VideoPlaceholder } from "./ProjectPlaceholders";
import { Asset } from "../ui/Asset";

import { PreviewState } from "../../hooks/useProjectPreviewLoop";

interface VideoPreviewProps {
  src: string;
  poster?: string;
  webpPoster?: string;
  isVisible: boolean;
  previewState: PreviewState;
  onLoadedMetadata: () => void;
  onError: () => void;
  onEnded: () => void;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export const VideoPreview = ({
  src,
  poster,
  webpPoster,
  isVisible,
  previewState,
  onLoadedMetadata,
  onError,
  onEnded,
  videoRef,
}: VideoPreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(0px)", scale: 1 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? ["blur(4px)", "blur(0px)"] : "blur(0px)",
        scale: isVisible ? 1.05 : 1,
      }}
      transition={{
        opacity: { duration: 0.5 },
        filter: { duration: 0.4 },
        scale: { duration: 12, ease: "linear" },
      }}
      style={{ 
        willChange: "opacity, filter, transform",
        backgroundColor: "transparent" 
      }}
      className="absolute inset-0"
    >
      <Asset
        ref={videoRef}
        src={src}
        poster={poster}
        webpSrc={webpPoster}
        alt="Project Preview Video"
        className="w-full h-full object-cover"
        containerClassName="w-full h-full"
        onLoad={onLoadedMetadata}
        onError={onError}
        onEnded={onEnded}
        errorFallback={<VideoPlaceholder className="opacity-100" />}
        autoPlay={isVisible}
        muted
        loop={false}
        playsInline
        preload={previewState === 'idle' ? 'none' : 'metadata'}
      />
    </motion.div>
  );
};
