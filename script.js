document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const progressBar = document.getElementById("scroll-progress");
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.querySelector(".theme-toggle__label");
  const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const revealItems = document.querySelectorAll("[data-reveal]");
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const currentYear = document.getElementById("current-year");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const applyTheme = (theme, persist = true) => {
    const isDark = theme === "dark";

    body.dataset.theme = theme;

    if (persist) {
      localStorage.setItem("theme", theme);
    }

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    if (themeLabel) {
      themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
    }

    if (themeIcon) {
      themeIcon.classList.toggle("fa-moon", !isDark);
      themeIcon.classList.toggle("fa-sun", isDark);
    }
  };

  const savedTheme = localStorage.getItem("theme");
  const preferredTheme = savedTheme || (systemTheme.matches ? "dark" : "light");
  applyTheme(preferredTheme, Boolean(savedTheme));

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  }

  systemTheme.addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(event.matches ? "dark" : "light", false);
    }
  });

  const setNavOpen = (isOpen) => {
    if (!siteNav || !navToggle) {
      return;
    }

    siteNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
    body.classList.toggle("nav-open", isOpen && window.innerWidth <= 860);
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!isOpen);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setNavOpen(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!siteNav || !navToggle) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!siteNav.contains(target) && !navToggle.contains(target)) {
      setNavOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      body.classList.remove("nav-open");
      if (siteNav) {
        siteNav.classList.remove("is-open");
      }
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  const updateProgress = () => {
    if (!progressBar) {
      return;
    }

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const activeId = visibleEntry.target.id;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("active", isActive);
        });
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-20% 0px -45% 0px",
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
});
