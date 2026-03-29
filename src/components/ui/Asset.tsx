import { useState, useRef, useEffect, ReactNode, forwardRef, useImperativeHandle } from "react";
import { cn } from "../../lib/utils";
import { Image as ImageIcon, Video as VideoIcon, AlertCircle } from "lucide-react";
import { useSiteContent } from "../../hooks/useSiteContent";

interface AssetProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  loading?: "lazy" | "eager";
  errorFallback?: ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  srcSet?: string;
  sizes?: string;
  webpSrc?: string;
  [key: string]: any;
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".webp", ".png", ".gif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg"];

export const Asset = forwardRef<HTMLVideoElement | HTMLImageElement, AssetProps>(({
  src,
  alt,
  className,
  containerClassName,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  loading = "lazy",
  preload = loading === "eager" ? "auto" : "metadata",
  errorFallback,
  onLoad,
  onError,
  srcSet,
  sizes,
  webpSrc,
  ...props
}, ref) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const { content } = useSiteContent();
  const internalRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => internalRef.current);

  const getExtension = (url: string) => {
    try {
      // Handle base64 or blob URLs
      if (url.startsWith('data:') || url.startsWith('blob:')) {
        const mimeType = url.split(':')[1].split(';')[0];
        return `.${mimeType.split('/')[1]}`;
      }
      const path = new URL(url, window.location.origin).pathname;
      return path.substring(path.lastIndexOf(".")).toLowerCase();
    } catch {
      return "";
    }
  };

  const extension = getExtension(src);
  const isImage = IMAGE_EXTENSIONS.includes(extension);
  const isVideo = VIDEO_EXTENSIONS.includes(extension);

  useEffect(() => {
    if (!src) {
      setIsValid(false);
      setError(true);
      return;
    }

    if (!isImage && !isVideo) {
      console.warn(`Asset validation failed: Unsupported file extension "${extension}" for ${src}`);
      setIsValid(false);
      setError(true);
      if (onError) onError();
    } else {
      setIsValid(true);
      setError(false);
    }
  }, [src, extension, isImage, isVideo, onError]);

  // Lazy loading and visibility control for videos using IntersectionObserver
  useEffect(() => {
    if (!isVideo || !internalRef.current || !containerRef.current || error) return;

    // Immediate play for eager videos (Hero)
    if (loading === "eager" && autoPlay) {
      internalRef.current.play().catch(() => {});
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (internalRef.current) {
              // Only load if not already loaded or if preload was "none"
              if (internalRef.current.readyState === 0) {
                internalRef.current.load();
              }
              
              if (autoPlay) {
                internalRef.current.play().catch(() => {
                  // Autoplay prevented
                });
              }
            }
          } else {
            // Pause when out of view to save resources
            if (internalRef.current && !internalRef.current.paused) {
              internalRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVideo, autoPlay, error]);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    if (onError) onError();
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden bg-white/5", containerClassName)}
    >
      {/* Loading Shimmer */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer z-10" />
      )}

      {/* Error/Invalid State UI */}
      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/[0.02]">
          {errorFallback ? (
            errorFallback
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-30 text-center px-4">
              {!isValid ? (
                <AlertCircle className="w-6 h-6 text-red-500/50" strokeWidth={1.5} />
              ) : isVideo ? (
                <VideoIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
              ) : (
                <ImageIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
              )}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white">
                  {!isValid 
                    ? (content?.error?.invalidFormatLabel || "Invalid Format") 
                    : (content?.error?.missingAssetLabel || "Missing Asset")}
                </span>
                <span className="text-[7px] uppercase tracking-[0.1em] text-white/40 font-medium">
                  {src.split("/").pop()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {isValid && isImage && (
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            ref={internalRef}
            src={src}
            alt={alt}
            loading={loading}
            decoding={loading === "eager" ? "sync" : "async"}
            fetchPriority={loading === "eager" ? "high" : "auto"}
            srcSet={srcSet}
            sizes={sizes}
            className={cn(
              "transition-opacity duration-700 w-full h-full object-cover",
              loaded && !error ? "opacity-100" : "opacity-0",
              className
            )}
            onLoad={handleLoad}
            onError={handleError}
            referrerPolicy="no-referrer"
            {...props}
          />
        </picture>
      )}

      {isValid && isVideo && (
        <video
          ref={internalRef}
          src={src}
          poster={poster}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          preload={preload}
          fetchPriority={loading === "eager" ? "high" : "auto"}
          className={cn(
            "transition-opacity duration-700 w-full h-full object-cover",
            loaded && !error ? "opacity-100" : "opacity-0",
            className
          )}
          onCanPlay={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
});

Asset.displayName = "Asset";
