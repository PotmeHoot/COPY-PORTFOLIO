/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Showreel } from "./components/Showreel";
import { Portfolio } from "./components/Portfolio";
// Lazy load non-critical sections that are further down the page
const About = lazy(() => import("./components/About").then(m => ({ default: m.About })));
const Pricing = lazy(() => import("./components/Pricing").then(m => ({ default: m.Pricing })));
const Services = lazy(() => import("./components/Services").then(m => ({ default: m.Services })));
const ARShowcase = lazy(() => import("./components/ARShowcase").then(m => ({ default: m.ARShowcase })));
const Expertise = lazy(() => import("./components/Expertise").then(m => ({ default: m.Expertise })));
const Collaboration = lazy(() => import("./components/Collaboration").then(m => ({ default: m.Collaboration })));
const Contact = lazy(() => import("./components/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));

import { ContentProvider, useContent } from "./context/ContentContext";
import { useEffect } from "react";
import { LazySection } from "./components/ui/LazySection";

function SectionLoader() {
  return (
    <div className="w-full h-[400px] flex items-center justify-center bg-bg-secondary/50 rounded-[32px] animate-pulse">
      <div className="w-8 h-8 border-2 border-accent/10 border-t-accent/40 rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const { content, isLoading, error } = useContent();

  useEffect(() => {
    const prefetchLowerSections = () => {
      // Background prefetch for bottom sections to ensure they are ready before scroll
      import("./components/Collaboration");
      import("./components/Contact");
      import("./components/Footer");
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => prefetchLowerSections());
      } else {
        setTimeout(prefetchLowerSections, 3000);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !content) {
    const errorTitle = content?.error?.title || "Nepodarilo sa načítať obsah";
    const errorDesc = content?.error?.description || "Skúste, prosím, obnoviť stránku.";
    const retryLabel = content?.error?.retryLabel || "Skúsiť znova";

    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">{errorTitle}</h1>
          <p className="text-text-secondary mb-8">{errorDesc}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black rounded-xl font-bold"
          >
            {retryLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="selection:bg-white selection:text-black">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Showreel />
        <Portfolio />
        <LazySection id="about">
          <Suspense fallback={<SectionLoader />}>
            <About />
          </Suspense>
        </LazySection>
        <LazySection id="pricing">
          <Suspense fallback={<SectionLoader />}>
            <Pricing />
          </Suspense>
        </LazySection>
        <LazySection id="services">
          <Suspense fallback={<SectionLoader />}>
            <Services />
          </Suspense>
        </LazySection>
        <LazySection id="ar">
          <Suspense fallback={<SectionLoader />}>
            <ARShowcase />
          </Suspense>
        </LazySection>
        <LazySection id="experience">
          <Suspense fallback={<SectionLoader />}>
            <Expertise />
          </Suspense>
        </LazySection>
        <LazySection id="collaboration" eager={true}>
          <Suspense fallback={<SectionLoader />}>
            <Collaboration />
          </Suspense>
        </LazySection>
        <LazySection id="contact" eager={true}>
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </LazySection>
      </main>
      <LazySection minHeight="100px" eager={true}>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LazySection>
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}
