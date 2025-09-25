import { ArrowRight, Upload, Search, Target, Mail } from "lucide-react";
import { useRef } from "react";
import { useOnScreen } from "../../useOnScreen";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ScrollStack from "./ScrollStack";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: Upload,
      title: "Upload Your Resume",
      description: "Upload your resume and set your job preferences. Our AI analyzes your skills and experience to understand your ideal opportunities."
    },
    {
      step: "02", 
      icon: Search,
      title: "AI Discovers Jobs",
      description: "Our intelligent scrapers continuously search across LinkedIn, Internshala, and other platforms, finding jobs that match your profile."
    },
    {
      step: "03",
      icon: Target,
      title: "Smart Relevance Scoring",
      description: "Each job gets an AI-powered relevance score based on your skills, experience, and preferences, so you see the best matches first."
    },
    {
      step: "04",
      icon: Mail,
      title: "Automated Reporting",
      description: "Receive daily email summaries with your top job matches and comprehensive Excel reports to track your job search progress."
    }
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useOnScreen(sectionRef, { threshold: 0.15 });

  const cards = steps.map(step => ({
    title: step.title,
    badge: `Step ${step.step}`,
    content: (
      <div className="flex flex-col md:flex-row gap-6 items-start text-white">
        <div className="w-16 h-16 bg-gradient-electric rounded-2xl flex items-center justify-center shadow-glass flex-shrink-0 mt-1">
          <step.icon className="h-8 w-8 text-white" />
        </div>
        <div className="flex-grow">
          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-5xl font-bold text-transparent bg-gradient-neural bg-clip-text">{step.step}</span>
            <h3 className="text-2xl font-semibold">
              {step.title}
            </h3>
          </div>
          <p className="text-white/80 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    )
  }));

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 bg-background/80 backdrop-blur-sm scroll-mt-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-100">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            How <span className="text-transparent bg-gradient-neural bg-clip-text">JobSnap</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Four simple steps to transform your job search from manual drudgery to intelligent automation.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <ScrollStack
            cards={cards}
            animationDuration="0.3s"
            backgroundColor="transparent"
          />
        </div>

        <div className="text-center mx-auto mt-auto opacity-100">
          <Button variant="hero" size="xl" className="rounded-md">
            <span>
              {"Get Started Now".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: "easeInOut",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;