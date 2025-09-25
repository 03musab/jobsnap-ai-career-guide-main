import React, { useState, useEffect, useRef } from "react";
import PillNav from '@/components/PillNav';
import { gsap } from 'gsap';
import { cn } from "@/lib/utils";
import ComingSoon from "@/components/ComingSoonLink";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
];

const Header = () => {
  const [activeHref, setActiveHref] = useState(navItems[0].href);
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
      );
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navItems.map(item => document.querySelector(item.href));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <header 
      ref={headerRef} 
      className={cn(
        "sticky z-50 w-full opacity-0 transition-all duration-300 ease-in-out px-4",
        isScrolled ? 'top-4' : 'top-0'
      )}
    >
      <div className={cn(
        "relative flex items-center justify-between transition-all duration-300 ease-in-out",
        isScrolled 
          ? 'max-w-6xl mx-auto rounded-full bg-neutral-900/30 backdrop-blur-2xl border border-white/10 shadow-lg px-4 py-1' 
          : 'w-full px-2 py-4'
      )}>
        {/* Left: Logo */}
        <a href="#home" className="text-lg font-bold tracking-tight text-foreground pl-2">
          JobSnap
        </a>

        {/* Center: Navigation */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <PillNav
            isScrolled={false} // The parent div now handles the scrolled appearance
            items={navItems}
            activeHref={activeHref}
            ease="power3.out"
            baseColor="transparent"
            pillColor="transparent"
            hoveredPillTextColor="hsl(var(--primary-foreground))"
            pillTextColor="hsl(var(--foreground))"
          />
        </div>

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-4">
          <ComingSoon asChild href="#">
            <Button variant="ghost" size="sm" className="rounded-full">
              Login
            </Button>
          </ComingSoon>
          <ComingSoon asChild href="#">
            <Button variant="default" size="sm" className="rounded-full px-4">
              Sign Up
            </Button>
          </ComingSoon>
        </div>
      </div>
    </header>
  );
};
export default Header;