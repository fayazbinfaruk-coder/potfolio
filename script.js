// small interaction and enhancement logic
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Theme toggle with preference persistence
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme) {
    root.setAttribute('data-theme', storedTheme);
  } else if (prefersDark) {
    root.setAttribute('data-theme', 'dark');
  }

  const updateThemeIcon = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (themeToggle) themeToggle.textContent = isDark ? '◑' : '◐';
  };
  updateThemeIcon();

  themeToggle?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateThemeIcon();
  });

  // avatar parallax tilt effect
  const card = document.getElementById('avatarCard');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const rx = (-dy / rect.height) * 10;
    const ry = (dx / rect.width) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform = '');

  // Nav toggle (mobile)
  const navToggle = document.querySelector('.nav-toggle');
  navToggle?.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (!links) return;
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.background = 'var(--surface)';
    links.style.padding = '0.7rem';
    links.style.borderRadius = '12px';
    links.style.border = '1px solid var(--border)';
  });

  // Skill bar animations
  const observeSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-bar');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = width;
          }, 200);
        }
      });
    }, {threshold: 0.5});
    
    skillBars.forEach(bar => observer.observe(bar));
  };
  
  observeSkillBars();

  // Progressive enhancement: if profile image fails to load, fallback to initials
  const avatarImg = document.getElementById('avatar');
  avatarImg?.addEventListener('error', () => {
    // fallback to generated data URL with initials
    const canvas = document.createElement('canvas');
    canvas.width = 240; canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1c1f23';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font = 'bold 96px sans-serif'; ctx.fillStyle = '#c16b4a';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('FB', canvas.width/2, canvas.height/2 + 10);
    avatarImg.src = canvas.toDataURL();
  });

  // small enhancement: smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Scroll-driven ambient background movement
  let ticking = false;
  const updateScroll = () => {
    document.documentElement.style.setProperty('--scroll-y', window.scrollY.toFixed(2));
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };
  updateScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
