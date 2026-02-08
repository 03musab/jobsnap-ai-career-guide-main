import { useEffect, useState } from "react";
import Lenis from 'lenis';
import Footer from "./Footer";
import Header from "./Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import DarkVeil from "@/components/DarkVeil";
import { Toaster as ComingSoonToaster } from "@/components/ComingSoonToast";
import HeroStory from "@/components/HeroStory";

function App() {
  useEffect(() => {
    document.body.style.opacity = "1";

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <DarkVeil />
      </div>
      <Header />
      <main>
        <Hero />
        <HeroStory />
        <HowItWorks />
        <Features />
        <Pricing />
      </main>
      <ComingSoonToaster />
      <Footer />
    </>
  );
}
export default App;