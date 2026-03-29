import { useState, useEffect, useRef, useCallback } from "react";
import { Project } from "../types/content";

export type PreviewState = 'idle' | 'visible' | 'armed' | 'previewing' | 'reset';

export const useProjectPreviewLoop = (item: Project, isInView: boolean, isHovered: boolean) => {
  const [previewState, setPreviewState] = useState<PreviewState>('idle');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [activeSegmentProgress, setActiveSegmentProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoDuration, setVideoDuration] = useState(10);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const armedTimeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const maxDurationTimeoutRef = useRef<number | null>(null);

  // Robust hover support detection
  const [isHoverSupported, setIsHoverSupported] = useState(false);
  useEffect(() => {
    setIsHoverSupported(window.matchMedia("(hover: hover)").matches);
  }, []);

  const videoAsset = item.assets.find(a => a.type === 'video');
  const imageAssets = item.assets.filter(a => a.type === 'image');
  
  const hasVideo = !!videoAsset && !videoError;
  const hasPreviewImages = imageAssets.length > 0;

  // Derive active states from the state machine
  // isVideoActive controls when the video element is MOUNTED and starts playing
  const isVideoActive = hasVideo && previewState === 'previewing';
  
  // isImageSequenceActive controls when the image sequence is MOUNTED
  const isImageSequenceActive = previewState === 'previewing' && hasPreviewImages && (!hasVideo || videoError);
  
  // isIdle controls the POSTER visibility. 
  // It should stay true until the video is actually playing or the image sequence is active.
  const isIdle = previewState !== 'previewing' || (hasVideo && !isVideoPlaying) || previewState === 'reset';

  const previewVideo = videoAsset ? `/assets/work/${item.folder}/${videoAsset.file}` : undefined;
  const previewImages = imageAssets.map(a => `/assets/work/${item.folder}/${a.file}`);

  // 1. State Machine Transitions
  useEffect(() => {
    if (!isInView) {
      setPreviewState('idle');
      return;
    }

    if (!isHovered) {
      // If we were in any active state, go to reset first
      if (previewState !== 'visible' && previewState !== 'idle' && previewState !== 'reset') {
        setPreviewState('reset');
        resetTimeoutRef.current = window.setTimeout(() => {
          setPreviewState('visible');
        }, 300);
      } else if (previewState === 'idle') {
        setPreviewState('visible');
      }
      return;
    }

    // If hovered and in view
    if (isHoverSupported && (previewState === 'visible' || previewState === 'idle')) {
      // Intent Delay: Wait 150ms before "arming" (preloading metadata)
      armedTimeoutRef.current = window.setTimeout(() => {
        setPreviewState('armed');
      }, 150);
    } else if (isHoverSupported && previewState === 'armed') {
      // Playback Delay: Wait another 150ms before "previewing" (playing)
      armedTimeoutRef.current = window.setTimeout(() => {
        setPreviewState('previewing');
      }, 150);
    }

    return () => {
      if (armedTimeoutRef.current) {
        window.clearTimeout(armedTimeoutRef.current);
      }
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
      if (maxDurationTimeoutRef.current) {
        window.clearTimeout(maxDurationTimeoutRef.current);
      }
    };
  }, [isInView, isHovered, previewState]);

  // 2. Max Duration Logic (Optional: Stop preview after 12s)
  useEffect(() => {
    if (previewState === 'previewing') {
      maxDurationTimeoutRef.current = window.setTimeout(() => {
        // Only reset if we are still previewing
        setPreviewState('reset');
        resetTimeoutRef.current = window.setTimeout(() => {
          setPreviewState('visible');
        }, 300);
      }, 12000); // 12 seconds max preview
    }

    return () => {
      if (maxDurationTimeoutRef.current) {
        window.clearTimeout(maxDurationTimeoutRef.current);
      }
    };
  }, [previewState]);

  // 3. Image Sequence Animation Logic
  useEffect(() => {
    const shouldLoop = isHoverSupported && isImageSequenceActive && previewImages.length >= 1;

    if (shouldLoop) {
      const totalDuration = 3000;
      const cycleDuration = totalDuration * previewImages.length;
      const startTime = performance.now();

      const updateProgress = () => {
        const elapsed = performance.now() - startTime;
        const cycleElapsed = elapsed % cycleDuration;
        const totalProgress = (cycleElapsed / totalDuration) * 100;
        
        const segmentIndex = Math.floor(totalProgress / 100);
        const segmentProgress = totalProgress % 100;
        
        setActiveSegmentIndex(segmentIndex);
        setActiveSegmentProgress(segmentProgress);
        
        rafRef.current = requestAnimationFrame(updateProgress);
      };

      rafRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      
      if (previewState !== 'previewing') {
        setActiveSegmentIndex(0);
        setActiveSegmentProgress(0);
      }
    };
  }, [previewState, isImageSequenceActive, previewImages.length, isHoverSupported]);

  // 3. Video Playback Logic
  useEffect(() => {
    if (previewState === 'previewing' && hasVideo && !videoError) {
      const playVideo = async () => {
        try {
          if (videoRef.current) {
            await videoRef.current.play();
            setIsVideoPlaying(true);
            setVideoError(false);
          }
        } catch (error) {
          console.warn("Video play failed, falling back to image sequence:", error);
          setIsVideoPlaying(false);
          setVideoError(true);
        }
      };
      playVideo();
    }

    if (previewState === 'reset' || previewState === 'visible' || previewState === 'idle') {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsVideoPlaying(false);
    }
  }, [previewState, hasVideo, videoError]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoError = () => {
    console.warn(`Video resource not found or unsuitable: ${previewVideo}`);
    setVideoError(true);
    setIsVideoPlaying(false);
  };

  const handleVideoEnded = () => {
    // If the video ends and we are still in previewing state, 
    // we can either loop it (if it's short) or stop it.
    if (previewState === 'previewing' && videoRef.current) {
      // For a premium feel, we only loop if the video is short (e.g. < 6s)
      // and we haven't reached the 12s limit yet.
      if (videoRef.current.duration < 6) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } else {
        // If it's a longer video, just stop at the end or reset
        setPreviewState('reset');
        resetTimeoutRef.current = window.setTimeout(() => {
          setPreviewState('visible');
        }, 300);
      }
    }
  };

  return {
    activeSegmentIndex,
    activeSegmentProgress,
    isVideoPlaying,
    videoDuration,
    videoRef,
    handleLoadedMetadata,
    handleVideoError,
    handleVideoEnded,
    isVideoActive,
    isImageSequenceActive,
    isIdle,
    hasPreviewImages,
    hasVideo,
    previewImages,
    previewVideo,
    isHoverSupported,
    previewState
  };
};
