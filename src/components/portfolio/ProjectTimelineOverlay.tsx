import { memo } from "react";
import { PreviewTimeline } from "./PreviewTimeline";

interface ProjectTimelineOverlayProps {
  isImageSequenceActive: boolean;
  isVideoActive: boolean;
  previewImages: string[];
  activeSegmentIndex: number;
  activeSegmentProgress: number;
  videoDuration: number;
  isHoverSupported: boolean;
}

export const ProjectTimelineOverlay = memo(({
  isImageSequenceActive,
  isVideoActive,
  previewImages,
  activeSegmentIndex,
  activeSegmentProgress,
  videoDuration,
  isHoverSupported
}: ProjectTimelineOverlayProps) => {
  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Layer 4: Segmented Timeline (Image Only) */}
      <PreviewTimeline
        type="image"
        previewImages={previewImages}
        activeSegmentIndex={activeSegmentIndex}
        activeSegmentProgress={activeSegmentProgress}
        isVisible={isImageSequenceActive}
        isHoverSupported={isHoverSupported}
      />

      {/* Layer 5: Video Progress (Video Only) */}
      <PreviewTimeline
        type="video"
        videoDuration={videoDuration}
        isVisible={isVideoActive}
      />
    </div>
  );
});

ProjectTimelineOverlay.displayName = "ProjectTimelineOverlay";
