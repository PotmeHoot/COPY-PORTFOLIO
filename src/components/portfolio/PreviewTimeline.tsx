import { motion } from "motion/react";

interface PreviewTimelineProps {
  type: "image" | "video";
  previewImages?: string[];
  activeSegmentIndex?: number;
  activeSegmentProgress?: number;
  videoDuration?: number;
  isVisible: boolean;
  isHoverSupported?: boolean;
}

export const PreviewTimeline = ({
  type,
  previewImages = [],
  activeSegmentIndex = 0,
  activeSegmentProgress = 0,
  videoDuration = 10,
  isVisible,
  isHoverSupported = true,
}: PreviewTimelineProps) => {
  if (!isVisible) return null;

  if (type === "image" && previewImages.length >= 1) {
    return (
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
        {previewImages.map((_, idx) => (
          <div
            key={idx}
            className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/20 backdrop-blur-[1px]"
          >
            <motion.div
              className="h-full bg-white/90"
              initial={false}
              animate={{
                width:
                  idx < activeSegmentIndex
                    ? "100%"
                    : idx === activeSegmentIndex
                    ? (isHoverSupported ? `${activeSegmentProgress}%` : "100%")
                    : "0%",
              }}
              transition={{
                duration: idx === activeSegmentIndex ? (isHoverSupported ? 0.032 : 0.3) : 0.1,
                ease: "linear",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === "video") {
    // Use the actual video duration but cap it at 12s for the progress bar if it's longer
    const displayDuration = Math.min(videoDuration, 12);

    return (
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-[1px]">
          <motion.div
            className="h-full bg-white/90"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: displayDuration,
              ease: "linear",
              repeat: videoDuration > 12 ? 0 : Infinity,
            }}
          />
        </div>
      </div>
    );
  }

  return null;
};
