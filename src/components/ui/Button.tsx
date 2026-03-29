import { ReactNode, AnchorHTMLAttributes, MouseEvent } from "react";
import { cn } from "../../lib/utils";
import { scrollToSection, isInternalHash } from "../../lib/navigation";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'light';
  className?: string;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  href,
  onClick,
  ...props 
}: ButtonProps) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    light: 'btn-light'
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href && isInternalHash(href)) {
      scrollToSection(e, href);
    }
    if (onClick) onClick(e);
  };

  return (
    <a 
      href={href}
      className={cn(variantClasses[variant], className)} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};
