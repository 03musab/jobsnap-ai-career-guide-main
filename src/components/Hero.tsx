import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown, Bot, Zap, Sparkles } from "lucide-react";
import { useAnimatedCounter } from "../../useAnimatedCounter";
import { useOnScreen } from "../../useOnScreen";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlurText from "./BlurText";
import ComingSoon from "./ComingSoonLink";
import TextType from "./TextType";
import TrueFocus from "./TrueFocus";
import { EarlyAccessModal } from "../../EarlyAccessModal";

const Hero = () => {
  const [highlightEarlyAccess, setHighlightEarlyAccess] = useState(false);

  useEffect(() => {
    const handleHighlight = () => {
      setHighlightEarlyAccess(true);
      setTimeout(() => setHighlightEarlyAccess(false), 3000); // Highlight for 3 seconds
    };

    window.addEventListener('highlightEarlyAccess', handleHighlight);
    return () => window.removeEventListener('highlightEarlyAccess', handleHighlight);
  }, []);

  return (
    <section id="home" className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden pt-24 pb-12">
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-electric rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow rounded-full blur-3xl opacity-15"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-accent rounded-full blur-2xl opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Content */}
          <div className="space-y-8 opacity-100">
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-neural px-4 py-1.5 text-sm font-semibold text-white shadow-neural mb-4">
              <Sparkles className="h-4 w-4 mr-2 text-white" />
              <span>Now Accepting Early Access Users</span>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center gap-3">
                <Bot className="h-8 w-8 text-white" />
                <TrueFocus
                  sentence="Powered by AI Intelligence"
                  className="text-2xl"
                  blurAmount={2}
                  borderColor="hsl(var(--accent))"
                  glowColor="hsla(var(--accent) / 0.5)"
                  animationDuration={0.8}
                  pauseBetweenAnimations={0.5}
                />
              </div>

              <BlurText
                text="JobSnap AI Job Hunter"
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-gradient-neural bg-clip-text"
                delay={100}
                animateBy="words"
              />

              <TextType
                as="p"
                text={[
                  "Automate your job search with intelligent AI.",
                  "Discover, score, and track opportunities across multiple platforms.",
                  "Join our early access to shape the future of job hunting.",
                ]}
                className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto"
                typingSpeed={40}
                pauseDuration={1500}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative">
                {highlightEarlyAccess && (
                  <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: -80, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute left-2 top-0/1 -translate-y-1/1 z-20"
                  >
                    <ArrowRight className="text-white h-12 w-32 drop-shadow-lg" />
                  </motion.div>
                )}
                <EarlyAccessModal />
              </div>
              <ComingSoon asChild isComingSoon>
                <Button variant="glass" size="xl" className="transition-spring">
                  <Zap className="h-5 w-5" />
                  Watch Demo
                </Button>
              </ComingSoon>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Be the first to try</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-8 mt-16">
          <StatCard value={25} suffix="K+" label="Jobs Discovered" />
          <StatCard value={94} suffix="%" label="Match Accuracy" />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ className, value, suffix, label }: { className?: string, value: number, suffix: string, label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const animatedValue = useAnimatedCounter(value, 2000, isVisible);

  return (
    <div ref={ref} className={`bg-gradient-glass backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-glass ${className}`}>
      <div className="text-2xl font-bold text-white">
        {animatedValue}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default Hero;