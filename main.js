// --- Absolute Top Scroll Guard (ensures page loads cleanly at 0px with no offset) ---
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
window.addEventListener("pageshow", lockToTop, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
  // --- Web Audio Procedural Sound Effects Engine ---
  class SoundFXEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.compressor = null;
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
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.value = 4;
          this.compressor = this.ctx.createDynamicsCompressor();
          this.compressor.threshold.value = -3;
          this.compressor.knee.value = 3;
          this.compressor.ratio.value = 12;
          this.compressor.attack.value = 0.003;
          this.compressor.release.value = 0.12;
          this.masterGain.connect(this.compressor);
          this.compressor.connect(this.ctx.destination);
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
      gain.connect(this.masterGain);

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
      gain.connect(this.masterGain);

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
      gainLow.connect(this.masterGain);
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
      gainHigh.connect(this.masterGain);
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
      gain.connect(this.masterGain);

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
      gainLow.connect(this.masterGain);

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
      gain.connect(this.masterGain);

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
      gain.connect(this.masterGain);

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
        gain.connect(this.masterGain);

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
      subGain.connect(this.masterGain);
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

  // --- Header Scrolled State (iOS Dynamic Blur) & Active Nav Link Highlight ---
  const siteHeader = document.querySelector(".site-header");
  const sections = document.querySelectorAll("main[id], section[id]");
  const desktopNavLinks = document.querySelectorAll(".nav-pill .nav-link");
  const mobileNavLinksList = document.querySelectorAll(".mobile-menu .mobile-nav-link");
  const navIndicator = document.getElementById("navIndicator");
  const navPill = document.querySelector(".nav-pill");
  let currentActiveLink = document.querySelector(".nav-pill .nav-link.active") || desktopNavLinks[0];

  function updateIndicator(targetLink, isAnimated = true) {
    if (!navIndicator || !targetLink || !navPill) return;
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

  // Pre-calculate and cache section offsets to prevent layout thrashing on scroll
  let cachedSections = [];
  function updateSectionOffsets() {
    cachedSections = Array.from(sections).map((sec) => ({
      id: sec.getAttribute("id"),
      top: sec.offsetTop,
      bottom: sec.offsetTop + sec.offsetHeight
    }));
  }
  updateSectionOffsets();

  // Initialize indicator
  setTimeout(() => {
    updateSectionOffsets();
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

  function handleHeaderScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 10) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }

  function highlightNavOnScroll() {
    const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70;
    if (isBottom) {
      const lastLink = desktopNavLinks[desktopNavLinks.length - 1];
      if (lastLink && currentActiveLink !== lastLink) {
        desktopNavLinks.forEach((l) => l.classList.remove("active"));
        lastLink.classList.add("active");
        currentActiveLink = lastLink;
        updateIndicator(lastLink, true);
      }
      return;
    }

    const scrollPos = window.scrollY + 160;
    for (let i = 0; i < cachedSections.length; i++) {
      const sec = cachedSections[i];
      if (scrollPos >= sec.top && scrollPos < sec.bottom) {
        let matchedDesktop = null;
        desktopNavLinks.forEach((l) => {
          l.classList.remove("active");
          if (l.getAttribute("href") === `#${sec.id}`) {
            l.classList.add("active");
            matchedDesktop = l;
          }
        });

        mobileNavLinksList.forEach((ml) => {
          ml.classList.remove("active");
          if (ml.getAttribute("href") === `#${sec.id}`) {
            ml.classList.add("active");
          }
        });

        if (matchedDesktop && matchedDesktop !== currentActiveLink) {
          currentActiveLink = matchedDesktop;
          updateIndicator(matchedDesktop, true);
        }
        break;
      }
    }
  }

  // Unified high-performance rAF-throttled scroll handler
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        handleHeaderScroll();
        highlightNavOnScroll();
        scrollTicking = false;
      });
    }
  }, { passive: true });
  handleHeaderScroll();

  window.addEventListener("resize", () => {
    updateSectionOffsets();
    const active = document.querySelector(".nav-pill .nav-link.active") || currentActiveLink;
    if (active) updateIndicator(active, false);
  }, { passive: true });


  // --- Corner Auth Sound Effects ---
  const cornerAuthBtns = document.querySelectorAll(".corner-auth-btn, .mobile-corner-btn");
  cornerAuthBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      soundFX.playHoverTick(780, 0.04);
    });
    btn.addEventListener("click", () => {
      soundFX.playClick(1.2);
    });
  });

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

      console.group("[AI JobSnap] New Early Access Signup");
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

  // --- Pass card morphs into the JobSnap mark without blocking the page ---
  function showPassCelebration(record, targetButton) {
    document.getElementById("passCelebration")?.remove();

    const celebration = document.createElement("div");
    celebration.id = "passCelebration";
    celebration.className = "pass-celebration";
    celebration.setAttribute("role", "status");
    celebration.setAttribute("aria-live", "polite");
    celebration.innerHTML = `
      <div class="pass-celebration-card">
        <div class="pass-celebration-content">
          <div class="pass-celebration-heading">
            <span class="pass-celebration-dot"></span>
            FOUNDING PASS RESERVED
          </div>
          <div class="pass-celebration-code"></div>
          <div class="pass-celebration-caption">Your JobSnap journey starts here</div>
        </div>
        <div class="pass-celebration-mark" aria-hidden="true">
          <i class="fa-solid fa-bolt"></i>
        </div>
      </div>
    `;
    celebration.querySelector(".pass-celebration-code").textContent = record.ticketId;
    document.body.appendChild(celebration);
    soundFX.playSuccess();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = targetButton || submitBtn || headerAccessBtn;
    if (target) {
      const bounds = target.getBoundingClientRect();
      celebration.style.setProperty("--fly-x", `${bounds.left + bounds.width / 2 - window.innerWidth / 2}px`);
      celebration.style.setProperty("--fly-y", `${bounds.top + bounds.height / 2 - window.innerHeight / 2}px`);
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => celebration.classList.add("is-visible"));
    });

    setTimeout(() => celebration.classList.add("is-morphing"), reducedMotion ? 80 : 1050);
    setTimeout(() => celebration.classList.add("is-flying"), reducedMotion ? 160 : 1580);
    setTimeout(() => celebration.remove(), reducedMotion ? 360 : 2350);
  }

  // --- Ultra-Professional Spot Reserved / VIP Founding Pass Modal Logic ---
  const spotReservedModal = document.getElementById("spotReservedModal");
  const vipModalBackdrop = document.getElementById("vipModalBackdrop");
  const vipModalCloseBtn = document.getElementById("vipModalCloseBtn");
  const vipModalDoneBtn = document.getElementById("vipModalDoneBtn");
  const vipCopyCodeBtn = document.getElementById("vipCopyCodeBtn");
  const vipModalPassCode = document.getElementById("vipModalPassCode");
  const vipModalEmail = document.getElementById("vipModalEmail");
  const vipModalRole = document.getElementById("vipModalRole");
  const vipConfettiCanvas = document.getElementById("vipConfettiCanvas");

  let confettiAnimationId = null;

  function runConfettiBurst() {
    if (!vipConfettiCanvas) return;
    const ctx = vipConfettiCanvas.getContext("2d");
    if (!ctx) return;

    const width = (vipConfettiCanvas.width = vipConfettiCanvas.offsetWidth || 500);
    const height = (vipConfettiCanvas.height = vipConfettiCanvas.offsetHeight || 500);

    const colors = ["#10b981", "#34d399", "#38bdf8", "#0284c7", "#fbbf24", "#ffffff"];
    const particles = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      particles.push({
        x: width / 2,
        y: height / 2 - 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        decay: 0.012 + Math.random() * 0.015,
        shape: Math.random() > 0.4 ? "rect" : "circle"
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);

    const startTime = performance.now();
    function animate(now) {
      ctx.clearRect(0, 0, width, height);
      let alive = 0;

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.vx *= 0.98;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;

          if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
          }
          ctx.restore();
        }
      }

      if (alive > 0 && now - startTime < 1600) {
        confettiAnimationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    confettiAnimationId = requestAnimationFrame(animate);
  }

  function openSpotReservedModal(record) {
    const modal = document.getElementById("spotReservedModal") || spotReservedModal;
    if (!modal) return;
    const pass = record || earlyAccessState.latestSignup || {
      ticketId: "JS-2645",
      email: (document.getElementById("userEmailInput") && document.getElementById("userEmailInput").value) || "founder@example.com",
      role: "Tech / Product"
    };

    const passCodeEl = document.getElementById("vipModalPassCode") || vipModalPassCode;
    const emailEl = document.getElementById("vipModalEmail") || vipModalEmail;
    const roleEl = document.getElementById("vipModalRole") || vipModalRole;

    if (passCodeEl) passCodeEl.textContent = pass.ticketId;
    if (emailEl) emailEl.textContent = pass.email;
    if (roleEl) roleEl.textContent = pass.role || "Tech / Product";

    modal.removeAttribute("hidden");
    modal.style.display = "flex";
    void modal.offsetWidth; // Force CSS reflow
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    soundFX.playSuccess();
    runConfettiBurst();
  }

  function closeSpotReservedModal() {
    const modal = document.getElementById("spotReservedModal") || spotReservedModal;
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    soundFX.playClick(0.9);
    setTimeout(() => {
      modal.setAttribute("hidden", "");
      modal.style.display = "none";
    }, 360);
  }

  if (vipModalCloseBtn) vipModalCloseBtn.addEventListener("click", closeSpotReservedModal);
  if (vipModalDoneBtn) vipModalDoneBtn.addEventListener("click", closeSpotReservedModal);
  if (vipModalBackdrop) vipModalBackdrop.addEventListener("click", closeSpotReservedModal);

  // Copy Pass Code Button
  if (vipCopyCodeBtn) {
    vipCopyCodeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const code = vipModalPassCode ? vipModalPassCode.textContent.trim() : "";
      if (!code) return;

      const copyTextEl = vipCopyCodeBtn.querySelector(".copy-text");
      const origText = copyTextEl ? copyTextEl.textContent : "Copy Code";

      const doSuccessFeedback = () => {
        soundFX.playClick(1.4);
        vipCopyCodeBtn.classList.add("copied");
        if (copyTextEl) copyTextEl.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          vipCopyCodeBtn.classList.remove("copied");
          if (copyTextEl) copyTextEl.textContent = origText;
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(doSuccessFeedback).catch(() => {
          fallbackCopyText(code);
          doSuccessFeedback();
        });
      } else {
        fallbackCopyText(code);
        doSuccessFeedback();
      }
    });
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(tempInput);
  }

  // --- Compact Glassmorphism Pass Chip (slides in bottom-right, no page reload/dimming) ---
  function buildPassChip(record) {
    // Remove any old chip
    const old = document.getElementById("passChip");
    if (old) old.remove();

    const chip = document.createElement("div");
    chip.id = "passChip";
    chip.className = "pass-chip";
    chip.setAttribute("role", "status");
    chip.setAttribute("aria-live", "polite");

    const email = record.email || "";
    const ticketId = record.ticketId || "JS-0000";
    const joinDate = record.joinDate
      ? new Date(record.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    chip.innerHTML = `
      <div class="pass-chip-header">
        <div class="pass-chip-brand">
          <div class="pass-chip-title">
            <span class="vip-pulse-dot" style="display:inline-block;vertical-align:middle;"></span>
            VIP Founding Pass Active
          </div>
          <div class="pass-chip-sub">PRIVATE BETA · LIFETIME TIER · SPOT SECURED</div>
        </div>
        <button type="button" class="pass-chip-close" aria-label="Dismiss">×</button>
      </div>

      <div class="pass-chip-code-row">
        <div>
          <div class="pass-chip-code-label">Invite Pass Code</div>
          <div class="pass-chip-code-value" id="passChipCode">${ticketId}</div>
        </div>
        <button type="button" class="pass-chip-copy-btn" id="passChipCopyBtn">
          <i class="fa-regular fa-copy"></i>
          <span class="copy-txt">Copy</span>
        </button>
      </div>

      <div class="pass-chip-details">
        <div class="pass-chip-detail">
          <div class="pass-chip-detail-label"><i class="fa-regular fa-envelope"></i> Registered</div>
          <div class="pass-chip-detail-value" title="${email}">${email}</div>
        </div>
        <div class="pass-chip-detail">
          <div class="pass-chip-detail-label"><i class="fa-solid fa-calendar-check"></i> Joined</div>
          <div class="pass-chip-detail-value">${joinDate}</div>
        </div>
        <div class="pass-chip-detail">
          <div class="pass-chip-detail-label"><i class="fa-solid fa-server"></i> Compute</div>
          <div class="pass-chip-detail-value" style="color:#34d399;">8% Priority</div>
        </div>
        <div class="pass-chip-detail">
          <div class="pass-chip-detail-label"><i class="fa-solid fa-shield-halved"></i> Status</div>
          <div class="pass-chip-detail-value" style="color:#38bdf8;">VIP Confirmed</div>
        </div>
      </div>

      <button type="button" class="pass-chip-view-btn" id="passChipViewBtn">
        <i class="fa-solid fa-id-card"></i>
        View Full Founding Pass
        <i class="fa-solid fa-chevron-right" style="font-size:10px;"></i>
      </button>
    `;

    document.body.appendChild(chip);

    // Wire close
    chip.querySelector(".pass-chip-close").addEventListener("click", (e) => {
      e.stopPropagation();
      hidePassChip();
    });

    // Wire copy
    const copyBtn = chip.querySelector("#passChipCopyBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = ticketId;
        const copyTxt = copyBtn.querySelector(".copy-txt");
        const doFeedback = () => {
          soundFX.playClick(1.4);
          copyBtn.classList.add("copied");
          if (copyTxt) copyTxt.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(() => {
            copyBtn.classList.remove("copied");
            if (copyTxt) copyTxt.textContent = "Copy";
          }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(doFeedback).catch(() => {
            fallbackCopyText(code);
            doFeedback();
          });
        } else {
          fallbackCopyText(code);
          doFeedback();
        }
      });
    }

    // Wire view full pass
    const viewBtn = chip.querySelector("#passChipViewBtn");
    if (viewBtn) {
      viewBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        hidePassChip();
        openSpotReservedModal(record);
      });
    }

    return chip;
  }

  function showPassChip(record) {
    const chip = buildPassChip(record);
    // Trigger slide-in on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        chip.classList.add("visible");
      });
    });
  }

  function hidePassChip() {
    const chip = document.getElementById("passChip");
    if (!chip) return;
    chip.classList.add("hiding");
    chip.classList.remove("visible");
    setTimeout(() => chip.remove(), 600);
  }

  // --- Form Elements & State Sync ---
  const heroEmailForm = document.getElementById("heroEmailForm");
  const userEmailInput = document.getElementById("userEmailInput");
  const formFeedback = document.getElementById("formFeedback");
  const submitBtn = document.getElementById("submitBtn");
  const bottomEmailForm = document.getElementById("bottomEmailForm");
  const bottomEmailInput = document.getElementById("bottomEmailInput");
  const bottomFormFeedback = document.getElementById("bottomFormFeedback");
  const bottomSubmitBtn = document.getElementById("bottomSubmitBtn");
  const headerAccessBtn = document.getElementById("headerAccessBtn");
  const mobileActionBtn = document.getElementById("mobileActionBtn");
  const capacityStatusText = document.getElementById("capacityStatusText");

  function updateUIForActivePass(record) {
    if (!record) return;

    if (userEmailInput) userEmailInput.value = record.email;
    if (bottomEmailInput) bottomEmailInput.value = record.email;

    const applyActiveBtnStyle = (btn) => {
      if (!btn) return;
      btn.classList.add("vip-active-btn");
      btn.setAttribute("title", "Click to view your reserved VIP Founding Pass");
      const btnText = btn.querySelector(".btn-text");
      if (btnText) {
        btnText.innerHTML = `<span class="vip-pulse-dot" style="display: inline-block; vertical-align: middle; margin-right: 6px;"></span> Pass Active · #${record.ticketId}`;
      }
      btn.style.boxShadow = "0 0 24px rgba(16, 185, 129, 0.55)";
      btn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        soundFX.playClick(1.1);
        openSpotReservedModal(record);
      };
    };

    applyActiveBtnStyle(submitBtn);
    applyActiveBtnStyle(bottomSubmitBtn);

    if (headerAccessBtn) {
      headerAccessBtn.innerHTML = `<span class="vip-pulse-dot" style="display: inline-block; vertical-align: middle; margin-right: 6px;"></span> VIP Pass Active`;
      headerAccessBtn.classList.add("header-vip-badge");
      headerAccessBtn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        soundFX.playClick(1.1);
        openSpotReservedModal(record);
      };
    }

    if (mobileActionBtn) {
      mobileActionBtn.innerHTML = `<span class="vip-pulse-dot" style="display: inline-block; vertical-align: middle; margin-right: 6px;"></span> VIP Pass Active`;
      mobileActionBtn.classList.add("header-vip-badge");
      mobileActionBtn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        closeMenu();
        soundFX.playClick(1.1);
        openSpotReservedModal(record);
      };
    }

    clearFeedbackElement(formFeedback);
    clearFeedbackElement(bottomFormFeedback);
  }

  // Pre-fill existing submission if found in storage
  if (earlyAccessState.latestSignup) {
    updateUIForActivePass(earlyAccessState.latestSignup);
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

    // 2. Update all UI live (buttons, header, etc.) — no reload needed
    updateUIForActivePass(record);

    // 3. Update capacity indicator text
    const capText = document.getElementById("capacityStatusText");
    if (capText) {
      capText.textContent = "8% compute capacity allocated • 92% free slots available";
    }

    // 4. Brief pass reveal, then return to the unobstructed page.
    showPassCelebration(record, btnEl);

    // 5. Dispatch the email and clear the email-only cache after confirmed delivery.
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
      .then((res) => {
        if (!res.ok) throw new Error(`Email dispatch failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        console.log("[AI JobSnap] Email dispatch status:", data);
        if (data.emailSent) {
          if (userEmailInput) userEmailInput.value = "";
          if (bottomEmailInput) bottomEmailInput.value = "";
          localStorage.removeItem("jobsnap_user_email");
        }
      })
      .catch((err) => {
        console.warn("[AI JobSnap] Email dispatch notice:", err);
      });
  }

  // Unified non-reloading button click handler
  const onPassButtonClick = (e, source, inputEl, feedbackEl, btnEl) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // If already registered: directly open the ultra-professional VIP Pass modal!
    if (earlyAccessState.latestSignup) {
      soundFX.playClick(1.1);
      openSpotReservedModal(earlyAccessState.latestSignup);
      return;
    }

    // Otherwise, process the registration
    const email = inputEl ? inputEl.value.trim() : "";
    handleSignup(email, source, feedbackEl, btnEl, inputEl);
  };

  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      onPassButtonClick(e, "Landing Page Hero", userEmailInput, formFeedback, submitBtn);
    });
  }

  if (bottomSubmitBtn) {
    bottomSubmitBtn.addEventListener("click", (e) => {
      onPassButtonClick(e, "Final Callout Banner", bottomEmailInput, bottomFormFeedback, bottomSubmitBtn);
    });
  }

  if (heroEmailForm) {
    heroEmailForm.addEventListener("submit", (e) => {
      onPassButtonClick(e, "Landing Page Hero", userEmailInput, formFeedback, submitBtn);
    });
  }

  if (bottomEmailForm) {
    bottomEmailForm.addEventListener("submit", (e) => {
      onPassButtonClick(e, "Final Callout Banner", bottomEmailInput, bottomFormFeedback, bottomSubmitBtn);
    });
  }

  if (userEmailInput) {
    userEmailInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onPassButtonClick(e, "Landing Page Hero", userEmailInput, formFeedback, submitBtn);
      }
    });
  }

  if (bottomEmailInput) {
    bottomEmailInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onPassButtonClick(e, "Final Callout Banner", bottomEmailInput, bottomFormFeedback, bottomSubmitBtn);
      }
    });
  }

  // Header & Mobile Action buttons
  if (headerAccessBtn) {
    headerAccessBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
      if (earlyAccessState.latestSignup) {
        soundFX.playClick(1.1);
        openSpotReservedModal(earlyAccessState.latestSignup);
      } else if (userEmailInput && heroEmailForm) {
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

  if (mobileActionBtn) {
    mobileActionBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
      if (earlyAccessState.latestSignup) {
        soundFX.playClick(1.1);
        openSpotReservedModal(earlyAccessState.latestSignup);
      } else if (userEmailInput && heroEmailForm) {
        heroEmailForm.scrollIntoView({ behavior: "smooth", block: "center" });
        userEmailInput.focus();
      }
    });
  }

  // Global capture-phase listener to catch clicks on any pass-active trigger anywhere on the page
  document.addEventListener(
    "click",
    (e) => {
      const trigger = e.target.closest(".vip-active-btn, .header-vip-badge, .view-pass-trigger-btn");
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        const currentRecord = earlyAccessState.latestSignup || {
          ticketId: "JS-2645",
          email: (userEmailInput && userEmailInput.value) || "founder@example.com",
          role: "Tech / Product"
        };
        soundFX.playClick(1.1);
        openSpotReservedModal(currentRecord);
      }
    },
    true
  );

  // --- Clean 3-Card Features Showcase & Detail Modal Logic ---
  const featureCards = document.querySelectorAll(".feature-card-clean");
  const oasisMoreBtns = document.querySelectorAll(".oasis-more-btn");
  const oasisModal = document.getElementById("featureDetailModal");
  const oasisModalCloseBtn = document.getElementById("oasisModalCloseBtn");
  const modalKicker = document.getElementById("modalKicker");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalBody = document.getElementById("modalBody");
  const modalClaimBtn = document.getElementById("modalClaimBtn");



  const featureModalData = {
    discovery: {
      kicker: "FEATURE 01 · SMART JOB DISCOVERY",
      title: "Enterprise Console & Dual-Speed Scan Engine",
      desc: "Smart discovery console with Operator ID, Fast (~60s) and Deep (~3m) scans, custom keywords, and reusable search profiles.",
      items: [
        {
          title: "Dual Scan Speed Modes",
          text: "Fast Mode (~60s) for rapid checks; Deep Mode (~3m) for an exhaustive sweep across niche platforms."
        },
        {
          title: "Keyword & Domain Filtering",
          text: "Filter by Python, Electrical, Merchant Navy, or custom specializations with saved profiles."
        },
        {
          title: "Search Progress Bar & Profile Saving",
          text: "Track real-time multi-board crawling with saved profile presets."
        }
      ],
      demoNote: "Live Console Engine: Filter by Python, Electrical, or Merchant Navy and launch Fast (~60s) or Deep (~3m) scans."
    },
    scoring: {
      kicker: "FEATURE 02 · AI RESUME MATCHING",
      title: "Skill Set Analysis, Relevance Score & Match Verdict",
      desc: "Parses your resume against scanned openings, generating a 0–100% Relevance Score with instant match verdicts.",
      items: [
        {
          title: "Resume & Skill Set Extraction",
          text: "Extracts technical skills, certifications, and experience directly from your resume."
        },
        {
          title: "Calibrated 0–100% Relevance Score",
          text: "Calculates an objective match percentage based on seniority, tools, and requirements."
        },
        {
          title: "Instant 'Perfect For You' Verdict",
          text: "Decisively tags matching roles (95%+ match) to prioritize your applications."
        }
      ],
      demoNote: "Verified Decision: Jobs marked 'Perfect For You' boast a 4x higher callback rate and zero wasted applications."
    },
    hub: {
      kicker: "FEATURE 03 · 1-CLICK APPLICATION HUB",
      title: "Discovered vs Applied Jobs Management Portal",
      desc: "Organize your job pipeline from Discovered to Applied, sync interview dates with Google Calendar, and receive Excel reports.",
      items: [
        {
          title: "Discovered & New Jobs Portal",
          text: "Newly scanned listings land in your Discovered column with instant relevance scores."
        },
        {
          title: "Google Calendar & Email Sync",
          text: "Sync interview deadlines with any Google account and receive automated Excel scan attachments."
        },
        {
          title: "1-Click Application Automation",
          text: "Auto-completes repetitive application fields and dispatches applications in 1 click."
        }
      ],
      demoNote: "Full Funnel: Track Discovered, Applied, and Calendar-synced interviews with automated Excel report dispatch."
    }
  };

  function openFeatureModal(featureKey) {
    const data = featureModalData[featureKey] || featureModalData.discovery;
    if (!oasisModal) return;

    soundFX.playClick(1.15);

    if (modalKicker) modalKicker.textContent = data.kicker;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="modal-feature-list">
          ${data.items
            .map(
              (item) => `
            <div class="modal-feature-item">
              <i class="fa-solid fa-circle-check"></i>
              <div>
                <strong>${item.title}</strong>
                <span>${item.text}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="modal-mini-demo">
          <div class="modal-mini-demo-title">
            <i class="fa-solid fa-sparkles"></i> Automated Intelligence
          </div>
          <div class="modal-mini-demo-content">
            ${data.demoNote}
          </div>
        </div>
      `;
    }

    oasisModal.hidden = false;
    oasisModal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      oasisModal.classList.add("active");
    });
    document.body.style.overflow = "hidden";
  }

  function closeFeatureModal() {
    if (!oasisModal) return;
    oasisModal.classList.remove("active");
    setTimeout(() => {
      oasisModal.hidden = true;
      oasisModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }, 280);
  }

  oasisMoreBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const featureKey = btn.getAttribute("data-feature-modal") || "discovery";
      openFeatureModal(featureKey);
    });
  });

  if (oasisModalCloseBtn) {
    oasisModalCloseBtn.addEventListener("click", () => {
      soundFX.playHoverTick(700, 0.04);
      closeFeatureModal();
    });
  }

  if (oasisModal) {
    oasisModal.addEventListener("click", (e) => {
      if (e.target === oasisModal) {
        closeFeatureModal();
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && oasisModal && !oasisModal.hidden) {
      closeFeatureModal();
    }
  });

  if (modalClaimBtn) {
    modalClaimBtn.addEventListener("click", () => {
      soundFX.playClick(1.2);
      closeFeatureModal();
      const heroForm = document.getElementById("heroEmailForm");
      const emailInput = document.getElementById("userEmailInput");
      if (heroForm && emailInput) {
        heroForm.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          emailInput.focus();
          heroForm.style.borderColor = "rgba(16, 185, 129, 0.9)";
          heroForm.style.boxShadow = "0 0 32px rgba(16, 185, 129, 0.5)";
          setTimeout(() => {
            heroForm.style.borderColor = "";
            heroForm.style.boxShadow = "";
          }, 1800);
        }, 500);
      }
    });
  }

  // --- Attach Interactive Sound Effects Across Elements ---
  // 1. Security Cards (tactile glass thump)
  document.querySelectorAll(".security-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      soundFX.playCardHover();
    });
  });

  // 2. Roadmap, Capacity Nodes & Kanban Items (subtle glass ticks)
  document.querySelectorAll(".roadmap-card, .capacity-node-card, .kanban-item, .studio-card").forEach((card) => {
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
  document.querySelectorAll("button, .sign-in-btn, .cta-btn, .features-trigger-btn, .mobile-sign-in, .operator-pill-btn").forEach((btn) => {
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

  // =========================================================================
  // JobSnap Live Console, Dashboard & Modal Interactive Controller
  // =========================================================================
  const loginModal = document.getElementById("loginModal");
  const loginModalCloseBtn = document.getElementById("loginModalCloseBtn");
  const operatorLoginBtn = document.getElementById("operatorLoginBtn");
  const mobileOperatorLoginBtn = document.getElementById("mobileOperatorLoginBtn");
  const dashSwitchAccountBtn = document.getElementById("dashSwitchAccountBtn");
  const loginForm = document.getElementById("loginForm");
  const loginUsername = document.getElementById("loginUsername");
  const roleJobSeekerBtn = document.getElementById("roleJobSeekerBtn");
  const roleRecruiterBtn = document.getElementById("roleRecruiterBtn");

  const headerOperatorLabel = document.getElementById("headerOperatorLabel");
  const dashOperatorName = document.getElementById("dashOperatorName");
  const dashAvatar = document.getElementById("dashAvatar");
  const dashRoleLabel = document.getElementById("dashRoleLabel");
  const consoleOperatorTag = document.getElementById("consoleOperatorTag");

  let activeRole = "Job Seeker";

  function openLoginModal() {
    if (!loginModal) return;
    soundFX.playClick(1.1);
    loginModal.hidden = false;
    loginModal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => loginModal.classList.add("active"));
    document.body.style.overflow = "hidden";
  }

  function closeLoginModal() {
    if (!loginModal) return;
    loginModal.classList.remove("active");
    setTimeout(() => {
      loginModal.hidden = true;
      loginModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }, 280);
  }

  [operatorLoginBtn, mobileOperatorLoginBtn, dashSwitchAccountBtn].forEach((btn) => {
    if (btn) btn.addEventListener("click", openLoginModal);
  });

  if (loginModalCloseBtn) {
    loginModalCloseBtn.addEventListener("click", closeLoginModal);
  }

  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) closeLoginModal();
    });
  }

  // Role switching
  if (roleJobSeekerBtn && roleRecruiterBtn) {
    roleJobSeekerBtn.addEventListener("click", () => {
      soundFX.playHoverTick(740, 0.04);
      roleJobSeekerBtn.classList.add("active");
      roleRecruiterBtn.classList.remove("active");
      activeRole = "Job Seeker";
    });

    roleRecruiterBtn.addEventListener("click", () => {
      soundFX.playHoverTick(740, 0.04);
      roleRecruiterBtn.classList.add("active");
      roleJobSeekerBtn.classList.remove("active");
      activeRole = "Recruiter / Enterprise";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = (loginUsername?.value || "musabimp").trim();
      const initial = username.charAt(0).toUpperCase() || "M";

      if (headerOperatorLabel) headerOperatorLabel.textContent = username;
      if (dashOperatorName) dashOperatorName.textContent = username;
      if (dashAvatar) dashAvatar.textContent = initial;
      if (consoleOperatorTag) consoleOperatorTag.textContent = `Operator: ${username}`;
      if (dashRoleLabel) dashRoleLabel.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${activeRole} Operator`;

      soundFX.playClick(1.25);
      closeLoginModal();

      const dashSec = document.getElementById("dashboard-preview");
      if (dashSec) {
        dashSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Scan Mode: Fast (~60s) vs Deep (~3m)
  const modeFastBtn = document.getElementById("modeFastBtn");
  const modeDeepBtn = document.getElementById("modeDeepBtn");

  if (modeFastBtn && modeDeepBtn) {
    modeFastBtn.addEventListener("click", () => {
      soundFX.playClick(1.05);
      modeFastBtn.classList.add("active");
      modeDeepBtn.classList.remove("active");
      const progressLabel = document.getElementById("progressLabel");
      if (progressLabel) progressLabel.textContent = "Fast Scan Mode (~60s)";
    });

    modeDeepBtn.addEventListener("click", () => {
      soundFX.playClick(1.05);
      modeDeepBtn.classList.add("active");
      modeFastBtn.classList.remove("active");
      const progressLabel = document.getElementById("progressLabel");
      if (progressLabel) progressLabel.textContent = "Deep Scan Mode (~3m)";
    });
  }

  // Keyword Chips & Interactive Filtering of Job Picks
  const keywordChips = document.querySelectorAll(".keyword-chip");
  const consoleKeywordInput = document.getElementById("consoleKeywordInput");
  const jobPickCards = document.querySelectorAll(".job-pick-card");
  const picksCounterBadge = document.getElementById("picksCounterBadge");
  const kpiNewJobs = document.getElementById("kpiNewJobs");

  keywordChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      soundFX.playClick(1.1);
      keywordChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const kw = chip.getAttribute("data-kw") || "Python";
      if (consoleKeywordInput) consoleKeywordInput.value = `${kw}, High-Growth`;

      let visibleCount = 0;
      jobPickCards.forEach((card) => {
        const domain = card.getAttribute("data-domain") || "";
        if (kw === "Full-Stack" || domain.includes(kw)) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      if (picksCounterBadge) {
        picksCounterBadge.textContent = `${visibleCount} jobs matching '${kw}'`;
      }
      if (kpiNewJobs) {
        kpiNewJobs.textContent = String(visibleCount * 6 + 6);
      }
    });
  });

  // Start Search Button & Dynamic Progress Bar
  const startSearchBtn = document.getElementById("startSearchBtn");
  const searchProgressFill = document.getElementById("searchProgressFill");
  const progressStatusText = document.getElementById("progressStatusText");

  if (startSearchBtn) {
    startSearchBtn.addEventListener("click", () => {
      soundFX.playClick(1.2);
      startSearchBtn.disabled = true;
      startSearchBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Scanning...`;

      if (progressStatusText) progressStatusText.textContent = "Pending scrape...";
      if (searchProgressFill) searchProgressFill.style.width = "0%";

      setTimeout(() => {
        if (progressStatusText) progressStatusText.textContent = "Crawling LinkedIn, Indeed & Maritime...";
        if (searchProgressFill) searchProgressFill.style.width = "45%";
        soundFX.playHoverTick(800, 0.05);
      }, 700);

      setTimeout(() => {
        if (progressStatusText) progressStatusText.textContent = "Scoring Resume Relevance...";
        if (searchProgressFill) searchProgressFill.style.width = "82%";
        soundFX.playHoverTick(900, 0.05);
      }, 1500);

      setTimeout(() => {
        if (progressStatusText) progressStatusText.textContent = "Complete (30 fresh jobs loaded)";
        if (searchProgressFill) searchProgressFill.style.width = "100%";
        startSearchBtn.disabled = false;
        startSearchBtn.innerHTML = `<i class="fa-solid fa-radar"></i> Start Search`;

        if (kpiNewJobs) kpiNewJobs.textContent = "30";
        jobPickCards.forEach((card) => (card.style.display = "flex"));
        soundFX.playClick(1.3);
      }, 2300);
    });
  }

  // Auto-save and Auto-restore Console Inputs
  const consoleLocation = document.getElementById("consoleLocation");
  const consoleExp = document.getElementById("consoleExp");
  const consoleJobType = document.getElementById("consoleJobType");
  const emailRecipientsInput = document.getElementById("emailRecipientsInput");

  // Restore saved inputs
  try {
    const savedConsole = JSON.parse(localStorage.getItem("jobsnap_landing_console") || "{}");
    if (consoleKeywordInput && savedConsole.keywords) consoleKeywordInput.value = savedConsole.keywords;
    if (consoleLocation && savedConsole.location) consoleLocation.value = savedConsole.location;
    if (consoleExp && savedConsole.exp) consoleExp.value = savedConsole.exp;
    if (consoleJobType && savedConsole.jobType) consoleJobType.value = savedConsole.jobType;
    if (emailRecipientsInput && savedConsole.email) emailRecipientsInput.value = savedConsole.email;

    const savedEmail = localStorage.getItem("jobsnap_user_email");
    if (savedEmail) {
      if (userEmailInput && !userEmailInput.value) userEmailInput.value = savedEmail;
      if (bottomEmailInput && !bottomEmailInput.value) bottomEmailInput.value = savedEmail;
    }
  } catch (e) {}

  function persistLandingConsole() {
    try {
      const data = {
        keywords: consoleKeywordInput ? consoleKeywordInput.value : "",
        location: consoleLocation ? consoleLocation.value : "",
        exp: consoleExp ? consoleExp.value : "",
        jobType: consoleJobType ? consoleJobType.value : "",
        email: emailRecipientsInput ? emailRecipientsInput.value : ""
      };
      localStorage.setItem("jobsnap_landing_console", JSON.stringify(data));
    } catch (e) {}
  }

  [consoleKeywordInput, consoleLocation, consoleExp, consoleJobType, emailRecipientsInput].forEach(el => {
    if (el) {
      el.addEventListener("input", persistLandingConsole);
      el.addEventListener("change", persistLandingConsole);
    }
  });

  if (userEmailInput) {
    userEmailInput.addEventListener("input", () => {
      localStorage.setItem("jobsnap_user_email", userEmailInput.value);
    });
  }
  if (bottomEmailInput) {
    bottomEmailInput.addEventListener("input", () => {
      localStorage.setItem("jobsnap_user_email", bottomEmailInput.value);
    });
  }

  // Save Profile Button
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      soundFX.playClick(1.15);
      persistLandingConsole();
      const originalText = saveProfileBtn.innerHTML;
      saveProfileBtn.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #34d399;"></i> Profile Saved!`;
      setTimeout(() => {
        saveProfileBtn.innerHTML = originalText;
      }, 1800);
    });
  }

  // Google Calendar Test & Sync
  const testCalendarBtn = document.getElementById("testCalendarBtn");
  const syncCalendarBtn = document.getElementById("syncCalendarBtn");
  const calStatusBadge = document.getElementById("calStatusBadge");
  const calEventDisplay = document.getElementById("calEventDisplay");
  const refreshEventsBtn = document.getElementById("refreshEventsBtn");

  if (testCalendarBtn) {
    testCalendarBtn.addEventListener("click", () => {
      soundFX.playHoverTick(850, 0.05);
      testCalendarBtn.textContent = "Testing...";
      setTimeout(() => {
        soundFX.playClick(1.2);
        testCalendarBtn.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #34d399;"></i> Verified (42ms)`;
        if (calStatusBadge) calStatusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Connected & Ready`;
        setTimeout(() => {
          testCalendarBtn.innerHTML = `<i class="fa-solid fa-plug"></i> Test Connection`;
        }, 2000);
      }, 800);
    });
  }

  if (syncCalendarBtn) {
    syncCalendarBtn.addEventListener("click", () => {
      soundFX.playHoverTick(900, 0.05);
      syncCalendarBtn.textContent = "Syncing...";
      setTimeout(() => {
        soundFX.playClick(1.25);
        syncCalendarBtn.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #34d399;"></i> 3 Events Synced`;
        if (calEventDisplay) {
          calEventDisplay.innerHTML = `<span style="display: inline-flex; align-items: center; gap: 5px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Oct 26, 11:00 AM — Maersk Tech Panel (Synced)</span><button type="button" id="refreshEventsBtn" title="Refresh Events" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 11px;"><i class="fa-solid fa-arrow-rotate-right"></i></button>`;
        }
        setTimeout(() => {
          syncCalendarBtn.innerHTML = `<i class="fa-solid fa-rotate"></i> Sync Jobs`;
        }, 2200);
      }, 900);
    });
  }

  if (refreshEventsBtn) {
    refreshEventsBtn.addEventListener("click", () => {
      soundFX.playHoverTick(920, 0.04);
      if (calEventDisplay) {
        calEventDisplay.style.opacity = "0.4";
        setTimeout(() => {
          calEventDisplay.style.opacity = "1";
        }, 300);
      }
    });
  }

  // Send Excel Report Test
  const sendExcelTestBtn = document.getElementById("sendExcelTestBtn");
  if (sendExcelTestBtn) {
    sendExcelTestBtn.addEventListener("click", () => {
      soundFX.playClick(1.15);
      const email = emailRecipientsInput?.value || "musabimp.0@gmail.com";
      sendExcelTestBtn.textContent = "Dispatched!";
      sendExcelTestBtn.style.color = "#ffffff";
      setTimeout(() => {
        sendExcelTestBtn.textContent = "Send Test";
        sendExcelTestBtn.style.color = "#34d399";
      }, 2000);
    });
  }

  // Outreach Studio Message Triggers
  document.querySelectorAll(".demo-outreach-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      soundFX.playClick(1.2);
      const name = btn.getAttribute("data-recruiter") || "Recruiter";
      const original = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Sent!`;
      setTimeout(() => {
        btn.innerHTML = original;
      }, 1600);
    });
  });

  // Message Wall Template Switching
  const templatePills = document.querySelectorAll(".template-pill");
  templatePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      soundFX.playHoverTick(760, 0.04);
      templatePills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  // 1-Click Apply Buttons in Dashboard
  document.querySelectorAll(".demo-apply-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      soundFX.playClick(1.3);
      const jobName = btn.getAttribute("data-job") || "Position";
      const original = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Applied!`;
      btn.style.background = "#10b981";
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = "";
      }, 2000);
    });
  });

  // PDF Export Roadmap Button
  const demoPdfDownloadBtn = document.getElementById("demoPdfDownloadBtn");
  if (demoPdfDownloadBtn) {
    demoPdfDownloadBtn.addEventListener("click", () => {
      soundFX.playClick(1.2);
      const original = demoPdfDownloadBtn.innerHTML;
      demoPdfDownloadBtn.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #34d399;"></i> Generating PDF...`;
      setTimeout(() => {
        demoPdfDownloadBtn.innerHTML = `<i class="fa-solid fa-download"></i> Download Ready`;
        setTimeout(() => {
          demoPdfDownloadBtn.innerHTML = original;
        }, 1800);
      }, 800);
    });
  }
});
