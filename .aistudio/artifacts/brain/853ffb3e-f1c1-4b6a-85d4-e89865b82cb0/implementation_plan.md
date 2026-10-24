# JobSnap — AI Job Agent & Career Automation Operating System

Architecting and integrating the complete end-to-end JobSnap AI Job Agent platform into the application according to the exact product specifications: secure role-based login, interactive Enterprise Console with Fast/Deep scanning, live AI Jobs Dashboard with Market Intel and Daily Motivational Signals, Google Calendar syncing, Email Excel report dispatch, full Profile Settings with Resume Intelligence and Legal Checks, Outreach Studio with AI Recruiter Discovery and Message Wall templates, and Skill Gap & Career Roadmap diagnosis.

### User Review & Critical Decisions

> [!IMPORTANT]
> The product flow, screens, and features detailed below strictly adhere to your walkthrough without arbitrary additions or skipped capabilities. Review the architectural plan and confirmed choices before we proceed to code execution.

- **Confirmed Decision 1: Application Architecture & Delivery Mode**:
  - The website will feature the full, interactive JobSnap AI Agent experience directly accessible via a top navigation "Launch Agent Console" CTA as well as an embedded live workspace mode, preserving the marketing and features sections while enabling users to sign in and operate the full agent system.
- **Confirmed Decision 2: Authentication & Multi-Role**:
  - Two distinct role tracks: **Job Seeker** and **Recruiter or Enterprise**.
  - Secure credential simulation with operator session persistence in client state, setting the Enterprise Console operator badge to the authenticated username.
- **Confirmed Decision 3: Enterprise Console & Discovery Engine**:
  - Left-hand pinned console with operator identity, Fast Scan (~60s) vs. Deep Scan (~180s) modes, multi-discipline keyword filtering (e.g., Python, Electrical, Merchant Navy), filters (Location, Experience, Job Type: Full-time / Part-time / Contract / Internship), and persistent profile saving.
  - Active search progress bar (Pending → In Progress → Complete) feeding new discoveries into the dashboard.
- **Confirmed Decision 4: Integrations & Specialized Studios**:
  - **Email Reporting**: Recipient address input with automated dispatch of structured Excel/CSV scan summaries.
  - **Google Calendar**: Test connection, independent Google sign-in (supporting distinct accounts), application progress milestone syncing, and live in-page event viewer with refresh.
  - **Profile Settings**: Photo upload, personal details, professional links, resume parser & skills intelligence, legal eligibility gates (Relocation, Work Authorization), and AI-generated default cover letter.
  - **Outreach Studio**: Recruiter search (Tech Recruiter, HR Manager, Engineering Lead, Founder, Java/Python HRs), verified contact loading, and Message Wall with 3 saved email templates plus custom builder.
  - **Skill Gap & Roadmap**: Industry benchmark resume comparison, critical skill gap diagnosis, task/project learning roadmaps, in-page AI Q&A guide, and exportable roadmap study sheet.

---

### 1. Overview & Core Concept

- **What It Does**: JobSnap is an intelligent career automation engine and candidate operating system. It crawls job markets across platforms using keyword filters, scores resume compatibility (0–100% Relevance Score with "Perfect for you" verdicts), synchronizes follow-up milestones into Google Calendar, dispatches Excel scan reports to email, enables direct recruiter outreach via an AI-powered Outreach Studio, and generates step-by-step skill gap roadmaps.
- **Target Audience / Persona**:
  1. *Job Seekers*: Engineers, tradespeople, maritime professionals, and career pivoters seeking accelerated placement and transparent application pipelines.
  2. *Recruiters & Enterprise Teams*: Talent acquisition leads seeking candidate discovery, automated outreach cadences, and pipeline visibility.
- **Key Value**: Replaces 20+ hours of weekly manual searching, resume tailoring, and spreadsheet tracking with an automated, synchronized, and actionable agent workflow.

---

### 2. User Experience & Visual Design

#### Key User Flows

1. **Authentication Flow**:
   - User lands on the Login modal / view.
   - Selects Account Role: **Job Seeker** or **Recruiter / Enterprise**.
   - Inputs Username and Password with encryption badge.
   - Upon sign-in, the system initializes the session, populates the operator name as the username, and unlocks the complete agent workspace.

2. **Smart Scan & Enterprise Console Flow**:
   - The user opens the Enterprise Console on the left.
   - Selects **Scan Mode**:
     - *Fast Mode*: Rapid scan cycle (~60s simulation) for urgent opportunities.
     - *Deep Mode*: Comprehensive multi-platform crawl (~3m simulation) discovering deep-tier and niche postings.
   - Enters target keywords (e.g., "Python", "Electrical", "Merchant Navy", "Cloud Architect").
   - Configures Location, Experience Level, and Job Type (Full-time, Part-time, Contract, Internship).
   - Clicks **Save Profile** to lock preferences in storage.
   - Clicks **Start Search**: The console triggers the active progress bar (Pending → Progress), animates real-time platform scraping, and populates new matching jobs into the dashboard.

3. **AI Jobs Dashboard & Market Intel**:
   - Header displays Operator badge, profile avatar, theme switch (Dark / Light mode), and notifications.
   - Quick KPI cards:
     - **New Jobs**: Discovered opportunities from latest scan.
     - **Pipeline**: In-progress applications.
     - **Offers**: Active proposals and interviews.
     - **Market Intel**: Live hiring sentiment, salary trends, and curated industry news.
     - **Daily Signal & Motivational Quote**: Daily uplifting quote curated to boost candidate resilience.
   - **Top Job Picks For You**: Filterable job cards showing platform source (LinkedIn, Indeed, YC, MaritimeBoard), calibrated 0–100% Relevance Score, match verdict ("Perfect for you", "Strong match"), key required skills matched against user profile, salary bracket, and direct 1-click apply action.

4. **Email Settings & Reporting Flow**:
   - User navigates to Email Settings in the workspace.
   - Enters recipient email addresses.
   - Triggers Excel / CSV report export: formats scanned jobs, relevance scores, and application links into an attached downloadable spreadsheet with email notification feedback.

5. **Google Calendar Integration Flow**:
   - **Test Google Calendar**: Verifies API connectivity with status indicator.
   - **Sign In with Google Calendar**: Authenticates via an independent Google account.
   - **Sync Jobs with Calendar**: Syncs application milestones, follow-up reminders, and interview checks.
   - **In-Page Calendar Event Viewer**: Displays upcoming scheduled events with a live **Refresh Events** button directly on the dashboard.

6. **Profile Settings & Resume Intelligence Flow**:
   - Upload profile photo and enter full name, email, phone, location address.
   - Add professional links (LinkedIn, GitHub, Portfolio).
   - Upload Resume: Parses intelligence (extracts top skills, tools, and seniority).
   - Answer Legal Eligibility Questions:
     - *Willing to relocate?* [Yes / No]
     - *Legally authorized to work?* [Yes / No]
   - Default Cover Letter with **AI Generate / Enhance** button that crafts tailored prose from parsed resume data.
   - Click **Save Profile Settings** with instant persistence toast.

7. **Outreach Studio Flow**:
   - Dedicated outreach navigation tab.
   - **AI Recruiter Discovery**: User enters target recruiter role (e.g., "Tech Recruiter", "HR Manager", "Engineering Lead", "Founder", "Python HRs", "Java HRs").
   - Discovery crawls and renders verified recruiter contact cards with company, verified email badge, and direct message affordance.
   - **Message Wall**: 3 pre-built email templates:
     - Template 1: Direct Value Pitch & Referral Request
     - Template 2: Post-Application Follow-Up & Portfolio Highlight
     - Template 3: Warm Networking & Informational Coffee Chat
   - **Custom Template Creator**: Allows creating, saving, and reusing custom templates.
   - Direct message composer with instant dispatch feedback.

8. **Skill Gap & Roadmap Flow**:
   - Analyzes user's resume against live industry benchmarks for their target role.
   - Diagnoses critical skill gaps (e.g., missing distributed systems, specialized electrical CAD, or certification requirements).
   - Generates step-by-step learning roadmaps broken down into practical tasks, milestones, and hands-on projects.
   - In-page AI Q&A guide providing instant technical explanations and sample interview questions.
   - Export Roadmap to PDF / study sheet for offline tracking.

#### Visual Identity & Theme

- **Design Philosophy**: High-density, utilitarian SaaS dashboard complying with `frontend-design` and `references/3_saas_dashboard.md`.
- **Aesthetic Direction**: Deep Slate and Cool Charcoal canvas (`#0A0F1D` / `#0F172A`) paired with crisp emerald and cyan accents (`#10B981` / `#06B6D4`), subtle 1px border dividing lines (`border-slate-800`), and zero decorative slop (no pulsing green dots, no code comment headers).
- **Typography**: `Plus Jakarta Sans` for geometric, confident headings; `Inter` / `DM Sans` for readable 14px body prose; `JetBrains Mono` / tabular numerals (`tabular-nums`) for scores, timers, and metrics.
- **Theme Support**: Seamless Dark Mode / Light Mode toggle with synchronized CSS variables.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Modular Multi-View Architecture**:
  - *Chosen Approach*: Implement a cohesive client-side State Engine (`AgentStore`) governing authentication, scan filters, discovered jobs, calendar events, email queues, outreach contacts, and skill roadmaps.
  - *Why*: Allows instantaneous navigation between Dashboard, Enterprise Console, Outreach Studio, Calendar, Profile, and Skill Gap views without jarring page reloads or broken state.
- **Decision 2: Realistic Async Agent Simulation Engine**:
  - *Chosen Approach*: Build high-fidelity asynchronous progress simulations for Fast Scan (60s simulation with controllable speed boost), Deep Scan (180s simulation), AI Resume Parsing, AI Cover Letter generation, and Google Calendar syncing.
  - *Why*: Gives users an authentic, tangible experience of a production agent crawling multi-platform job boards in real time.
- **Decision 3: Independent Account Linking for Google Calendar**:
  - *Chosen Approach*: Allow the Google Calendar integration to authenticate independently of the primary JobSnap account username, directly supporting the user's specific request ("You can use some other account to sign in with Google").
- **Decision 4: Real CSV / Excel Export Generation**:
  - *Chosen Approach*: Generate authentic formatted `.csv` / `.xlsx`-compatible spreadsheet data client-side with a simulated email dispatch to the configured recipients.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

#### System Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        JobSnap Web Application                         │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark · Nav Links · Theme Toggle · Auth)     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │  Enterprise Console   │  │        Main Workspace Viewports       │  │
│  │   (Left Pinned Bar)   │  ├───────────────────────────────────────┤  │
│  ├───────────────────────┤  │ 1. AI Jobs Dashboard                  │  │
│  │ • Operator Username   │  │    - KPI Cards (New/Pipeline/Offers)  │  │
│  │ • Fast / Deep Mode    │  │    - Market Intel & News Feed         │  │
│  │ • Keyword Filters     │  │    - Daily Signal & Motivation Quote  │  │
│  │ • Location & Exp      │  │    - Top Job Picks (Relevance Scores) │  │
│  │ • Job Types           ├───────────────────────────────────────┤  │
│  │ • Save Profile        │ 2. Outreach Studio                    │  │
│  │ • Start Search CTA    │    - AI Recruiter Discovery Engine    │  │
│  │ • Search Progress Bar │    - Verified HR Contact Cards        │  │
│  ├───────────────────────┤    - Message Wall (3 Templates + New) │  │
│  │ • Email Reporting     ├───────────────────────────────────────┤  │
│  │   (Excel Recipient)   │ 3. Skill Gap & Roadmap Studio         │  │
│  ├───────────────────────┤    - Benchmark Resume Gap Diagnosis   │  │
│  │ • Google Calendar     │    - Step-by-Step Project Roadmaps    │  │
│  │   - Test Connection   │    - In-Page AI Explanations & PDF    │  │
│  │   - Google Sign-in    ├───────────────────────────────────────┤  │
│  │   - Sync Jobs         │ 4. Profile Settings & Resume Parser   │  │
│  │   - In-Page Events    │    - Avatar, Bio, Social Links        │  │
│  └───────────────────────┘    - Resume Intelligence Extractor    │  │
│                               │    - Legal Eligibility (Reloc/Auth)   │  │
│                               │    - AI Cover Letter Generator       │  │
│                             └───────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│  Underlying State & Storage (LocalStorage + Reactive Session Store)    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core State Model

```typescript
interface JobSnapState {
  auth: {
    isAuthenticated: boolean;
    operatorName: string;
    role: 'job_seeker' | 'recruiter_enterprise';
    email: string;
  };
  scanner: {
    mode: 'fast' | 'deep';
    keywords: string;
    location: string;
    experience: string;
    jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
    isSearching: boolean;
    searchProgress: number; // 0 - 100%
    status: 'idle' | 'pending' | 'in_progress' | 'completed';
  };
  emailSettings: {
    recipients: string[];
    sendExcelAttachment: boolean;
    lastDispatchedAt: string | null;
  };
  calendar: {
    isConnected: boolean;
    googleAccountEmail: string | null;
    isTesting: boolean;
    testStatus: 'idle' | 'testing' | 'success' | 'failed';
    syncedEvents: CalendarEvent[];
  };
  profile: {
    avatarUrl: string;
    fullName: string;
    email: string;
    phone: string;
    locationAddress: string;
    links: { linkedin: string; github: string; portfolio: string };
    resumeParsed: {
      fileName: string;
      parsedAt: string;
      extractedSkills: string[];
      experienceYears: number;
    } | null;
    legal: {
      willingToRelocate: boolean;
      legallyAuthorized: boolean;
    };
    coverLetter: string;
  };
  outreach: {
    searchRole: string;
    recruiters: RecruiterContact[];
    templates: MessageTemplate[];
    activeTemplateId: string;
  };
  skillRoadmap: {
    targetRole: string;
    diagnosedGaps: SkillGap[];
    roadmapSteps: RoadmapStep[];
  };
}
```

---

### Implementation Phases & Verification

1. **Phase 1: State Management & Modal/View Architecture**
   - Implement `jobSnapStore.ts` to manage all persistence (credentials, search filters, jobs, calendar events, outreach contacts, and profile).
2. **Phase 2: Auth Screen & Role Selection**
   - Build the encrypted sign-in modal with Job Seeker vs. Recruiter/Enterprise selection.
3. **Phase 3: Left-Hand Enterprise Console**
   - Operator badge, Fast (~60s) / Deep (~3m) switcher, multi-keyword input, filter selectors, Save Profile, and dynamic progress bar.
4. **Phase 4: AI Jobs Dashboard & Market Intel**
   - Top metrics, Market Intel feed, daily motivational signal quotes, and Top Job Picks with calibrated Relevance Scores.
5. **Phase 5: Email Settings & Google Calendar Integration**
   - Excel export & email recipient manager; Google Calendar test, independent sign-in, job milestone sync, and in-page event viewer with refresh.
6. **Phase 6: Profile Settings & Resume Intelligence**
   - Photo upload, professional links, resume parser, relocation & work authorization checks, and AI cover letter creator.
7. **Phase 7: Outreach Studio & Message Wall**
   - Recruiter discovery search, contact roster, 3 pre-configured message templates + custom template editor, and email dispatcher.
8. **Phase 8: Skill Gap & Learning Roadmap**
   - Benchmark gap analyzer, milestone roadmap generator, instant AI Q&A answers, and PDF export preview.
9. **Phase 9: Verification**
   - Build verification using `compile_applet` and syntax audit with `lint_applet`.
