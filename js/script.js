// =============================
//  VALCRAFT NETWORK — script.js
// =============================

/* -----------------------------------------------
   1. PARTICLE CANVAS
----------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const PARTICLE_COUNT = 60;
  const COLORS = ['rgba(255,176,0,', 'rgba(255,106,0,', 'rgba(255,209,102,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.4 + 0.1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.4 + 0.1),
      color,
      life: Math.random() * 200 + 100,
      maxLife: 300,
    };
  }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      // Fade in/out
      const lifePct = p.life / p.maxLife;
      const alpha = p.alpha * Math.sin(lifePct * Math.PI);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();

      if (p.life <= 0 || p.y < -10) {
        particles[i] = createParticle();
        particles[i].y = H + 10;
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  resize();
  init();
  draw();
})();


/* -----------------------------------------------
   2. NAVBAR SCROLL EFFECT
----------------------------------------------- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* -----------------------------------------------
   3. HAMBURGER MOBILE MENU
----------------------------------------------- */
(function initHamburger() {
  const btn     = document.getElementById('hamburger');
  const links   = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.classList.remove('active');
      links.classList.remove('open');
    }
  });
})();


/* -----------------------------------------------
   4. COPY IP TO CLIPBOARD
----------------------------------------------- */
function copyIP(ip, btn) {
  navigator.clipboard.writeText(ip).then(() => {
    // Button state
    const original = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove('copied');
    }, 2000);

    // Toast
    showToast('✅ IP copied to clipboard!');
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = ip;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✅ IP copied!');
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
}


/* -----------------------------------------------
   5. SCROLL ANIMATIONS (AOS-lite)
----------------------------------------------- */
(function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* -----------------------------------------------
   6. ACTIVE NAV LINK ON SCROLL
----------------------------------------------- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* -----------------------------------------------
   7. SMOOTH SCROLL FOR ANCHOR LINKS
----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* -----------------------------------------------
   8. CARD TILT EFFECT (subtle on hover)
----------------------------------------------- */
(function initTilt() {
  const cards = document.querySelectorAll('.card, .server-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotY = ((x - cx) / cx) * 5;
      const rotX = -((y - cy) / cy) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();