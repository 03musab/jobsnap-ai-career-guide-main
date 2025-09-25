import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Star, Rocket } from "lucide-react";
import { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useOnScreen } from "../../useOnScreen";
import ComingSoon from "./ComingSoonLink";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "Free",
      period: "forever",
      description: "Perfect for beginners",
      features: [
        "Up to 10 scans per month",
        "Basic AI relevance scoring",
        "Job management dashboard (New/Applied/Rejected)",
        "Email notifications",
        "Standard support"
      ],
      buttonText: "Start Free",
      buttonVariant: "outline" as const,
      popular: false,
      announced: true,
    },
    {
      name: "Professional",
      icon: Crown,
      price: "$19",
      period: "per month",
      description: "Ideal for active job seekers",
      features: [
        "30 scans per month for advanced job searches",
        "Advanced AI relevance scoring",
        "Multi-platform scraping ",
        "Saved search profiles for quick re-use",
        "Automated email reports with Excel",
        "Resume-aware matching",
        "Application form pre-filling (experimental)",
        "Priority support"
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "hero" as const,
      popular: true,
      announced: false,
    },
    {
      name: "Premium",
      icon: Star,
      price: "$39",
      period: "per month",
      description: "For career-focused professionals",
      features: [
        "Everything in Professional +",
        "Unlimited scans for maximum exposure",
        "AI-tailored cover letters (one-click variants)",
        "Resume optimizer with score + keyword suggestions",
        "Semantic job matching (embeddings-based)",
        "Smart apply automation with human-in-the-loop",
        "Interview prep pack (questions, 30–60–90 plan, company insights)",
        "Slack/Telegram/WhatsApp alerts with deep links"
      ],
      buttonText: "Upgrade to Premium",
      buttonVariant: "electric" as const,
      popular: false,
      announced: false,
    },
    {
      name: "Enterprise",
      icon: Rocket,
      price: "Custom",
      period: "",
      description: "For power users & career coaches",
      features: [
        "Everything in Premium, plus:",
        "Calendar + apply scheduler with Google Calendar sync",
        "Company enrichment & salary insights (Glassdoor, Levels.fyi, APIs)",
        "Feedback-driven scoring loop (personalized AI learning)",
        "Interactive dashboards (heatmaps, skill clouds, timelines)",
        "Browser extension for quick job saving",
        "Multi-tenant scrapers + proxy rotation (scale without blocks)",
        "Dedicated account manager & custom integrations"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "electric" as const,
      popular: false,
      announced: true,
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isVisible = useOnScreen(sectionRef, { threshold: 0.1 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    const animateCards = () => {
      if (isVisible && !hasAnimated.current) {
        controls.start("visible");
        hasAnimated.current = true;
      }
    };

    // If the section is visible on load at the top of the page, wait for the first scroll to animate.
    if (isVisible && window.scrollY < 10 && !hasAnimated.current) {
      const handleFirstScroll = () => {
        animateCards();
        window.removeEventListener("scroll", handleFirstScroll);
      };
      window.addEventListener("scroll", handleFirstScroll);
      return () => window.removeEventListener("scroll", handleFirstScroll);
    }
    animateCards();
  }, [isVisible, controls]);
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };
  return (
    <section id="pricing" ref={sectionRef} className="py-24 bg-background/80 backdrop-blur-sm scroll-mt-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-100">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Simple, <span className="text-transparent bg-gradient-neural bg-clip-text">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your job search needs. All plans include our core AI-powered job discovery engine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto opacity-100">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative group ${plan.popular ? 'lg:scale-105' : ''}`}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              custom={index}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-electric text-white px-6 py-2 rounded-full text-sm font-semibold shadow-glow">
                  Most Popular
                </div>
              )}
              
              <div className={`bg-card rounded-3xl p-8 shadow-glass border transition-all duration-500 ease-in-out hover:shadow-neural ${
                plan.popular
                  ? 'border-accent shadow-glow'
                  : 'border-border'
              }`}>
                <div className="mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-smooth ${
                    plan.popular 
                      ? 'bg-gradient-electric shadow-glow' 
                      : 'bg-gradient-neural shadow-neural'
                  }`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-card-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="mb-6 min-h-[6rem] flex items-center">
                    {plan.announced ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-card-foreground">
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-4xl font-bold text-card-foreground blur-sm">$--</span>
                        <span className="text-sm text-muted-foreground mt-2">Pricing to be announced</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <ComingSoon asChild isComingSoon>
                    <Button 
                      variant={plan.buttonVariant} 
                      size="lg" 
                      className="w-full transition-spring"
                    >
                      {plan.buttonText}
                    </Button>
                  </ComingSoon>
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-gradient-neural rounded-full flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-muted-foreground text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16 opacity-100">
          <p className="text-muted-foreground mb-6">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;