import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, Check, ArrowRight } from "lucide-react";
import TrialButton from "@/components/TrialButton";
import ComingSoon from "@/components/ComingSoonLink";

export function EarlyAccessModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false); // This can be removed if not needed for the form
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("submitting");
    
    // Since you are using a direct payment form, we can just redirect the user.
    // The email can be pre-filled in the URL if the form supports it.
    const formUrl = `https://payments.cashfree.com/forms/JobSnap?email=${encodeURIComponent(email)}`;
    window.location.href = formUrl;

    // The page will redirect, but we can set status to success optimistically
    // or handle post-payment logic via webhooks or a redirect URL from Cashfree.
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset state after close animation
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
        setError(null);
        setAgreed(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <TrialButton className="px-8 py-4 text-lg font-semibold">
          Request Early Access
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </TrialButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-sm border-border shadow-glass">
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center p-8 gap-4 text-center min-h-[260px]">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.path
                d="M22 4L12 14.01l-3-3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              />
            </motion.svg>
            <p className="text-lg font-medium text-card-foreground">
              Success! You're on the list.
            </p>
            <p className="text-sm text-muted-foreground">
              We'll be in touch soon.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="pb-2">
              <DialogTitle className="text-2xl font-bold text-transparent bg-gradient-neural bg-clip-text">
                Join the Waitlist
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Be the first to know when JobSnap goes live. Enter your email below to request early access.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="pl-10 bg-background/50"
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => {
                  setAgreed(checked as boolean);
                  if (error) setError(null);
                }} className="mt-1" />
                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2">
                  You agree to our{' '}
                  <a href="#" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                  </a>.
                </Label>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter className="pt-2">
                <Button type="submit" className="w-full transition-all" variant="hero" disabled={status === 'submitting'}>
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay and Get Early Access'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}