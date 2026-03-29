import { useSiteContent } from "../hooks/useSiteContent";

export const Footer = () => {
  const { content } = useSiteContent();
  const { settings, navigation, contact } = content;
  const currentYear = new Date().getFullYear();

  const footerNav = [
    { id: "hero", label: "Home" },
    ...navigation.filter(item => item.visible).map(item => ({ id: item.id, label: item.label }))
  ].filter((item, index, self) => 
    index === self.findIndex((t) => t.id === item.id)
  ).slice(0, 5); // Limit to key links

  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-bold text-lg tracking-tight text-text-primary">
            {settings.ownerName}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-medium">
            © {currentYear} {content.footer.rightsReservedLabel}
          </span>
        </div>

        {/* Quick Nav */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {footerNav.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-bold text-text-secondary hover:text-accent transition-colors uppercase tracking-widest"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Contact Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
          <a 
            href={`mailto:${settings.email}`}
            className="text-sm font-bold text-text-secondary hover:text-accent transition-colors uppercase tracking-widest"
          >
            Email
          </a>
          {contact.socials.map((social) => (
            <a 
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-text-secondary hover:text-accent transition-colors uppercase tracking-widest"
            >
              {social.name}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
};
