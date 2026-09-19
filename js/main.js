(() => {
  const root = document.documentElement;
  const nav = document.getElementById("nav");
  const links = document.getElementById("nav-links");
  const menuBtn = document.getElementById("menu-btn");
  const frost = document.querySelector(".cursor-frost");
  const canvas = document.getElementById("void");
  const stage = document.getElementById("planet-stage");
  const copyBtn = document.getElementById("copy-ca");
  const ca = document.getElementById("ca");

  const ctx = canvas.getContext("2d", { alpha: true });
  const stars = [];
  const meteors = [];
  let w = 0;
  let h = 0;
  let raf = 0;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars.length = 0;
    const count = Math.min(220, Math.floor((w * h) / 14000));
    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.7 + 0.15,
        s: Math.random() * 0.35 + 0.05,
      });
    }
  };

  const spawnMeteor = () => {
    meteors.push({
      x: Math.random() * w * 0.8 + w * 0.1,
      y: Math.random() * h * 0.35,
      vx: -4.2 - Math.random() * 3,
      vy: 1.6 + Math.random() * 1.4,
      life: 1,
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    stars.forEach((star) => {
      star.a += Math.sin(performance.now() * 0.001 * star.s) * 0.004;
      ctx.beginPath();
      ctx.fillStyle = `rgba(210, 228, 245, ${Math.max(0.08, Math.min(0.9, star.a))})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    meteors.forEach((m, i) => {
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.016;
      ctx.strokeStyle = `rgba(210, 230, 250, ${Math.max(0, m.life)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 6, m.y - m.vy * 6);
      ctx.stroke();
      if (m.life <= 0) meteors.splice(i, 1);
    });

    raf = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
  setInterval(spawnMeteor, 4200);

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  });

  menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    },
    { threshold: 0.16 }
  );
  document.querySelectorAll(".rise").forEach((el) => io.observe(el));

  window.addEventListener("mousemove", (event) => {
    frost.classList.add("on");
    frost.style.left = `${event.clientX}px`;
    frost.style.top = `${event.clientY}px`;

    const x = (event.clientX / w - 0.5) * 10;
    const y = (event.clientY / h - 0.5) * 8;
    stage.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (event) => {
      const box = el.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      el.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ca.textContent.trim());
      copyBtn.textContent = "Copied";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 1400);
    } catch {
      copyBtn.textContent = "Failed";
    }
  });

  root.style.setProperty("--void", "#02060f");
})();
