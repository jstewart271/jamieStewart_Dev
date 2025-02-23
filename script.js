document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("dark-mode-toggle");
  const backToTopButton = document.getElementById("back-to-top");
  const sections = document.querySelectorAll(".section");
  const progressBar = document.getElementById("scroll-progress");
  const preloader = document.getElementById("preloader");

  /* Preloader removal */
  window.addEventListener("load", () => {
    preloader.classList.add("hidden");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  });

  /* Dark mode toggle with localStorage */
  const darkModePreference = localStorage.getItem("dark-mode");
  if (darkModePreference === "enabled") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    toggle.checked = false;
  }
  toggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "disabled");
    }
  });

  /* Back-to-top smooth scroll */
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* Show/hide back-to-top button on scroll */
  window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }

    /* Scroll progress update */
    const scrollTotal =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollCurrent = document.documentElement.scrollTop;
    const scrollPercent = (scrollCurrent / scrollTotal) * 100;
    progressBar.style.width = scrollPercent + "%";
  });

  /* Intersection Observer for section fade-ins */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach((section) => observer.observe(section));

  /* Example Form Submission Handling */
  const form = document.getElementById("contact-form");
  const confirmationMessage = document.getElementById("confirmation-message");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(form);
      const formObject = {};
      formData.forEach((value, key) => (formObject[key] = value));
      fetch("http://localhost:3000/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formObject),
      })
        .then((response) => response.text())
        .then((data) => {
          form.style.display = "none";
          confirmationMessage.style.display = "block";
          confirmationMessage.innerHTML = `
            <div class="success-message">
              <h3>Thank you for reaching out!</h3>
              <p>Your message has been successfully sent. I will get back to you soon.</p>
            </div>
          `;
        })
        .catch((error) => {
          form.style.display = "none";
          confirmationMessage.style.display = "block";
          confirmationMessage.innerHTML = `
            <div class="error-message">
              <h3>Oops! Something went wrong.</h3>
              <p>Please try again later.</p>
            </div>
          `;
        });
    });
  }
});
