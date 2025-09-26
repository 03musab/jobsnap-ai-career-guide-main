import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import DarkVeil from "@/components/DarkVeil";
import { Toaster as ComingSoonToaster } from "@/components/ComingSoonToast";

function App() {
  useEffect(() => {
    document.body.style.opacity = "1";
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <DarkVeil />
      </div>
      <Header />
      <main>
        <Hero />
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