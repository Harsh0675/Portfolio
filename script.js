document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Copyright Year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Cursor Glow Follower
  const cursorGlow = document.getElementById("cursor-glow");
  if (cursorGlow) {
    window.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });

    // Close menu when clicking links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const icon = mobileToggle.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      });
    });
  }

  // 4. Interactive Particle Canvas Background
  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);

    // Particle pool
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 75);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.4 + 0.2
    }));

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.fill();

        // Connect particles close to mouse
        const dxMouse = mouseX - p.x;
        const dyMouse = mouseY - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 * (1 - distMouse / 140)})`;
          ctx.stroke();
        }

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${0.12 * (1 - dist / 110)})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animateParticles);
    };

    animateParticles();
  }

  // 5. Scroll Reveal Intersection Observer
  const reveals = document.querySelectorAll(".reveal");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  reveals.forEach((el) => observer.observe(el));

  // 6. Copy Email to Clipboard
  const copyBtn = document.getElementById("copy-email-btn");
  const copyText = document.getElementById("copy-text");
  const toast = document.getElementById("toast");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const email = "ngrharsh078@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        if (copyText) copyText.textContent = "Copied!";
        if (toast) {
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 3000);
        }
        setTimeout(() => {
          if (copyText) copyText.textContent = "Copy Email";
        }, 2000);
      });
    });
  }
});
