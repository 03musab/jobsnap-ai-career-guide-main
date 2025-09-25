import { Bot, Search, Mail, Target, Calendar, Shield } from "lucide-react";
import { useRef } from "react";
import { useOnScreen } from "../../useOnScreen";
import MagicBento from "../../MagicBento";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Relevance Scoring",
      description: "Intelligent algorithms analyze job descriptions and match them to your profile, surfacing the most relevant opportunities first."
    },
    {
      icon: Search,
      title: "Multi-Source Job Scraping",
      description: "Aggregates listings from LinkedIn, Internshala, and other major platforms, giving you comprehensive coverage."
    },
    {
      icon: Target,
      title: "Smart Application Tracking",
      description: "Manage your entire pipeline from discovery to offer with status updates, notes, and timeline tracking."
    },
    {
      icon: Mail,
      title: "Automated Email Reports",
      description: "Receive beautifully formatted daily summaries with Excel reports of new matching opportunities."
    },
    {
      icon: Calendar,
      title: "Background Processing",
      description: "Celery-powered async job hunting runs in the background while you focus on applications."
    },
    {
      icon: Shield,
      title: "Resume-Aware Intelligence",
      description: "Upload your resume for smarter job matching and automated application form pre-filling."
    }
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useOnScreen(sectionRef, { threshold: 0.1 });

  return (
    <section id="features" ref={sectionRef} className="py-24 bg-background/80 backdrop-blur-sm scroll-mt-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-100">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Powered by <span className="text-transparent bg-gradient-neural bg-clip-text">Advanced AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            JobSnap combines cutting-edge machine learning with intelligent automation to revolutionize how you discover and apply for jobs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative opacity-100">
              <div className="bg-card rounded-2xl p-8 shadow-glass border border-border hover:shadow-neural transition-all duration-500 ease-in-out">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-neural rounded-2xl flex items-center justify-center shadow-neural transition-smooth">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '500ms'}}>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Insights <span className="text-transparent bg-gradient-electric bg-clip-text">Showcase</span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The AI Job Hunter is a powerful engine designed to automate your job search. It aggregates listings, scores them for relevance, and provides a dashboard to manage applications. Experience its core features in the interactive grid below.
            </p>
          </div>
          <div className={`flex justify-center ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '700ms'}}>
            <MagicBento 
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={12}
              glowColor="132, 0, 255"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;