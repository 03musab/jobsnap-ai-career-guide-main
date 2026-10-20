document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Toggle ---
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  function openMenu() {
    document.body.classList.add("menu-open");
    if (burgerBtn) {
      burgerBtn.setAttribute("aria-expanded", "true");
    }
    if (mobileMenu) {
      mobileMenu.removeAttribute("hidden");
    }
    if (mobileOverlay) {
      mobileOverlay.removeAttribute("hidden");
    }
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    if (burgerBtn) {
      burgerBtn.setAttribute("aria-expanded", "false");
    }
    if (mobileMenu) {
      mobileMenu.setAttribute("hidden", "");
    }
    if (mobileOverlay) {
      mobileOverlay.setAttribute("hidden", "");
    }
  }

  function toggleMenu() {
    const isOpen = document.body.classList.contains("menu-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener("click", toggleMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
  }

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

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Set active state
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Sync active state across desktop and mobile links with matching href
      const href = link.getAttribute("href");
      if (href) {
        document.querySelectorAll(`[href="${href}"]`).forEach((matched) => {
          matched.classList.add("active");
        });
      }

      if (document.body.classList.contains("menu-open")) {
        closeMenu();
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
    const startOffset = 480 + index * 90;

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
      { threshold: 0.25 }
    );

    const statsFooter = document.getElementById("statsFooter");
    if (statsFooter) {
      observer.observe(statsFooter);
    } else {
      statElements.forEach((el, index) => {
        animateStat(el, index);
      });
    }
  } else {
    // Fallback if IntersectionObserver not supported
    statElements.forEach((el, index) => {
      animateStat(el, index);
    });
  }
});
