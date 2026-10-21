document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Toggle ---
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function openMenu() {
    document.body.classList.add("menu-open");
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
      closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720 && document.body.classList.contains("menu-open")) {
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

    const linkRect = targetLink.getBoundingClientRect();
    const pillRect = navPill.getBoundingClientRect();
    const leftOffset = linkRect.left - pillRect.left;
    const width = linkRect.width;

    if (!isAnimated) {
      navIndicator.style.transition = "none";
    } else {
      navIndicator.style.transition = "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), width 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease";
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

  // Smooth hover glide between links (Apple segmented control style)
  desktopNavLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
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

    // 4. Show celebratory confirmation message
    const successHtml = `<div style="font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; gap: 8px;"><i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Free Early Access Confirmed! Pass <strong>#${record.ticketId}</strong></div><div style="font-size: 13px; opacity: 0.95;">Welcome aboard! <strong>${record.email}</strong> is registered for 100% free compute access while capacity lasts.</div>`;

    showFeedbackElement(formFeedback, "success", successHtml);
    showFeedbackElement(bottomFormFeedback, "success", successHtml);

    // 5. Update capacity indicator text
    const capacityStatusText = document.getElementById("capacityStatusText");
    if (capacityStatusText) {
      capacityStatusText.textContent = "8% compute capacity allocated • 92% free slots available";
    }

    // 6. Non-blocking backend notification
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, source: source })
    }).catch(() => {});
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
