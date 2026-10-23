// --- Absolute Top Scroll Guard (ensures page loads exactly at 0px with no offset) ---
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const lockToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
};

// Execute immediately when script evaluates
lockToTop();

// Clear landing URL hash so browser cannot scroll or jump to a section on initial load
if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

// Reset on pageshow (e.g. back/forward navigation from cache)
window.addEventListener("pageshow", lockToTop);

// Reset once all assets, images, fonts, and videos finish loading
window.addEventListener("load", () => {
  lockToTop();
  requestAnimationFrame(lockToTop);
  setTimeout(lockToTop, 50);
  setTimeout(lockToTop, 150);
});

document.addEventListener("DOMContentLoaded", () => {
  lockToTop();
  requestAnimationFrame(lockToTop);
  setTimeout(lockToTop, 30);
  // --- Web Audio Procedural Sound Effects Engine ---
  class SoundFXEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.lastHoverTime = 0;
      this.lastCardHoverTime = 0;
      this.lastTypingTime = 0;
      this.pentatonicScale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66]; // C5 to D6
      this.loadState();
    }

    loadState() {
      try {
        const saved = localStorage.getItem("jobsnap_sound_enabled");
        this.enabled = saved !== null ? saved === "true" : true;
      } catch (e) {
        this.enabled = true;
      }
    }

    init() {
      if (this.ctx && this.ctx.state !== "closed") {
        if (this.ctx.state === "suspended") {
          this.ctx.resume();
        }
        return;
      }
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (err) {
        console.warn("[SoundFX] AudioContext init note:", err);
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      try {
        localStorage.setItem("jobsnap_sound_enabled", this.enabled.toString());
      } catch (e) {}
      if (this.enabled) {
        this.init();
        this.playClick(1.2);
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
        toggleBtn.setAttribute(
          "title",
          this.enabled ? "Sound Effects: ON (Click to mute)" : "Sound Effects: OFF (Click to unmute)"
        );
        const icon = toggleBtn.querySelector("i");
        if (icon) {
          icon.className = this.enabled ? "fa-solid fa-volume-high sound-icon" : "fa-solid fa-volume-xmark sound-icon";
        }
      }

      if (mobileBtn) {
        mobileBtn.classList.toggle("muted", !this.enabled);
        const icon = mobileBtn.querySelector("i");
        if (icon) {
          icon.className = this.enabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
        }
      }

      if (mobileText) {
        mobileText.textContent = this.enabled ? "Sound Effects: Active" : "Sound Effects: Muted";
      }
    }

    // 1. Subtle Glass Tick (Buttons, Links, Badges)
    playHoverTick(freq = 840, vol = 0.04) {
      if (!this.enabled) return;
      const now = performance.now();
      if (now - this.lastHoverTime < 30) return;
      this.lastHoverTime = now;

      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(200, freq * 0.72), t + 0.032);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
    }

    // 2. Melodic Tab Glide (Nav Bar Segments)
    playTabGlide(index = 0) {
      if (!this.enabled) return;
      const now = performance.now();
      if (now - this.lastHoverTime < 25) return;
      this.lastHoverTime = now;

      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const noteFreq = this.pentatonicScale[index % this.pentatonicScale.length] || 659.25;

      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(noteFreq, t);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(noteFreq * 2, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.038, t + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc2.start(t);
      osc.stop(t + 0.055);
      osc2.stop(t + 0.055);
    }

    // 3. Card Tactile Glass Thump
    playCardHover() {
      if (!this.enabled) return;
      const now = performance.now();
      if (now - this.lastCardHoverTime < 50) return;
      this.lastCardHoverTime = now;

      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;

      // Low tactile body
      const oscLow = this.ctx.createOscillator();
      const gainLow = this.ctx.createGain();
      oscLow.type = "sine";
      oscLow.frequency.setValueAtTime(145, t);
      oscLow.frequency.exponentialRampToValueAtTime(50, t + 0.06);

      gainLow.gain.setValueAtTime(0.001, t);
      gainLow.gain.linearRampToValueAtTime(0.04, t + 0.003);
      gainLow.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

      oscLow.connect(gainLow);
      gainLow.connect(this.ctx.destination);
      oscLow.start(t);
      oscLow.stop(t + 0.065);

      // Micro glass sparkle
      const oscHigh = this.ctx.createOscillator();
      const gainHigh = this.ctx.createGain();
      oscHigh.type = "sine";
      oscHigh.frequency.setValueAtTime(1380, t);
      oscHigh.frequency.exponentialRampToValueAtTime(800, t + 0.025);

      gainHigh.gain.setValueAtTime(0.001, t);
      gainHigh.gain.linearRampToValueAtTime(0.016, t + 0.002);
      gainHigh.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      oscHigh.connect(gainHigh);
      gainHigh.connect(this.ctx.destination);
      oscHigh.start(t);
      oscHigh.stop(t + 0.028);
    }

    // 4. Tactile Click / Tap (Apple Switch Style)
    playClick(pitchMultiplier = 1) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;

      // Click transient
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(960 * pitchMultiplier, t);
      osc.frequency.exponentialRampToValueAtTime(260 * pitchMultiplier, t + 0.022);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.07, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.024);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.028);

      // Body pop
      const oscLow = this.ctx.createOscillator();
      const gainLow = this.ctx.createGain();

      oscLow.type = "triangle";
      oscLow.frequency.setValueAtTime(280 * pitchMultiplier, t);
      oscLow.frequency.exponentialRampToValueAtTime(90 * pitchMultiplier, t + 0.042);

      gainLow.gain.setValueAtTime(0.001, t);
      gainLow.gain.linearRampToValueAtTime(0.05, t + 0.002);
      gainLow.gain.exponentialRampToValueAtTime(0.0001, t + 0.042);

      oscLow.connect(gainLow);
      gainLow.connect(this.ctx.destination);

      oscLow.start(t);
      oscLow.stop(t + 0.045);
    }

    // 5. Typing Micro-Tap
    playKeyTap() {
      if (!this.enabled) return;
      const now = performance.now();
      if (now - this.lastTypingTime < 35) return;
      this.lastTypingTime = now;

      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const baseFreq = 400 + (Math.random() * 60 - 30);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, t + 0.016);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.038, t + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.018);
    }

    // 6. Mobile Menu Swoosh
    playMenuToggle(isOpen) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      if (isOpen) {
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.exponentialRampToValueAtTime(780, t + 0.08);
      } else {
        osc.frequency.setValueAtTime(780, t);
        osc.frequency.exponentialRampToValueAtTime(340, t + 0.08);
      }

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.055, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    }

    // 7. Dopamine Celebratory Success Chime
    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        { f: 523.25, d: 0.00, dur: 0.35, v: 0.06 }, // C5
        { f: 659.25, d: 0.07, dur: 0.35, v: 0.06 }, // E5
        { f: 783.99, d: 0.14, dur: 0.40, v: 0.07 }, // G5
        { f: 1046.5, d: 0.21, dur: 0.85, v: 0.09 }  // C6 (resonant bell)
      ];

      chords.forEach(({ f, d, dur, v }) => {
        const t = now + d;
        const osc = this.ctx.createOscillator();
        const oscHarm = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t);

        oscHarm.type = "triangle";
        oscHarm.frequency.setValueAtTime(f * 2, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(v, t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(gain);
        oscHarm.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        oscHarm.start(t);
        osc.stop(t + dur + 0.02);
        oscHarm.stop(t + dur + 0.02);
      });

      // Warm sub-bass foundation
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(130, now);
      sub.frequency.exponentialRampToValueAtTime(70, now + 0.4);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.48);
    }
  }

  const soundFX = new SoundFXEngine();
  window.soundFX = soundFX;
  soundFX.updateUI();

  // Unlock AudioContext on first gesture
  const unlockAudio = () => {
    soundFX.init();
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });

  // Sound Toggle Buttons
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      soundFX.toggle();
    });
  }

  const mobileSoundBtn = document.getElementById("mobileSoundBtn");
  if (mobileSoundBtn) {
    mobileSoundBtn.addEventListener("click", () => {
      soundFX.toggle();
    });
  }

  // --- Mobile Menu Toggle ---
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function openMenu() {
    document.body.classList.add("menu-open");
    soundFX.playMenuToggle(true);
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "true");
    if (mobileMenu) {
      mobileMenu.removeAttribute("hidden");
      mobileMenu.style.display = "flex";
    }
    if (mobileOverlay) {
      mobileOverlay.removeAttribute("hidden");
      mobileOverlay.style.display = "block";
    }
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    soundFX.playMenuToggle(false);
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "false");
    if (mobileMenu) {
      mobileMenu.setAttribute("hidden", "");
      mobileMenu.style.display = "none";
    }
    if (mobileOverlay) {
      mobileOverlay.setAttribute("hidden", "");
      mobileOverlay.style.display = "none";
    }
  }

  function toggleMenu() {
    soundFX.playClick(1.1);
    if (document.body.classList.contains("menu-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (burgerBtn) burgerBtn.addEventListener("click", toggleMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      soundFX.playClick(1.05);
      closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 880 && document.body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  // --- Header Scrolled State (iOS Dynamic Blur) ---
  const siteHeader = document.querySelector(".site-header");
  function handleHeaderScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --- Active Nav Link Highlight & iOS Sliding Capsule Indicator ---
  const sections = document.querySelectorAll("main[id], section[id]");
  const desktopNavLinks = document.querySelectorAll(".nav-pill .nav-link");
  const mobileNavLinksList = document.querySelectorAll(".mobile-menu .mobile-nav-link");
  const navIndicator = document.getElementById("navIndicator");
  const navPill = document.querySelector(".nav-pill");
  let currentActiveLink = document.querySelector(".nav-pill .nav-link.active") || desktopNavLinks[0];

  function updateIndicator(targetLink, isAnimated = true) {
    if (!navIndicator || !targetLink || !navPill) return;

    // Use precise offset relative to navPill container
    const leftOffset = targetLink.offsetLeft;
    const width = targetLink.offsetWidth;

    if (!isAnimated) {
      navIndicator.style.transition = "none";
    } else {
      navIndicator.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease";
    }

    navIndicator.style.transform = `translateX(${leftOffset}px)`;
    navIndicator.style.width = `${width}px`;
    navIndicator.style.opacity = "1";
  }

  // Initialize indicator
  setTimeout(() => {
    const active = document.querySelector(".nav-pill .nav-link.active") || desktopNavLinks[0];
    if (active) {
      currentActiveLink = active;
      updateIndicator(active, false);
    }
  }, 100);

  // Smooth hover glide between links (Apple segmented control style) + audio feedback
  desktopNavLinks.forEach((link, idx) => {
    link.addEventListener("mouseenter", () => {
      updateIndicator(link, true);
      soundFX.playTabGlide(idx);
    });
    link.addEventListener("click", () => {
      soundFX.playClick(1.05);
      desktopNavLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      currentActiveLink = link;
      updateIndicator(link, true);
    });
  });

  if (navPill) {
    navPill.addEventListener("mouseleave", () => {
      const active = document.querySelector(".nav-pill .nav-link.active") || currentActiveLink;
      if (active) {
        updateIndicator(active, true);
      }
    });
  }

  function highlightNavOnScroll() {
    // If scrolled near bottom of page, reliably lock to Roadmap
    const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70;
    if (isBottom) {
      const lastLink = desktopNavLinks[desktopNavLinks.length - 1]; // Roadmap
      if (lastLink && currentActiveLink !== lastLink) {
        desktopNavLinks.forEach((l) => l.classList.remove("active"));
        lastLink.classList.add("active");
        currentActiveLink = lastLink;
        updateIndicator(lastLink, true);
      }
      return;
    }

    const scrollPos = window.scrollY + 160;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        let matchedDesktop = null;
        desktopNavLinks.forEach((l) => {
          l.classList.remove("active");
          if (l.getAttribute("href") === `#${id}`) {
            l.classList.add("active");
            matchedDesktop = l;
          }
        });

        mobileNavLinksList.forEach((ml) => {
          ml.classList.remove("active");
          if (ml.getAttribute("href") === `#${id}`) {
            ml.classList.add("active");
          }
        });

        if (matchedDesktop && matchedDesktop !== currentActiveLink) {
          currentActiveLink = matchedDesktop;
          updateIndicator(matchedDesktop, true);
        }
      }
    });
  }

  window.addEventListener("scroll", highlightNavOnScroll, { passive: true });

  window.addEventListener("resize", () => {
    const active = document.querySelector(".nav-pill .nav-link.active") || currentActiveLink;
    if (active) updateIndicator(active, false);
  }, { passive: true });

  // --- Header "Claim Free Spot" Button Handler ---
  const headerAccessBtn = document.getElementById("headerAccessBtn");
  const userEmailInput = document.getElementById("userEmailInput");
  const heroEmailForm = document.getElementById("heroEmailForm");

  if (headerAccessBtn) {
    headerAccessBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
      if (userEmailInput && heroEmailForm) {
        heroEmailForm.scrollIntoView({ behavior: "smooth", block: "center" });
        userEmailInput.focus();
        heroEmailForm.style.borderColor = "rgba(16, 185, 129, 0.9)";
        heroEmailForm.style.boxShadow = "0 0 32px rgba(16, 185, 129, 0.5)";
        setTimeout(() => {
          heroEmailForm.style.borderColor = "";
          heroEmailForm.style.boxShadow = "";
        }, 1800);
      }
    });
  }

  // --- Early Access State Management ---
  const earlyAccessState = {
    emails: [],
    subscribers: [],
    latestSignup: null,
    status: "idle",

    addSubscriber(email, source = "Landing Page") {
      const ticketId = "JS-" + Math.floor(1000 + Math.random() * 9000);
      const record = {
        email: email,
        ticketId: ticketId,
        timestamp: new Date().toISOString(),
        tier: "free_early_access",
        computeAllocated: "8%",
        source: source
      };

      this.emails.push(email);
      this.subscribers.push(record);
      this.latestSignup = record;
      this.status = "success";

      console.group("[AI JobSnap] 🚀 New Early Access Signup");
      console.log("Email:", record.email);
      console.log("Ticket Pass:", record.ticketId);
      console.log("Capacity Status:", "8% allocated (Free tier confirmed)");
      console.log("Source:", record.source);
      console.log("Timestamp:", record.timestamp);
      console.log("Total Captured Subscribers:", this.subscribers.length);
      console.log("Full State:", this);
      console.groupEnd();

      try {
        localStorage.setItem("jobsnap_early_access_user", JSON.stringify(record));
        localStorage.setItem("jobsnap_early_access_subscribers", JSON.stringify(this.subscribers));
      } catch (err) {
        console.warn("[AI JobSnap] Storage note:", err);
      }

      return record;
    },

    loadFromStorage() {
      try {
        const savedList = localStorage.getItem("jobsnap_early_access_subscribers");
        if (savedList) {
          this.subscribers = JSON.parse(savedList);
          this.emails = this.subscribers.map((s) => s.email);
        }
        const savedUser = localStorage.getItem("jobsnap_early_access_user");
        if (savedUser) {
          this.latestSignup = JSON.parse(savedUser);
          this.status = "success";
        }
      } catch (e) {
        // ignore
      }
    }
  };

  earlyAccessState.loadFromStorage();
  window.earlyAccessState = earlyAccessState;

  function showFeedbackElement(targetEl, type, htmlContent) {
    if (!targetEl) return;
    targetEl.className = `form-feedback ${type}`;
    targetEl.innerHTML = htmlContent;
    targetEl.removeAttribute("hidden");
    targetEl.style.display = "block";
  }

  function clearFeedbackElement(targetEl) {
    if (!targetEl) return;
    targetEl.setAttribute("hidden", "");
    targetEl.style.display = "none";
    targetEl.innerHTML = "";
  }

  // Pre-fill existing submission if found
  const formFeedback = document.getElementById("formFeedback");
  const submitBtn = document.getElementById("submitBtn");
  const bottomEmailInput = document.getElementById("bottomEmailInput");
  const bottomFormFeedback = document.getElementById("bottomFormFeedback");
  const bottomSubmitBtn = document.getElementById("bottomSubmitBtn");

  if (earlyAccessState.latestSignup) {
    const activePass = earlyAccessState.latestSignup;
    if (userEmailInput) userEmailInput.value = activePass.email;
    if (bottomEmailInput) bottomEmailInput.value = activePass.email;

    const existingMsg = `<div style="font-weight: 600; margin-bottom: 3px; display: flex; align-items: center; justify-content: center; gap: 8px;"><i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Spot Reserved! Pass <strong>#${activePass.ticketId}</strong></div><div style="font-size: 13px; opacity: 0.95;"><strong>${activePass.email}</strong> is registered for 100% free compute access (8% cluster allocation).</div>`;

    showFeedbackElement(formFeedback, "success", existingMsg);
    showFeedbackElement(bottomFormFeedback, "success", existingMsg);

    if (submitBtn) {
      const btnText = submitBtn.querySelector(".btn-text");
      if (btnText) btnText.textContent = "Pass Active";
    }
    if (bottomSubmitBtn) {
      const btnText = bottomSubmitBtn.querySelector(".btn-text");
      if (btnText) btnText.textContent = "Pass Active";
    }
  }

  // Unified registration handler
  function handleSignup(email, source, feedbackEl, btnEl, inputEl) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      soundFX.playClick(0.65);
      showFeedbackElement(
        feedbackEl,
        "error",
        '<i class="fa-solid fa-circle-exclamation" style="margin-right: 6px;"></i> Please provide a valid email address (e.g. name@example.com).'
      );
      if (inputEl) inputEl.focus();
      return;
    }

    clearFeedbackElement(feedbackEl);

    // 1. Capture into state immediately
    const alreadyCaptured = earlyAccessState.emails.includes(email);
    const record = alreadyCaptured && earlyAccessState.latestSignup?.email === email
      ? earlyAccessState.latestSignup
      : earlyAccessState.addSubscriber(email, source);

    // 2. Synchronize inputs across forms
    if (userEmailInput) userEmailInput.value = record.email;
    if (bottomEmailInput) bottomEmailInput.value = record.email;

    // 3. Update buttons immediately
    if (submitBtn) {
      const btnText = submitBtn.querySelector(".btn-text");
      if (btnText) btnText.textContent = "Pass Claimed! 🎉";
      submitBtn.style.boxShadow = "0 0 24px rgba(16, 185, 129, 0.6)";
    }
    if (bottomSubmitBtn) {
      const btnText = bottomSubmitBtn.querySelector(".btn-text");
      if (btnText) btnText.textContent = "Pass Claimed! 🎉";
      bottomSubmitBtn.style.boxShadow = "0 0 24px rgba(16, 185, 129, 0.6)";
    }

    // Play triumphant celestial success chord!
    soundFX.playSuccess();

    // 4. Show celebratory confirmation message
    const successHtml = `<div style="font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; gap: 8px;"><i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Free Early Access Confirmed! Pass <strong>#${record.ticketId}</strong></div><div style="font-size: 13px; opacity: 0.95;">Welcome aboard! <strong>${record.email}</strong> is registered for 100% free compute access. Confirmation pass sent to your inbox! 📬</div>`;

    showFeedbackElement(formFeedback, "success", successHtml);
    showFeedbackElement(bottomFormFeedback, "success", successHtml);

    // 5. Update capacity indicator text
    const capacityStatusText = document.getElementById("capacityStatusText");
    if (capacityStatusText) {
      capacityStatusText.textContent = "8% compute capacity allocated • 92% free slots available";
    }

    // 6. Backend email dispatch
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        source: source,
        ticketId: record.ticketId,
        templateType: "2"
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("[AI JobSnap] Email dispatch status:", data);
      })
      .catch((err) => {
        console.warn("[AI JobSnap] Email dispatch notice:", err);
      });
  }

  // Hero form listener
  if (heroEmailForm) {
    heroEmailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = userEmailInput ? userEmailInput.value.trim() : "";
      handleSignup(email, "Landing Page Hero", formFeedback, submitBtn, userEmailInput);
    });
  }

  // Bottom form listener
  const bottomEmailForm = document.getElementById("bottomEmailForm");
  if (bottomEmailForm) {
    bottomEmailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = bottomEmailInput ? bottomEmailInput.value.trim() : "";
      handleSignup(email, "Final Callout Banner", bottomFormFeedback, bottomSubmitBtn, bottomEmailInput);
    });
  }

  // --- Attach Interactive Sound Effects Across Elements ---
  // 1. Feature Cards & Security Cards (tactile glass thump)
  document.querySelectorAll(".feature-card, .security-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      soundFX.playCardHover();
    });
  });

  // 2. Roadmap, Capacity Nodes & Kanban Items (subtle glass ticks)
  document.querySelectorAll(".roadmap-card, .capacity-node-card, .kanban-item").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      soundFX.playHoverTick(720, 0.035);
    });
  });

  // 3. FAQ Cards (hover tick + click pop)
  document.querySelectorAll(".faq-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      soundFX.playHoverTick(680, 0.038);
    });
    card.addEventListener("click", () => {
      soundFX.playClick(0.92);
    });
  });

  // 4. Buttons & Interactive Links (tactile clicks & glass hover)
  document.querySelectorAll("button, .sign-in-btn, .cta-btn, .features-trigger-btn, .mobile-sign-in").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      soundFX.playHoverTick(880, 0.045);
    });
    btn.addEventListener("click", () => {
      soundFX.playClick(1.0);
    });
  });

  // 5. Input keypress micro-taps & focus chime
  [userEmailInput, bottomEmailInput].forEach((inp) => {
    if (!inp) return;
    inp.addEventListener("focus", () => {
      soundFX.playHoverTick(920, 0.04);
    });
    inp.addEventListener("keydown", (e) => {
      // Ignore navigation / modifier keys
      if (!["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        soundFX.playKeyTap();
      }
    });
  });

  // --- Stats Counter with IntersectionObserver ---
  const statElements = document.querySelectorAll("[data-stat-target]");

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateStat(el, index) {
    const target = parseFloat(el.getAttribute("data-stat-target"));
    const decimals = parseInt(el.getAttribute("data-stat-decimals") || "0", 10);
    const duration = 1500 + index * 80;
    const startOffset = 300 + index * 90;

    setTimeout(() => {
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentVal = target * easedProgress;

        el.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(update);
    }, startOffset);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statElements.forEach((el, index) => {
              animateStat(el, index);
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    const statsFooter = document.querySelector(".stats-footer");
    if (statsFooter) {
      observer.observe(statsFooter);
    } else {
      statElements.forEach((el, index) => {
        animateStat(el, index);
      });
    }
  } else {
    statElements.forEach((el, index) => {
      animateStat(el, index);
    });
  }
});
