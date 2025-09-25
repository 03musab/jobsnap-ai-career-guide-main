import { Button } from "@/components/ui/button";
import { Bot, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-electric rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">JobSnap</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              AI-powered job hunting that transforms how you discover and track opportunities. Built for the modern job seeker.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Product</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2025 JobSnap. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
            <span>Made with ❤️ for job seekers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;