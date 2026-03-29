import { memo, RefObject } from "react";
import { Project } from "../../types/content";
import { ImagePreview } from "./ImagePreview";
import { VideoPreview } from "./VideoPreview";
import { ImagePlaceholder, VideoPlaceholder } from "./ProjectPlaceholders";

import { PreviewState } from "../../hooks/useProjectPreviewLoop";

interface ProjectInteractionPreviewProps {
  item: Project;
  isActive: boolean;
  previewState: PreviewState;
  isImageSequenceActive: boolean;
  isVideoActive: boolean;
  isVideoPlaying: boolean;
  activeSegmentIndex: number;
  shouldReduceMotion: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  handleLoadedMetadata: () => void;
  handleVideoError: () => void;
  handleVideoEnded: () => void;
  isHoverSupported: boolean;
  hasVideo: boolean;
  previewImages: string[];
  previewVideo?: string;
}

export const ProjectInteractionPreview = memo(({
  item,
  isActive,
  previewState,
  isImageSequenceActive,
  isVideoActive,
  isVideoPlaying,
  activeSegmentIndex,
  shouldReduceMotion,
  videoRef,
  handleLoadedMetadata,
  handleVideoError,
  handleVideoEnded,
  isHoverSupported,
  hasVideo,
  previewImages,
  previewVideo
}: ProjectInteractionPreviewProps) => {
  // Logic for placeholders based on type
  const normalizedCategory = item.category.toLowerCase();
  const isVideoType = normalizedCategory.includes("video") || normalizedCategory.includes("motion") || normalizedCategory.includes("ar");
  const isGraphicType = !isVideoType;

  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      {/* Image Sequence Preview Layer */}
      {previewImages.length > 0 && !hasVideo && (
        <ImagePreview
          images={previewImages}
          activeSegmentIndex={activeSegmentIndex}
          isVisible={isImageSequenceActive}
          previewState={previewState}
          shouldReduceMotion={shouldReduceMotion}
          projectTitle={item.title}
          isHoverSupported={isHoverSupported}
        />
      )}

      {/* Video Preview Layer */}
      {hasVideo && previewVideo && (
        <VideoPreview
          src={previewVideo}
          poster={`/assets/work/${item.folder}/${item.poster}`}
          webpPoster={item.webpPoster ? `/assets/work/${item.folder}/${item.webpPoster}` : undefined}
          isVisible={isVideoActive && isVideoPlaying}
          previewState={previewState}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleVideoError}
          onEnded={handleVideoEnded}
          videoRef={videoRef}
        />
      )}

      {/* Fallback Placeholders when active but no content */}
      {isActive && isGraphicType && previewImages.length === 0 && !hasVideo && (
        <ImagePlaceholder />
      )}

      {isActive && isVideoType && !hasVideo && (
        <VideoPlaceholder />
      )}
    </div>
  );
});

ProjectInteractionPreview.displayName = "ProjectInteractionPreview";
