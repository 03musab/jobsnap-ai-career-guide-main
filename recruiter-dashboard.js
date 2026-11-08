const stages = ["Applied", "Reviewed", "Shortlisted", "Interview", "Offer", "Hired"];
const stageRank = new Map(stages.map((stage, index) => [stage, index]));
const stageColors = {
  Applied: "#83aaff",
  Reviewed: "#aaa2ff",
  Shortlisted: "#67dcae",
  Interview: "#bd9af6",
  Offer: "#edc16e",
  Hired: "#65dda0",
};

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
};

const jobs = [
  { id: "job-platform", title: "Senior Platform Engineer", department: "Engineering", location: "Remote · United States", type: "Full-time", health: 94, postedAt: daysAgo(16), isActive: true },
  { id: "job-product", title: "Product Designer", department: "Product & Design", location: "New York, NY · Hybrid", type: "Full-time", health: 88, postedAt: daysAgo(12), isActive: true },
  { id: "job-ml", title: "AI / ML Engineer", department: "Applied AI", location: "San Francisco, CA · Hybrid", type: "Full-time", health: 96, postedAt: daysAgo(8), isActive: true },
];

const candidates = [
  {
    id: "candidate-ava", name: "Ava Patel", email: "ava.patel@example.com", role: "Senior Platform Engineer", jobId: "job-platform", stage: "Interview", matchScore: 94, appliedAt: daysAgo(0), experience: "8 years", workAuthorization: "Authorized to work in US", relocation: "Open to relocation",
    skills: ["Kubernetes", "AWS", "Go", "Terraform", "Platform engineering", "Docker", "CI/CD", "Observability", "Python", "Argo CD"],
    summary: "Platform engineer focused on reliable developer infrastructure. Ava has led multi-region Kubernetes migrations and improved deployment confidence across high-growth engineering teams.",
    history: [{ title: "Staff Platform Engineer", company: "Northstar Labs", dates: "2021 – Present" }, { title: "Senior Software Engineer", company: "Brightworks", dates: "2018 – 2021" }],
    links: { LinkedIn: "https://www.linkedin.com/", GitHub: "https://github.com/" }, hiredAt: null, color: "#77a9ff",
  },
  {
    id: "candidate-mateo", name: "Mateo Chen", email: "mateo.chen@example.com", role: "Product Designer", jobId: "job-product", stage: "Shortlisted", matchScore: 86, appliedAt: daysAgo(1), experience: "6 years", workAuthorization: "Authorized to work in US", relocation: "Not needed",
    skills: ["Product design", "Figma", "Prototyping", "Design systems", "User research", "Accessibility", "Workshop facilitation", "Interaction design", "HTML", "CSS"],
    summary: "Product designer who turns complex workflows into clear, approachable experiences. Mateo brings strong research habits and a track record of scaling design systems.",
    history: [{ title: "Senior Product Designer", company: "Orbit Health", dates: "2022 – Present" }, { title: "Product Designer", company: "Commonplace", dates: "2019 – 2022" }],
    links: { LinkedIn: "https://www.linkedin.com/", Portfolio: "https://www.behance.net/" }, hiredAt: null, color: "#bb9cff",
  },
  {
    id: "candidate-priya", name: "Priya Nair", email: "priya.nair@example.com", role: "AI / ML Engineer", jobId: "job-ml", stage: "Applied", matchScore: 78, appliedAt: daysAgo(2), experience: "5 years", workAuthorization: "Authorized to work in US", relocation: "Open to relocation",
    skills: ["Python", "PyTorch", "LLMs", "NLP", "Model evaluation", "MLOps", "Vector search", "FastAPI", "SQL"],
    summary: "Machine learning engineer with a practical focus on building and evaluating language model applications. Priya has shipped production ML services and robust evaluation workflows.",
    history: [{ title: "Machine Learning Engineer", company: "Helio AI", dates: "2021 – Present" }, { title: "Data Scientist", company: "Nimble Systems", dates: "2019 – 2021" }],
    links: { LinkedIn: "https://www.linkedin.com/", GitHub: "https://github.com/" }, hiredAt: null, color: "#73d9b1",
  },
  {
    id: "candidate-jordan", name: "Jordan Brooks", email: "jordan.brooks@example.com", role: "Product Designer", jobId: "job-product", stage: "Offer", matchScore: 92, appliedAt: daysAgo(3), experience: "9 years", workAuthorization: "Authorized to work in US", relocation: "Not needed",
    skills: ["Product strategy", "Figma", "Design leadership", "Prototyping", "User research", "Design systems", "Accessibility", "Facilitation", "Service design"],
    summary: "Design leader who pairs strong craft with product strategy. Jordan has built cohesive experiences across web and mobile products while mentoring multidisciplinary teams.",
    history: [{ title: "Lead Product Designer", company: "Marble", dates: "2020 – Present" }, { title: "Product Designer", company: "Kiteworks", dates: "2016 – 2020" }],
    links: { LinkedIn: "https://www.linkedin.com/", Portfolio: "https://www.behance.net/" }, hiredAt: null, color: "#f0bf72",
  },
  {
    id: "candidate-samira", name: "Samira Khan", email: "samira.khan@example.com", role: "AI / ML Engineer", jobId: "job-ml", stage: "Hired", matchScore: 91, appliedAt: daysAgo(5), experience: "7 years", workAuthorization: "Authorized to work in US", relocation: "Not needed",
    skills: ["PyTorch", "Python", "Recommendation systems", "MLOps", "Experimentation", "Feature engineering", "Spark", "AWS", "Model serving"],
    summary: "Applied ML engineer who builds measurable, dependable recommendation systems. Samira has taken models from experimentation through production and ongoing monitoring.",
    history: [{ title: "Senior Machine Learning Engineer", company: "Lattice", dates: "2021 – Present" }, { title: "ML Engineer", company: "Horizon Data", dates: "2018 – 2021" }],
    links: { LinkedIn: "https://www.linkedin.com/", GitHub: "https://github.com/" }, hiredAt: daysAgo(1), color: "#f18f9b",
  },
  {
    id: "candidate-noah", name: "Noah Williams", email: "noah.williams@example.com", role: "Senior Platform Engineer", jobId: "job-platform", stage: "Rejected", matchScore: 58, appliedAt: daysAgo(6), experience: "4 years", workAuthorization: "Requires sponsorship", relocation: "Not open to relocation",
    skills: ["AWS", "Docker", "Linux", "Python", "CI/CD", "Monitoring"],
    summary: "Cloud infrastructure engineer with a background in automation and service operations.",
    history: [{ title: "Cloud Engineer", company: "Westline", dates: "2022 – Present" }],
    links: { LinkedIn: "https://www.linkedin.com/" }, hiredAt: null, color: "#8d99a9",
  },
  {
    id: "candidate-elena", name: "Elena Garcia", email: "elena.garcia@example.com", role: "Product Designer", jobId: "job-product", stage: "Reviewed", matchScore: 72, appliedAt: daysAgo(7), experience: "5 years", workAuthorization: "Authorized to work in US", relocation: "Open to relocation",
    skills: ["Figma", "UX research", "Visual design", "Prototyping", "Design systems", "Mobile design", "Accessibility", "Usability testing", "CSS"],
    summary: "Product designer with a thoughtful, detail-oriented approach to improving everyday user journeys. Elena combines qualitative research with strong visual craft.",
    history: [{ title: "Product Designer", company: "Fieldwork", dates: "2021 – Present" }, { title: "UX Designer", company: "Lumen", dates: "2019 – 2021" }],
    links: { LinkedIn: "https://www.linkedin.com/", Portfolio: "https://www.behance.net/" }, hiredAt: null, color: "#d293f5",
  },
  {
    id: "candidate-marcus", name: "Marcus Reed", email: "marcus.reed@example.com", role: "AI / ML Engineer", jobId: "job-ml", stage: "Applied", matchScore: 54, appliedAt: daysAgo(9), experience: "3 years", workAuthorization: "Authorized to work in US", relocation: "Not needed",
    skills: ["Python", "Scikit-learn", "SQL", "Pandas", "Data analysis"],
    summary: "Early-career data scientist interested in applied machine learning and product experimentation.",
    history: [{ title: "Data Scientist", company: "Cedar Analytics", dates: "2023 – Present" }],
    links: { LinkedIn: "https://www.linkedin.com/", GitHub: "https://github.com/" }, hiredAt: null, color: "#80c9f2",
  },
  {
    id: "candidate-zoe", name: "Zoe Kim", email: "zoe.kim@example.com", role: "Senior Platform Engineer", jobId: "job-platform", stage: "Shortlisted", matchScore: 89, appliedAt: daysAgo(11), experience: "7 years", workAuthorization: "Authorized to work in US", relocation: "Not needed",
    skills: ["Go", "Kubernetes", "AWS", "Terraform", "Service mesh", "Prometheus", "SRE", "Incident response", "Python"],
    summary: "Infrastructure engineer specializing in resilient systems and paved roads for product teams. Zoe has improved service reliability while simplifying platform operations.",
    history: [{ title: "Senior Site Reliability Engineer", company: "Fable", dates: "2021 – Present" }, { title: "Systems Engineer", company: "Grove Tech", dates: "2018 – 2021" }],
    links: { LinkedIn: "https://www.linkedin.com/", GitHub: "https://github.com/" }, hiredAt: null, color: "#68d6c6",
  },
  {
    id: "candidate-daniel", name: "Daniel Park", email: "daniel.park@example.com", role: "Product Designer", jobId: "job-product", stage: "Interview", matchScore: 68, appliedAt: daysAgo(13), experience: "6 years", workAuthorization: "Authorized to work in US", relocation: "Open to relocation",
    skills: ["Interaction design", "Figma", "Design systems", "User research", "Prototyping", "Illustration", "Web design", "Accessibility"],
    summary: "Product designer with a multidisciplinary background in interaction, visual, and service design. Daniel enjoys making complex tools feel intuitive.",
    history: [{ title: "Product Designer", company: "Plainview", dates: "2020 – Present" }, { title: "UX Designer", company: "Aster", dates: "2018 – 2020" }],
    links: { LinkedIn: "https://www.linkedin.com/", Portfolio: "https://www.behance.net/" }, hiredAt: null, color: "#9bb6ff",
  },
];

const funnelStages = ["Applied", "Reviewed", "Shortlisted", "Interview", "Offer", "Hired"];
const elements = {
  applicantRows: document.getElementById("applicant-rows"),
  applicantEmpty: document.getElementById("applicant-empty"),
  applicantCount: document.getElementById("applicant-result-count"),
  applicantSearch: document.getElementById("applicant-search"),
  stageFilter: document.getElementById("stage-filter"),
  positionFilter: document.getElementById("position-filter"),
  sortFilter: document.getElementById("sort-filter"),
  requisitionRows: document.getElementById("requisition-rows"),
  requisitionEmpty: document.getElementById("requisition-empty"),
  candidateDialog: document.getElementById("candidate-dialog"),
  candidateProfile: document.getElementById("candidate-profile"),
  postJobDialog: document.getElementById("post-job-dialog"),
  postJobForm: document.getElementById("post-job-form"),
  toastRegion: document.getElementById("toast-region"),
};

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[character]));

const initials = (name) => name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
const stageClass = (stage) => `stage-${stage.toLowerCase().replace(/\s+/g, "-")}`;
const getJob = (jobId) => jobs.find((job) => job.id === jobId);

function formatDate(dateString, options = { month: "short", day: "numeric" }) {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
}

function getVisibleCandidates() {
  const query = elements.applicantSearch.value.trim().toLowerCase();
  const selectedStage = elements.stageFilter.value;
  const selectedPosition = elements.positionFilter.value;
  const filtered = candidates.filter((candidate) => {
    const job = getJob(candidate.jobId);
    const matchesText = !query || [candidate.name, candidate.email, candidate.role, job?.title].some((value) => value?.toLowerCase().includes(query));
    const matchesStage = selectedStage === "All" || candidate.stage === selectedStage;
    const matchesPosition = selectedPosition === "All" || candidate.jobId === selectedPosition;
    return matchesText && matchesStage && matchesPosition;
  });

  if (elements.sortFilter.value === "newest") {
    filtered.sort((left, right) => Date.parse(right.appliedAt) - Date.parse(left.appliedAt));
  } else if (elements.sortFilter.value === "name") {
    filtered.sort((left, right) => left.name.localeCompare(right.name));
  } else {
    filtered.sort((left, right) => right.matchScore - left.matchScore);
  }
  return filtered;
}

function renderOverview() {
  const activeJobs = jobs.filter((job) => job.isActive);
  const activeCandidates = candidates.filter((candidate) => candidate.stage !== "Rejected");
  const interviews = candidates.filter((candidate) => candidate.stage === "Interview").length;
  const now = new Date();
  const hiresThisMonth = candidates.filter((candidate) => {
    if (candidate.stage !== "Hired" || !candidate.hiredAt) return false;
    const hiredAt = new Date(candidate.hiredAt);
    return hiredAt.getFullYear() === now.getFullYear() && hiredAt.getMonth() === now.getMonth();
  }).length;
  const aiHealth = activeJobs.length
    ? Math.round(activeJobs.reduce((total, job) => total + job.health, 0) / activeJobs.length)
    : 0;

  const statActiveJobs = document.getElementById("stat-active-jobs");
  if (statActiveJobs) statActiveJobs.textContent = activeJobs.length;
  const statApps = document.getElementById("stat-applications");
  if (statApps) statApps.textContent = candidates.length;
  const statInts = document.getElementById("stat-interviews");
  if (statInts) statInts.textContent = interviews;
  const statHires = document.getElementById("stat-hires");
  if (statHires) statHires.textContent = hiresThisMonth;
  const statHealth = document.getElementById("stat-ai-health");
  if (statHealth) statHealth.textContent = aiHealth;
  const healthTrack = document.getElementById("ai-health-track");
  if (healthTrack) healthTrack.style.width = `${aiHealth}%`;
  const navApplicantCount = document.getElementById("nav-applicant-count");
  if (navApplicantCount) navApplicantCount.textContent = candidates.length;

  const averageFit = candidates.length
    ? Math.round(candidates.reduce((total, candidate) => total + candidate.matchScore, 0) / candidates.length)
    : 0;
  const qualified = candidates.length
    ? Math.round((candidates.filter((candidate) => candidate.matchScore >= 60).length / candidates.length) * 100)
    : 0;
  const inPipeline = candidates.filter((candidate) => ["Shortlisted", "Interview"].includes(candidate.stage)).length;
  const topMatch = [...candidates].sort((left, right) => right.matchScore - left.matchScore)[0];

  document.getElementById("avg-fit").textContent = `${averageFit}%`;
  document.getElementById("qualified-rate").textContent = `${qualified}%`;
  document.getElementById("in-pipeline-count").textContent = inPipeline;
  document.getElementById("top-match-name").textContent = topMatch ? `${topMatch.name} (${topMatch.matchScore}%)` : "—";
}

function renderPipeline() {
  const eligible = candidates.filter((candidate) => candidate.stage !== "Rejected");
  const reachedCounts = funnelStages.map((stage) => eligible.filter((candidate) => stageRank.get(candidate.stage) >= stageRank.get(stage)).length);
  const total = eligible.length;
  const funnel = document.getElementById("pipeline-funnel");

  funnel.innerHTML = funnelStages.map((stage, index) => {
    const count = reachedCounts[index];
    const nextCount = reachedCounts[index + 1];
    const share = total ? Math.round((count / total) * 100) : 0;
    const conversion = index < funnelStages.length - 1
      ? `${count ? Math.round((nextCount / count) * 100) : 0}% continue to next stage`
      : "100% hired";
    const width = total ? Math.max(count ? 3 : 0, Math.round((count / total) * 100)) : 0;
    return `<div class="funnel-row" data-funnel-stage="${stage}" role="button" tabindex="0" title="Click to filter candidates by ${stage} stage" style="--stage-color:${stageColors[stage]}; cursor: pointer;">
      <div class="funnel-stage"><span class="funnel-stage-mark"></span>${stage}</div>
      <div class="funnel-track"><div class="funnel-fill" style="width:${width}%"></div></div>
      <div class="funnel-count">${count} <span>(${share}%)</span></div>
      <div class="funnel-meta"><span>${share}% conversion from start</span><strong>${conversion}</strong></div>
    </div>`;
  }).join("");
}

function renderVelocity() {
  const today = new Date();
  const dailyCounts = Array.from({ length: 14 }, (_, index) => {
    const daysBack = 13 - index;
    const target = new Date();
    target.setDate(today.getDate() - daysBack);
    return candidates.filter((candidate) => {
      const applied = new Date(candidate.appliedAt);
      return applied.getFullYear() === target.getFullYear()
        && applied.getMonth() === target.getMonth()
        && applied.getDate() === target.getDate();
    }).length;
  });
  const total = dailyCounts.reduce((sum, count) => sum + count, 0);
  const max = Math.max(2, ...dailyCounts);
  const width = 700;
  const height = 190;
  const left = 10;
  const right = 10;
  const top = 14;
  const bottom = 17;
  const graphWidth = width - left - right;
  const graphHeight = height - top - bottom;
  const points = dailyCounts.map((count, index) => ({
    x: left + (graphWidth * index) / (dailyCounts.length - 1),
    y: top + graphHeight - (count / max) * graphHeight,
    count,
  }));
  const linePath = points.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - bottom} L ${points[0].x} ${height - bottom} Z`;
  const gridLines = [0, 1, 2, 3].map((index) => {
    const y = top + (graphHeight * index) / 3;
    return `<line class="chart-grid-line" x1="${left}" y1="${y}" x2="${width - right}" y2="${y}"></line>`;
  }).join("");
  const dots = points.map((point, index) => {
    const daysBack = 13 - index;
    const target = new Date();
    target.setDate(today.getDate() - daysBack);
    const dateStr = formatDate(target, { month: "short", day: "numeric" });
    const matching = candidates.filter((candidate) => {
      const applied = new Date(candidate.appliedAt);
      return applied.getFullYear() === target.getFullYear()
        && applied.getMonth() === target.getMonth()
        && applied.getDate() === target.getDate();
    });
    const names = matching.map(c => c.name).join(", ");
    return `<circle class="chart-point" data-date="${dateStr}" data-count="${point.count}" data-names="${escapeHTML(names)}" cx="${point.x}" cy="${point.y}" r="${point.count ? 4.5 : 2.8}"><title>${point.count} application${point.count === 1 ? "" : "s"} on ${dateStr}${names ? ` (${names})` : ""}</title></circle>`;
  }).join("");
  const labels = dailyCounts.map((_, index) => {
    if (![0, 3, 6, 9, 13].includes(index)) return "";
    const date = new Date();
    date.setDate(today.getDate() - (13 - index));
    return `<span>${formatDate(date, { month: "short", day: "numeric" })}</span>`;
  });

  document.getElementById("velocity-total").textContent = total;
  document.getElementById("velocity-daily-average").textContent = `${(total / 14).toFixed(1)} avg. / day`;
  document.getElementById("chart-y-labels").innerHTML = [max, Math.round(max * 2 / 3), Math.round(max / 3), 0].map((value) => `<span>${value}</span>`).join("");
  document.getElementById("chart-x-labels").innerHTML = labels.filter(Boolean).join("");
  document.getElementById("velocity-chart").innerHTML = `
    <defs><linearGradient id="chart-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#65ddb2" stop-opacity=".2"></stop><stop offset="100%" stop-color="#65ddb2" stop-opacity="0"></stop></linearGradient></defs>
    ${gridLines}<path class="chart-area" d="${areaPath}"></path><path class="chart-line" d="${linePath}"></path>${dots}`;

  // Attach interactive tooltip on chart points
  const tooltip = document.getElementById("chart-tooltip");
  const chartCanvas = document.querySelector(".chart-canvas");
  if (tooltip && chartCanvas) {
    chartCanvas.querySelectorAll(".chart-point").forEach((point) => {
      point.addEventListener("mouseenter", (e) => {
        const count = point.dataset.count;
        const date = point.dataset.date;
        const names = point.dataset.names;
        tooltip.innerHTML = `<strong>${date}</strong>: ${count} application${count === "1" ? "" : "s"}${names ? `<br><small>${names}</small>` : ""}`;
        tooltip.hidden = false;
      });
      point.addEventListener("mousemove", (e) => {
        const rect = chartCanvas.getBoundingClientRect();
        const x = Math.max(10, Math.min(rect.width - 150, e.clientX - rect.left + 10));
        const y = Math.max(5, e.clientY - rect.top - 38);
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
      });
      point.addEventListener("mouseleave", () => {
        tooltip.hidden = true;
      });
    });
  }
}

function populatePositionFilter() {
  const previous = elements.positionFilter.value || "All";
  const options = jobs.map((job) => `<option value="${escapeHTML(job.id)}">${escapeHTML(job.title)}${job.isActive ? "" : " · Closed"}</option>`).join("");
  elements.positionFilter.innerHTML = `<option value="All">All positions</option>${options}`;
  if (jobs.some((job) => job.id === previous)) elements.positionFilter.value = previous;
}

function renderApplicants() {
  const visible = getVisibleCandidates();
  elements.applicantRows.innerHTML = visible.map((candidate) => {
    const scoreColor = candidate.matchScore >= 80 ? "#70ddb3" : candidate.matchScore >= 60 ? "#e9c16d" : "#e39191";
    return `<tr>
      <td><div class="candidate-cell">
        <span class="candidate-avatar" style="--avatar-color:${candidate.color}">${escapeHTML(initials(candidate.name))}</span>
        <span class="candidate-name-wrap"><button class="candidate-name" type="button" data-profile="${escapeHTML(candidate.id)}">${escapeHTML(candidate.name)}</button><span class="candidate-email">${escapeHTML(candidate.email)}</span></span>
      </div></td>
      <td class="role-cell">${escapeHTML(candidate.role)}</td>
      <td><span class="stage-pill ${stageClass(candidate.stage)}">${escapeHTML(candidate.stage)}</span></td>
      <td><span class="fit-score"><span class="fit-bar"><span style="width:${candidate.matchScore}%;--fit-color:${scoreColor}"></span></span>${candidate.matchScore}%</span></td>
      <td class="applied-date">${formatDate(candidate.appliedAt)}</td>
      <td><button class="row-profile" type="button" data-profile="${escapeHTML(candidate.id)}">Profile</button></td>
    </tr>`;
  }).join("");
  elements.applicantEmpty.hidden = visible.length > 0;
  elements.applicantCount.textContent = `Showing ${visible.length} of ${candidates.length} candidate${candidates.length === 1 ? "" : "s"}`;
}

function renderRequisitions() {
  const activeJobs = jobs.filter((job) => job.isActive);
  elements.requisitionRows.innerHTML = activeJobs.map((job) => {
    const applicantCount = candidates.filter((candidate) => candidate.jobId === job.id).length;
    return `<tr>
      <td><div class="role-name">${escapeHTML(job.title)}</div><div class="role-department">${escapeHTML(job.department)} · ${escapeHTML(job.type)}</div></td>
      <td class="location-cell">${escapeHTML(job.location)}</td>
      <td class="applicant-count-cell"><strong>${applicantCount}</strong><span>applicants</span></td>
      <td><span class="job-health"><span class="job-health-track"><span style="width:${job.health}%"></span></span>${job.health}%</span></td>
      <td class="applied-date">${formatDate(job.postedAt)}</td>
      <td><button class="close-role-button" type="button" data-close-role="${escapeHTML(job.id)}">Close listing</button></td>
    </tr>`;
  }).join("");
  elements.requisitionEmpty.hidden = activeJobs.length > 0;
}

function renderAll() {
  populatePositionFilter();
  renderOverview();
  renderPipeline();
  renderVelocity();
  renderApplicants();
  renderRequisitions();
}

function toast(message) {
  const item = document.createElement("div");
  item.className = "toast";
  item.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>${escapeHTML(message)}</span>`;
  elements.toastRegion.append(item);
  window.setTimeout(() => item.remove(), 3200);
}

function openCandidateProfile(candidateId) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return;
  const job = getJob(candidate.jobId);
  const visibleSkills = candidate.skills.slice(0, 8);
  const extraSkills = candidate.skills.slice(8);
  const links = Object.entries(candidate.links);
  const profile = `
    <div class="profile-top">
      <span class="profile-avatar" style="--avatar-color:${candidate.color}">${escapeHTML(initials(candidate.name))}</span>
      <div class="profile-heading"><h2 id="profile-name">${escapeHTML(candidate.name)}</h2><p class="profile-role">${escapeHTML(candidate.role)} · ${escapeHTML(candidate.stage)}</p><div class="profile-email">${escapeHTML(candidate.email)}</div></div>
      <button class="dialog-close" type="button" data-close-dialog="candidate-dialog" aria-label="Close profile"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="profile-score"><div><span class="profile-score-label">AI fit score</span><small>Based on skills and role alignment</small></div><strong>${candidate.matchScore}%</strong></div>
    <div class="profile-facts">
      <div class="profile-fact"><span>Experience</span><strong>${escapeHTML(candidate.experience)}</strong></div>
      <div class="profile-fact"><span>Work authorization</span><strong>${escapeHTML(candidate.workAuthorization)}</strong></div>
      <div class="profile-fact"><span>Relocation</span><strong>${escapeHTML(candidate.relocation)}</strong></div>
    </div>
    <div class="privacy-protect-callout">
      <i class="fa-solid fa-shield-halved"></i>
      <div>
        <strong>Privacy Protected</strong>
        <p>Private account details, passwords, and sensitive system info are never shown.</p>
      </div>
    </div>
    <section class="profile-section"><h3>Executive summary</h3><p>${escapeHTML(candidate.summary)}</p></section>
    <section class="profile-section"><h3>AI-verified skills</h3><div class="skill-list">
      ${visibleSkills.map((skill) => `<span class="skill-chip">${escapeHTML(skill)}</span>`).join("")}
      ${extraSkills.length ? `<span class="extra-skills" hidden>${extraSkills.map((skill) => `<span class="skill-chip">${escapeHTML(skill)}</span>`).join("")}</span><button class="skills-more" type="button" data-show-skills>+${extraSkills.length} more</button>` : ""}
    </div></section>
    <section class="profile-section"><h3>Past job history</h3>${candidate.history.map((item) => `<div class="history-item"><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.company)} · ${escapeHTML(item.dates)}</span></div>`).join("")}</section>
    ${links.length ? `<section class="profile-section"><h3>Links & Portfolios</h3><div class="profile-links">${links.map(([label, url]) => `<a class="profile-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><i class="${label === "Portfolio" ? "fa-solid fa-globe" : `fa-brands fa-${label.toLowerCase()}`}"></i>${escapeHTML(label)}<i class="fa-solid fa-arrow-up-right-from-square"></i></a>`).join("")}</div></section>` : ""}
    <div class="profile-actions-title">Pipeline Decision (1-Click)</div>
    <div class="profile-actions">
      <button class="button button-secondary ${candidate.stage === 'Shortlisted' ? 'decision-selected' : ''}" type="button" data-candidate-action="Shortlisted" data-candidate-id="${escapeHTML(candidate.id)}" title="Move to Shortlisted">
        <i class="fa-solid fa-star"></i> Shortlist${candidate.stage === 'Shortlisted' ? ' · Active' : ''}
      </button>
      <button class="button button-primary ${candidate.stage === 'Interview' ? 'decision-selected-primary' : ''}" type="button" data-candidate-action="Interview" data-candidate-id="${escapeHTML(candidate.id)}" title="Move to Schedule Interview">
        <i class="fa-regular fa-calendar-check"></i> Schedule interview${candidate.stage === 'Interview' ? ' · Active' : ''}
      </button>
      <button class="button button-quiet ${candidate.stage === 'Rejected' ? 'decision-selected-quiet' : ''}" type="button" data-candidate-action="Rejected" data-candidate-id="${escapeHTML(candidate.id)}" title="Reject candidate">
        <i class="fa-solid fa-xmark"></i> Reject${candidate.stage === 'Rejected' ? ' · Rejected' : ''}
      </button>
    </div>
    ${job ? `<div class="profile-role-context">Applied for ${escapeHTML(job.title)} · ${formatDate(candidate.appliedAt)}</div>` : ""}`;
  elements.candidateProfile.innerHTML = profile;
  if (!elements.candidateDialog.open) elements.candidateDialog.showModal();
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog?.open) dialog.close();
}

function updateCandidateStage(candidateId, nextStage) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return;
  candidate.stage = nextStage;
  candidate.hiredAt = nextStage === "Hired" ? new Date().toISOString() : null;
  renderAll();
  openCandidateProfile(candidateId);
  toast(`${candidate.name} moved to ${nextStage.toLowerCase()}.`);
}

function exportCSV() {
  const visible = getVisibleCandidates();
  if (!visible.length) {
    toast("There are no applicants in the current view to export.");
    return;
  }
  const columns = [
    "Candidate Name",
    "Email Address",
    "Position Applied",
    "Stage",
    "AI Fit Score",
    "Total Experience",
    "Work Authorization",
    "Relocation Willingness",
    "Date Applied",
    "AI-Verified Skills",
    "Executive Summary"
  ];
  const rows = visible.map((candidate) => [
    candidate.name,
    candidate.email,
    candidate.role,
    candidate.stage,
    `${candidate.matchScore}%`,
    candidate.experience,
    candidate.workAuthorization,
    candidate.relocation,
    formatDate(candidate.appliedAt, { year: "numeric", month: "2-digit", day: "2-digit" }),
    candidate.skills.join("; "),
    candidate.summary,
  ]);
  const csvEscape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [columns, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `JobSnap-Recruiter-Applicants-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`Exported ${visible.length} applicant${visible.length === 1 ? "" : "s"} to Excel CSV.`);
}

function openPostJobDialog() {
  elements.postJobForm.reset();
  elements.postJobDialog.showModal();
}

document.getElementById("export-csv")?.addEventListener("click", exportCSV);
document.getElementById("open-post-job")?.addEventListener("click", openPostJobDialog);
document.getElementById("open-post-job-secondary")?.addEventListener("click", openPostJobDialog);

document.addEventListener("click", (event) => {
  const funnelRow = event.target.closest("[data-funnel-stage]");
  if (funnelRow) {
    const stage = funnelRow.dataset.funnelStage;
    elements.stageFilter.value = stage;
    renderApplicants();
    document.getElementById("applicants")?.scrollIntoView({ behavior: "smooth" });
    toast(`Filtered to candidates in ${stage} stage.`);
  }

  const profileTrigger = event.target.closest("[data-profile]");
  if (profileTrigger) openCandidateProfile(profileTrigger.dataset.profile);

  const action = event.target.closest("[data-candidate-action]");
  if (action) updateCandidateStage(action.dataset.candidateId, action.dataset.candidateAction);

  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) closeDialog(closeButton.dataset.closeDialog);

  const closeRole = event.target.closest("[data-close-role]");
  if (closeRole) {
    const job = getJob(closeRole.dataset.closeRole);
    if (!job) return;
    job.isActive = false;
    renderAll();
    toast(`${job.title} listing closed.`);
  }

  const showSkills = event.target.closest("[data-show-skills]");
  if (showSkills) {
    const extraSkills = elements.candidateProfile.querySelector(".extra-skills");
    if (extraSkills) extraSkills.hidden = false;
    showSkills.remove();
  }
});

for (const dialog of [elements.candidateDialog, elements.postJobDialog]) {
  if (dialog) {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
}

if (elements.postJobForm) {
  elements.postJobForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.postJobForm);
    const title = String(formData.get("title") || "").trim();
    const department = String(formData.get("department") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const type = String(formData.get("employmentType") || "Full-time");
    if (!title || !department || !location) {
      toast("Add a role title, department, and location to continue.");
      return;
    }
    jobs.unshift({
      id: `job-${Date.now()}`,
      title,
      department,
      location,
      type,
      health: 100,
      postedAt: new Date().toISOString(),
      isActive: true,
    });
    elements.postJobDialog?.close();
    renderAll();
    toast(`${title} is now an active demo requisition.`);
  });
}

document.querySelectorAll(".side-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".side-link").forEach((item) => item.classList.remove("is-active"));
    link.classList.add("is-active");
  });
});

document.querySelectorAll("[data-scroll]").forEach((card) => {
  const scrollToSection = () => document.getElementById(card.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
  card.addEventListener("click", scrollToSection);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToSection();
    }
  });
});

document.querySelectorAll("[data-stage-shortcut]").forEach((card) => {
  card.addEventListener("click", () => {
    if (elements.stageFilter) elements.stageFilter.value = card.dataset.stageShortcut;
    renderApplicants();
    document.getElementById("applicants")?.scrollIntoView({ behavior: "smooth" });
  });
});

for (const filter of [elements.applicantSearch, elements.stageFilter, elements.positionFilter, elements.sortFilter]) {
  if (filter) {
    filter.addEventListener(filter === elements.applicantSearch ? "input" : "change", renderApplicants);
  }
}

// Initial render of all recruiter dashboard showcase data
renderAll();

// --- Background Video Autoplay Enforcement ---
function initBackgroundVideo() {
  const video = document.querySelector(".bg-video");
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      const playOnInteract = () => {
        video.play().catch(() => {});
        window.removeEventListener("click", playOnInteract);
        window.removeEventListener("scroll", playOnInteract);
        window.removeEventListener("touchstart", playOnInteract);
      };
      window.addEventListener("click", playOnInteract, { once: true, passive: true });
      window.addEventListener("scroll", playOnInteract, { once: true, passive: true });
      window.addEventListener("touchstart", playOnInteract, { once: true, passive: true });
    });
  }
}
initBackgroundVideo();

// --- Web Audio Procedural Sound Effects Engine ---
class RecruiterSoundFX {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.enabled = true;
    try {
      const saved = localStorage.getItem("jobsnap_sound_enabled");
      this.enabled = saved !== null ? saved === "true" : true;
    } catch (e) {
      this.enabled = true;
    }
  }

  init() {
    if (this.ctx && this.ctx.state !== "closed") {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 3.5;
        this.compressor = this.ctx.createDynamicsCompressor();
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      }
    } catch (err) {}
  }

  toggle() {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem("jobsnap_sound_enabled", this.enabled.toString());
    } catch (e) {}
    if (this.enabled) {
      this.init();
      this.playTone(660, 0.08, "sine");
    }
    this.updateUI();
    return this.enabled;
  }

  updateUI() {
    const toggleBtn = document.getElementById("soundToggleBtn");
    const mobileBtn = document.getElementById("mobileSoundBtn");
    const mobileText = document.getElementById("mobileSoundText");
    if (toggleBtn) {
      toggleBtn.classList.toggle("muted", !this.enabled);
      toggleBtn.setAttribute("title", this.enabled ? "Sound Effects: ON (Click to mute)" : "Sound Effects: OFF (Click to unmute)");
      const icon = toggleBtn.querySelector("i");
      if (icon) {
        icon.className = this.enabled ? "fa-solid fa-volume-high sound-icon" : "fa-solid fa-volume-xmark sound-icon";
      }
    }
    if (mobileBtn && mobileText) {
      mobileText.textContent = this.enabled ? "Sound Effects: Active" : "Sound Effects: Muted";
      const icon = mobileBtn.querySelector("i");
      if (icon) {
        icon.className = this.enabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
      }
    }
  }

  playTone(freq, dur = 0.08, type = "sine") {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + dur);
    } catch (e) {}
  }

  playClick() {
    this.playTone(720, 0.06, "sine");
  }

  playSuccess() {
    if (!this.enabled) return;
    this.playTone(523.25, 0.08);
    setTimeout(() => this.playTone(659.25, 0.08), 80);
    setTimeout(() => this.playTone(783.99, 0.14), 160);
  }
}

const recruiterSound = new RecruiterSoundFX();
recruiterSound.updateUI();

const soundToggleBtn = document.getElementById("soundToggleBtn");
if (soundToggleBtn) {
  soundToggleBtn.addEventListener("click", () => recruiterSound.toggle());
}
const mobileSoundBtn = document.getElementById("mobileSoundBtn");
if (mobileSoundBtn) {
  mobileSoundBtn.addEventListener("click", () => recruiterSound.toggle());
}

// --- Sticky Header Scrolled State ---
const siteHeader = document.querySelector(".site-header");
const updateHeaderScroll = () => {
  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", window.scrollY > 30);
  }
};
window.addEventListener("scroll", updateHeaderScroll, { passive: true });
window.addEventListener("resize", updateHeaderScroll, { passive: true });
updateHeaderScroll();

// --- Segmented Nav Pill & Pill Indicator ---
const navPill = document.querySelector(".nav-pill");
const navIndicator = document.getElementById("navIndicator");
const navLinks = Array.from(document.querySelectorAll(".nav-pill .nav-link"));
const mobileNavLinks = Array.from(document.querySelectorAll(".mobile-menu .mobile-nav-link"));
const allSectionLinks = [...navLinks, ...mobileNavLinks];

function updateNavIndicator(activeLink) {
  if (!navIndicator || !activeLink || !navPill) return;
  const linkRect = activeLink.getBoundingClientRect();
  const pillRect = navPill.getBoundingClientRect();
  const left = linkRect.left - pillRect.left;
  const width = linkRect.width;
  navIndicator.style.transform = `translateX(${left}px)`;
  navIndicator.style.width = `${width}px`;
  navIndicator.style.opacity = "1";
}

function setActiveNavLink(href) {
  allSectionLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === href);
  });
  const activeDesktopLink = navLinks.find((link) => link.getAttribute("href") === href);
  if (activeDesktopLink) updateNavIndicator(activeDesktopLink);
}

function scrollToSection(target) {
  const headerBottom = siteHeader?.getBoundingClientRect().bottom ?? 0;
  const offset = Math.max(96, headerBottom + 16);
  const top = window.scrollY + target.getBoundingClientRect().top - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

allSectionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      event.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        recruiterSound.playClick();
        setActiveNavLink(href);
        closeMobileMenu();
        scrollToSection(target);
      }
    }
  });
});

// Track sections by their on-screen position so nested sections stay in the right order.
const sections = navLinks
  .map((link) => {
    const href = link.getAttribute("href");
    const el = href?.startsWith("#") ? document.querySelector(href) : null;
    return el ? { href, el } : null;
  })
  .filter((section) => section !== null);

let navUpdatePending = false;
function updateActiveSection() {
  navUpdatePending = false;
  const threshold = Math.min(180, Math.max(120, window.innerHeight * 0.3));
  const visibleOrder = [...sections].sort(
    (first, second) => first.el.getBoundingClientRect().top - second.el.getBoundingClientRect().top
  );
  const passedSections = visibleOrder.filter(({ el }) => el.getBoundingClientRect().top <= threshold);
  const currentSection = passedSections[passedSections.length - 1];
  setActiveNavLink(currentSection?.href || "#home");
}

function scheduleActiveSectionUpdate() {
  if (navUpdatePending) return;
  navUpdatePending = true;
  window.requestAnimationFrame(updateActiveSection);
}

window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
window.addEventListener("resize", scheduleActiveSectionUpdate, { passive: true });
scheduleActiveSectionUpdate();

// Initialize indicator position
window.addEventListener("load", scheduleActiveSectionUpdate);

// --- Mobile Burger Menu ---
const burgerBtn = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileOverlay = document.getElementById("mobileOverlay");

const openMobileMenu = () => {
  if (!mobileMenu || !mobileOverlay) return;
  mobileMenu.hidden = false;
  mobileOverlay.hidden = false;
  document.body.classList.add("menu-open");
  burgerBtn?.setAttribute("aria-expanded", "true");
  recruiterSound.playClick();
};

const closeMobileMenu = () => {
  if (!mobileMenu || !mobileOverlay) return;
  mobileMenu.hidden = true;
  mobileOverlay.hidden = true;
  document.body.classList.remove("menu-open");
  burgerBtn?.setAttribute("aria-expanded", "false");
};

burgerBtn?.addEventListener("click", () => {
  const isOpen = document.body.classList.contains("menu-open");
  if (isOpen) closeMobileMenu();
  else openMobileMenu();
});

mobileOverlay?.addEventListener("click", closeMobileMenu);

// --- Recruiter Early Access Form Submission ---
function applyRecruiterPassToUI(pass) {
  if (!pass || !pass.email) return;
  const heroEmail = document.getElementById("recruiterHeroEmail");
  const bottomEmail = document.getElementById("recruiterBottomEmail");
  if (heroEmail) heroEmail.value = pass.email;
  if (bottomEmail) bottomEmail.value = pass.email;

  const stylePassBtn = (btn) => {
    if (!btn) return;
    btn.innerHTML = `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#e5e7eb;box-shadow:0 0 10px rgba(255,255,255,.45);margin-right:6px;vertical-align:middle;"></span> Pass Active · #${pass.ticketId || 'HR-PASS'} &rarr;`;
    btn.style.background = "linear-gradient(145deg, rgba(255,255,255,.16), rgba(255,255,255,.06))";
    btn.style.borderColor = "rgba(255,255,255,.28)";
    btn.style.color = "#f8fafc";
    btn.style.backdropFilter = "blur(18px) saturate(150%)";
    btn.style.boxShadow = "0 8px 24px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.2)";
  };

  stylePassBtn(document.getElementById("recruiterHeroSubmit"));
  stylePassBtn(document.getElementById("recruiterBottomSubmit"));
  const headerBtn = document.getElementById("recruiterHeaderAccessBtn");
  if (headerBtn) {
    headerBtn.innerHTML = `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#e5e7eb;box-shadow:0 0 10px rgba(255,255,255,.45);margin-right:6px;vertical-align:middle;"></span> Recruiter Pass Active`;
  }
}

function initRecruiterPassState() {
  try {
    const raw = localStorage.getItem("jobsnap_recruiter_pass");
    if (raw) {
      const pass = JSON.parse(raw);
      applyRecruiterPassToUI(pass);
    }
  } catch (e) {}
}

function setupRecruiterForm(formId, emailId, feedbackId) {
  const form = document.getElementById(formId);
  const emailInput = document.getElementById(emailId);
  const feedback = document.getElementById(feedbackId);
  if (!form || !emailInput) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (feedback) {
        feedback.hidden = false;
        feedback.className = "form-feedback error";
        feedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please enter a valid work email address.';
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reserving...';
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "Recruiter / HR", templateType: "3" }),
      });
      const data = await res.json().catch(() => ({}));
      recruiterSound.playSuccess();
      const ticketId = data.ticketId || data.data?.ticketId || `HR-${Math.floor(1000 + Math.random() * 9000)}`;
      const passRecord = { email, ticketId, role: "Recruiter / HR", timestamp: new Date().toISOString() };
      try {
        localStorage.setItem("jobsnap_recruiter_pass", JSON.stringify(passRecord));
      } catch (err) {}
      applyRecruiterPassToUI(passRecord);

      if (feedback) {
        feedback.hidden = false;
        feedback.className = "form-feedback success";
        feedback.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #34d399;"></i> <strong>Recruiter Spot Reserved!</strong> Check your inbox for pass <strong>#${ticketId}</strong> and console credentials.`;
      }
      toast("Recruiter workspace pass activated!");
    } catch (err) {
      const fallbackTicket = `HR-${Math.floor(1000 + Math.random() * 9000)}`;
      const passRecord = { email, ticketId: fallbackTicket, role: "Recruiter / HR", timestamp: new Date().toISOString() };
      try {
        localStorage.setItem("jobsnap_recruiter_pass", JSON.stringify(passRecord));
      } catch (e) {}
      applyRecruiterPassToUI(passRecord);
      if (feedback) {
        feedback.hidden = false;
        feedback.className = "form-feedback success";
        feedback.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #34d399;"></i> <strong>Recruiter Spot Reserved!</strong> Session access activated under pass <strong>#${fallbackTicket}</strong>.`;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
}

setupRecruiterForm("recruiterHeroForm", "recruiterHeroEmail", "recruiterFormFeedback");
setupRecruiterForm("recruiterBottomForm", "recruiterBottomEmail", "recruiterBottomFeedback");
initRecruiterPassState();

// --- FAQ Accordion ---
document.querySelectorAll(".faq-card").forEach((card) => {
  card.style.cursor = "pointer";
  card.addEventListener("click", () => {
    card.classList.toggle("open");
    recruiterSound.playClick();
  });
});
