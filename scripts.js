// scripts.js
// - Smooth scroll
// - AJAX Formspree submit (no redirect)
// - GSAP reveal animations
// - Pinned sections + bullets “pop in” while pinned

(function () {
  // Smooth scroll for same-page anchors
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Formspree AJAX submit
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");

  function setStatus(msg, ok = true) {
    if (!statusEl) return;
    statusEl.style.display = "block";
    statusEl.textContent = msg;
    statusEl.style.borderColor = ok
      ? "rgba(120, 255, 160, .25)"
      : "rgba(255, 120, 120, .25)";
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setStatus("Sending…");

      try {
        const fd = new FormData(form);
        const res = await fetch(form.action, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          form.reset();
          setStatus("✅ Sent. We’ll get back to you shortly.");
        } else {
          setStatus("❌ Something went wrong. Please try again.", false);
        }
      } catch {
        setStatus("❌ Network error. Please try again.", false);
      }
    });
  }

  // GSAP animations
  window.addEventListener("load", () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Reveal items
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    // Pinned story sections (shorter hold so it doesn’t feel slow)
    ["#pinOne", "#pinTwo", "#pinThree"].forEach((id) => {
      const el = document.querySelector(id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=55%",
        pin: true,
        pinSpacing: true,
      });

      // Subtle parallax while scrolling
      gsap.to(el, {
        backgroundPosition: "center 60%",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Bullet “pop in” while pinned (this is Option 2)
    gsap.utils.toArray(".pinned").forEach((section) => {
      const lines = section.querySelectorAll(".pinLine");
      if (!lines.length) return;

      gsap.to(lines, {
        opacity: 1,
        y: 0,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=55%",
          scrub: true
        }
      });
    });
  });
})();
