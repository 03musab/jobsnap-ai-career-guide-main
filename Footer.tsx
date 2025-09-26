import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ComingSoon from "@/components/ComingSoonLink";
import { Bot, Github, Twitter, Linkedin, Mail, Loader2, Check } from "lucide-react";
import { useOnScreen } from "./useOnScreen";

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const isVisible = useOnScreen(footerRef, { threshold: 0.1 });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
      setNewsletterMessage("Please enter a valid email.");
      setNewsletterStatus("error");
      return;
    }

    setNewsletterStatus("submitting");
    setNewsletterMessage("");

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail, source: 'Footer Newsletter' }),
      });

      if (!response.ok) {
        let errorText = `An unknown error occurred. Status: ${response.status}`;
        try {
          const res = await response.json();
          errorText = res.error || errorText;
        } catch (e) { /* Response was not JSON, use default error */ }
        throw new Error(errorText);
      }

      setNewsletterStatus("success");
      setNewsletterMessage("Success! You're subscribed.");
      setNewsletterEmail("");
      setTimeout(() => {
        setNewsletterStatus("idle");
        setNewsletterMessage("");
      }, 4000);

    } catch (err) {
      setNewsletterStatus("error");
      setNewsletterMessage((err as Error).message);
    }
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.footer ref={footerRef} variants={footerVariants} initial="hidden" animate={isVisible ? "visible" : "hidden"} className="bg-background/80 backdrop-blur-sm text-foreground border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-electric rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">JobSnap</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              AI-powered job hunting that transforms how you discover and track opportunities. Built for the modern job seeker.
            </p>
            <div className="flex gap-4">
              <ComingSoon asChild isComingSoon>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Button>
              </ComingSoon>
              <ComingSoon asChild isComingSoon>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Button>
              </ComingSoon>
              <ComingSoon asChild isComingSoon>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </ComingSoon>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><ComingSoon href="#features" className="hover:text-foreground transition-colors">Features</ComingSoon></li>
              <li><ComingSoon href="#pricing" className="hover:text-foreground transition-colors">Pricing</ComingSoon></li>
              <li><ComingSoon href="#" className="hover:text-foreground transition-colors">API Documentation</ComingSoon></li>
              <li><ComingSoon href="#" className="hover:text-foreground transition-colors">Integrations</ComingSoon></li>
              <li><ComingSoon href="#" className="hover:text-foreground transition-colors">Changelog</ComingSoon></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><ComingSoon href="#" className="hover:text-foreground transition-colors">About Us</ComingSoon></li>
              <li><ComingSoon href="#" className="hover:text-foreground transition-colors">Blog</ComingSoon></li>
              <li><ComingSoon href="#" className="hover:text-foreground transition-colors">Careers</ComingSoon></li>
              <li><ComingSoon href="#" className="hover:text-foreground transition-colors">Press Kit</ComingSoon></li>
              <li><ComingSoon href="#" className="hover:text-foreground transition-colors">Contact</ComingSoon></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for the latest job market insights and product updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/50 border-border placeholder:text-muted-foreground"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterStatus === 'submitting'}
                />
                <Button type="submit" variant="electric" size="icon" aria-label="Subscribe to newsletter" disabled={newsletterStatus === 'submitting' || newsletterStatus === 'success'}>
                  {newsletterStatus === 'submitting' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : newsletterStatus === 'success' ? (
                    <Check className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Mail className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {newsletterMessage && (
                <p className={`text-sm ${newsletterStatus === 'error' ? 'text-destructive' : 'text-emerald-500'}`}>
                  {newsletterMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 JobSnap. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Made with ❤️ for job seekers everywhere</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
export default Footer;