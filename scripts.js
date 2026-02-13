// scripts.js
// - Smooth scroll
// - AJAX Formspree submit (no page redirect)
// - GSAP reveal + pinned sections (real scroll animations)

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

  // GSAP scroll animations
  window.addEventListener("load", () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Reveal items
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    // Pinned story sections
    ["#pinOne", "#pinTwo", "#pinThree"].forEach((id) => {
      const el = document.querySelector(id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=85%",
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
  });
})();
