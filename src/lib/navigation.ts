import React from "react";

/**
 * Utility for smooth scrolling to internal sections with a fixed navbar offset.
 */
export const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | MouseEvent, href: string) => {
  // Only handle internal hash links
  if (!href.startsWith("#") || href === "#") return;

  const id = href.substring(1);
  const element = document.getElementById(id);

  if (element) {
    e.preventDefault();
    
    // Fixed navbar offset (adjust based on actual navbar height + padding)
    const navbarOffset = 100; 
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Update URL hash without jumping
    window.history.pushState(null, "", `#${id}`);
  }
};

/**
 * Helper to determine if a link is an internal hash link.
 */
export const isInternalHash = (href?: string): boolean => {
  return !!href && href.startsWith("#") && href.length > 1;
};
