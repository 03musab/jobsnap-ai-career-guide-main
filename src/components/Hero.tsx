import { ArrowRight, BriefcaseBusiness, Mail, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="recruiter-hero-shell" id="home">
      <div className="recruiter-hero-bg" aria-hidden="true" />

      <header className="recruiter-topbar">
        <nav className="recruiter-nav-pill" aria-label="Main Navigation">
          <a href="#home" className="recruiter-nav-link active">Home</a>
          <a href="#workspace" className="recruiter-nav-link">Workspace</a>
          <a href="#features" className="recruiter-nav-link">Features</a>
          <a href="#funnel" className="recruiter-nav-link">Funnel</a>
          <a href="#workflow" className="recruiter-nav-link">Workflow</a>
          <a href="#security" className="recruiter-nav-link">Security</a>
          <a href="#faq" className="recruiter-nav-link">FAQ</a>
        </nav>

        <button type="button" className="recruiter-jobseeker-pill" aria-label="Job Seekers portal">
          <BriefcaseBusiness size={16} />
          <span>Job Seekers</span>
        </button>
      </header>

      <div className="recruiter-badge">
        <div className="recruiter-badge-logos" aria-hidden="true">
          <span className="recruiter-badge-icon recruiter-badge-icon--dark">a</span>
          <span className="recruiter-badge-icon recruiter-badge-icon--dark">G</span>
          <span className="recruiter-badge-icon recruiter-badge-icon--dark">g</span>
        </div>
        <span>
          <strong>Recruiter Workspace</strong> • 100% Free Beta
        </span>
      </div>

      <h1 className="recruiter-headline" aria-label="JobSnap for HR">
        <span className="recruiter-headline-line recruiter-headline-line--light">JobSnap for HR</span>
        <span className="recruiter-headline-line recruiter-headline-line--gradient">Automate Talent Screening</span>
      </h1>

      <p className="recruiter-subhead">
        Your autonomous AI recruiting console: 0–100% resume match scoring, visual 6-stage candidate progression,
        14-day application velocity tracking, and 1-click candidate decisioning.
      </p>

      <div className="recruiter-cta-wrap">
        <div className="recruiter-email-row">
          <div className="recruiter-email-field">
            <Mail size={18} className="recruiter-email-icon" />
            <input type="email" placeholder="Enter your work email for instant recruit" aria-label="Work email" />
          </div>
          <button type="button" className="recruiter-cta-button">
            <span>Claim Recruiter Spot</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="recruiter-demo-row">
          <span className="recruiter-live-tag">
            <Sparkles size={12} />
            <span>LIVE DEMO</span>
          </span>
          <span className="recruiter-demo-link">Explore Interactive Dashboard</span>
          <ArrowRight size={14} className="recruiter-demo-arrow" />
        </div>

        <div className="recruiter-capability-row">
          <span className="recruiter-capability-dot" aria-hidden="true" />
          <span>Recruiter Beta Open • Instant Session Access</span>
        </div>
      </div>

      <div className="recruiter-lower-banner">
        <div className="recruiter-lower-banner-left">
          <span className="recruiter-lower-badge">Job Seeker</span>
          <span className="recruiter-lower-text">Looking for your dream job? Visit the JobSnap Job Seeker Portal with automated 60s fast scans and free access passes.</span>
        </div>
        <button type="button" className="recruiter-lower-button">
          <span>Job Seeker Page</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default Hero;