import { useEffect, useState } from 'react';
import { ReactNode } from 'react';

type StickyHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function StickyHeader({ children, className }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 shadow-sm backdrop-blur' : 'bg-gray-50'
      } ${className || ""}`}
    >
      {children}
    </header>
  );
}