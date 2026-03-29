import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  minHeight?: string;
  id?: string;
  eager?: boolean;
}

/**
 * LazySection component that defers rendering of its children until it enters the viewport.
 * Optimized for performance and anchor navigation stability.
 */
export const LazySection: React.FC<LazySectionProps> = ({
  children,
  threshold = 0.01,
  rootMargin = '600px', // Increased default preload distance for smoother fast scrolling
  className = '',
  minHeight = '400px',
  id,
  eager = false,
}) => {
  const [hasLoaded, setHasLoaded] = useState(eager);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already loaded or eager, we don't need to observe
    if (hasLoaded || eager) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasLoaded(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div
      id={id}
      ref={sectionRef}
      className={className}
      style={{ 
        minHeight: !hasLoaded ? minHeight : 'auto',
        width: '100%',
        position: 'relative'
      }}
    >
      {hasLoaded ? (
        children
      ) : (
        // Placeholder to maintain layout stability while content is loading
        <div style={{ height: minHeight }} aria-hidden="true" />
      )}
    </div>
  );
};
