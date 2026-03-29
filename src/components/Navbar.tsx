import { useSiteContent } from "../hooks/useSiteContent";
import { Button } from "./ui/Button";
import { useActiveSection } from "../hooks/useActiveSection";
import { scrollToSection } from "../lib/navigation";
import { MouseEvent } from "react";

export const Navbar = () => {
  const { content } = useSiteContent();
  const { navigation, settings } = content;
  const activeSection = useActiveSection(navigation.map(n => n.id));

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    scrollToSection(e, `#${id}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
      <nav className="bg-white/80 backdrop-blur-md border border-border px-4 py-2 rounded-full flex items-center gap-6 md:gap-10 pointer-events-auto shadow-sm" aria-label="Main navigation">
        <div className="text-sm font-bold tracking-widest text-text-primary uppercase">{settings.ownerName}</div>
        
        <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-text-secondary">
          {navigation.map((link) => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`transition-colors duration-200 ${activeSection === link.id ? "text-accent" : "text-text-secondary hover:text-accent"}`}
              aria-current={activeSection === link.id ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button 
          href="#contact" 
          variant="primary"
          className="!px-4 !py-1.5 !text-[10px] !rounded-full"
          aria-label="Inquire about a project"
        >
          {settings.inquireLabel}
        </Button>
      </nav>
    </header>
  );
};
