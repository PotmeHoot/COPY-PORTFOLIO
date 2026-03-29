import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to track the active section in view using IntersectionObserver.
 * Optimized for lazy-loaded sections and fast scrolling.
 * @param sectionIds Array of section IDs to observe.
 * @returns The ID of the most prominent section in view.
 */
export const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElements = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return;

    const sectionRatios: Record<string, number> = {};

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        sectionRatios[entry.target.id] = entry.intersectionRatio;
      });

      // Special case: check if we are at the bottom of the page
      const isAtBottom = 
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;

      if (isAtBottom) {
        // If at bottom, the last section in the list should be active
        const lastSectionId = sectionIds[sectionIds.length - 1];
        if (lastSectionId) {
          setActiveSection(lastSectionId);
          return;
        }
      }

      // Find the section with the highest intersection ratio
      const mostProminent = Object.entries(sectionRatios).reduce(
        (acc, [id, ratio]) => (ratio > acc.ratio ? { id, ratio } : acc),
        { id: "", ratio: 0 }
      );

      if (mostProminent.ratio > 0) {
        setActiveSection(mostProminent.id);
      }
    };

    // Create observer with a balanced rootMargin
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "-10% 0px -40% 0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    });

    const observeMissingSections = () => {
      if (!observerRef.current) return;

      sectionIds.forEach((id) => {
        if (!observedElements.current.has(id)) {
          const element = document.getElementById(id);
          if (element) {
            observerRef.current?.observe(element);
            observedElements.current.add(id);
          }
        }
      });
    };

    // Initial check
    observeMissingSections();

    // Check again on next animation frames to catch delayed/lazy nodes
    const rafId1 = requestAnimationFrame(observeMissingSections);
    const rafId2 = requestAnimationFrame(() => requestAnimationFrame(observeMissingSections));

    // Also check on scroll to catch nodes that might appear as user scrolls
    const handleScroll = () => {
      observeMissingSections();
      
      // Bottom of page check (redundant but helpful for immediate feedback)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      observedElements.current.clear();
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds]);

  return activeSection;
};
