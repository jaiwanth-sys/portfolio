/**
 * PORTFOLIO JAVASCRIPT - JAIWANTH S.
 * Handles interactive particles, dynamic typewriter, project filtering,
 * modal popups, theme switching, scroll animations, clipboard actions, and contact handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THEME SWITCHER (MULTI-THEME PALETTES)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themePaletteBtn = document.getElementById('theme-palette-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeOptBtns = document.querySelectorAll('.theme-opt-btn');
  const htmlRoot = document.documentElement;

  const themesList = ['dark', 'matrix', 'amethyst', 'teal', 'light'];
  const themeLabels = {
    dark: 'Slate Gray',
    matrix: 'Emerald Matrix',
    amethyst: 'Midnight Violet',
    teal: 'Quantum Teal',
    light: 'Clean Quartz'
  };

  // Initialize theme from localStorage or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme, false);

  function applyTheme(themeName, showNotification = true) {
    if (!themesList.includes(themeName)) themeName = 'dark';
    htmlRoot.setAttribute('data-theme', themeName);
    localStorage.setItem('portfolio-theme', themeName);

    // Update active class on dropdown options
    themeOptBtns.forEach((btn) => {
      if (btn.getAttribute('data-set-theme') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (showNotification) {
      showToast(`Switched to ${themeLabels[themeName] || themeName.toUpperCase()} Theme!`);
    }
  }

  // Toggle dropdown menu
  if (themePaletteBtn && themeMenu) {
    themePaletteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!themeMenu.contains(e.target) && e.target !== themePaletteBtn) {
        themeMenu.classList.remove('show');
      }
    });
  }

  // Handle clicking palette options
  themeOptBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-set-theme');
      applyTheme(selectedTheme);
      themeMenu?.classList.remove('show');
    });
  });

  // Quick cycle button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const currentIndex = themesList.indexOf(currentTheme);
      const nextTheme = themesList[(currentIndex + 1) % themesList.length];
      applyTheme(nextTheme);
    });
  }

  // ==========================================
  // 2. INTERACTIVE PARTICLES CANVAS
  // ==========================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        const currentTheme = htmlRoot.getAttribute('data-theme');
        let color = 'rgba(0, 240, 255, 0.45)';
        if (currentTheme === 'matrix') color = 'rgba(0, 255, 157, 0.45)';
        else if (currentTheme === 'amethyst') color = 'rgba(244, 63, 94, 0.45)';
        else if (currentTheme === 'teal') color = 'rgba(20, 184, 166, 0.45)';
        else if (currentTheme === 'light') color = 'rgba(2, 132, 199, 0.35)';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function connectParticles() {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const maxDistance = 120;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance);
            let stroke = `rgba(99, 102, 241, ${opacity * 0.18})`;
            if (currentTheme === 'matrix') stroke = `rgba(0, 255, 157, ${opacity * 0.18})`;
            else if (currentTheme === 'amethyst') stroke = `rgba(168, 85, 247, ${opacity * 0.18})`;
            else if (currentTheme === 'teal') stroke = `rgba(14, 165, 233, ${opacity * 0.18})`;
            else if (currentTheme === 'light') stroke = `rgba(79, 70, 229, ${opacity * 0.12})`;

            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
  }

  // ==========================================
  // 3. DYNAMIC TYPEWRITER EFFECT
  // ==========================================
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const roles = [
      'AI & Machine Learning Undergrad',
      'Edge IoT Systems Builder',
      'Python & PostgreSQL Developer',
      'Aspiring Software Engineer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDelay = 1800;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
      }

      setTimeout(typeEffect, speed);
    }

    typeEffect();
  }

  // ==========================================
  // 4. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHT
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    // Sticky navbar styling
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }

    // Active nav link spy
    let currentSection = '';
    sections.forEach((sec) => {
      const sectionTop = sec.offsetTop - 120;
      const sectionHeight = sec.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Scroll to top click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 5. MOBILE DRAWER MENU
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 6. PROJECT CATEGORY FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // ==========================================
  // 7. PROJECT DETAILS MODAL POPUP
  // ==========================================
  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-content');
  const closeProjectModalBtn = document.getElementById('close-project-modal');
  const detailButtons = document.querySelectorAll('.view-project-details');

  const projectDetailsData = {
    nlp_resume: {
      title: 'NLP-Based Resume & Job Description Analyzer',
      category: 'Artificial Intelligence & Natural Language Processing',
      badge: 'AI & NLP Model',
      overview:
        'An intelligent NLP application developed to automate candidate resume screening. The system parses PDF/DOCX resumes, extracts key skills and experience entities, and compares them semantically with recruiter job descriptions using vector space modeling.',
      techStack: ['Python 3.x', 'NLP (spaCy & NLTK)', 'Scikit-Learn', 'TF-IDF Vectorizer', 'Cosine Similarity', 'Streamlit / Web UI'],
      features: [
        'Automated text parsing and linguistic preprocessing (tokenization, lemmatization, stop-word removal).',
        'TF-IDF vector space modeling and cosine similarity scoring for semantic match evaluation.',
        'Intelligent skill-gap analysis highlighting missing qualifications and requirements.',
        'Objective suitability percentage calculation for fast candidate shortlisting.'
      ],
      github: 'https://github.com/jaiwanth-sys'
    },
    intrusion: {
      title: 'Edge-Based Intrusion Detection System',
      category: 'IoT Security & Embedded Computing',
      badge: 'Hardware & Edge AI',
      overview:
        'A dedicated edge security platform designed to detect perimeter breaches in real time without relying on constant cloud round-trips. By processing sensor signals locally at the microcontroller level, it drastically reduces latency and operates reliably in air-gapped environments.',
      techStack: ['Arduino IDE', 'Embedded C/C++', 'Ultrasonic & PIR Sensors', 'Edge Logic', 'Buzzer & Relay Alerting'],
      features: [
        'Real-time anomaly monitoring using perimeter sensor arrays.',
        'Zero cloud-dependency edge architecture ensuring uninterrupted security operation.',
        'Instant multi-channel alerting (audible triggers and hardware signal pins).',
        'Efficient power management for extended edge hardware deployment.'
      ],
      github: 'https://github.com/jaiwanth-sys'
    },
    library: {
      title: 'E-Library Management System',
      category: 'Desktop Software & Database Architecture',
      badge: 'Python & PostgreSQL',
      overview:
        'A comprehensive desktop application engineered to automate administrative operations of modern institutional libraries. Built with Python Tkinter and a normalized PostgreSQL database for fast queries and ACID compliance.',
      techStack: ['Python 3.x', 'Tkinter GUI Framework', 'PostgreSQL', 'psycopg2 Database Driver', 'SQL'],
      features: [
        'Secure role-based administrator login and permission controls.',
        'Dynamic book catalog search by title, author, category, or ISBN.',
        'Automated issue and return transactions with borrower tracking and penalty calculations.',
        'Structured database normalization preventing data redundancy and ensuring rapid record search.'
      ],
      github: 'https://github.com/jaiwanth-sys'
    },
    water: {
      title: 'Smart Water Level Monitoring System',
      category: 'IoT Automation & Resource Conservation',
      badge: 'Arduino & Sensors',
      overview:
        'An automated IoT-driven water reservoir monitoring solution engineered to combat water wastage. Utilizes non-contact ultrasonic distance calculation to accurately measure tank levels and manage pump automation.',
      techStack: ['Arduino Microcontroller', 'HC-SR04 Ultrasonic Sensor', 'Relay Module', 'Embedded C', 'LCD Display'],
      features: [
        'Precision non-contact liquid level measurement via ultrasonic echo timing.',
        'Automated high/low threshold alerts to prevent overflows and pump dry runs.',
        'Real-time metric visualization on local displays with minimal energy footprint.',
        'Scalable blueprint suitable for residential complexes and institutional tanks.'
      ],
      github: 'https://github.com/jaiwanth-sys'
    }
  };

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      const data = projectDetailsData[projectKey];
      if (!data) return;

      projectModalContent.innerHTML = `
        <div class="project-modal-view">
          <div class="project-badge" style="margin-bottom: 0.75rem;"><i class="fa-solid fa-microchip"></i> ${data.badge}</div>
          <h2 style="font-size: 1.6rem; margin-bottom: 0.3rem;">${data.title}</h2>
          <p style="color: var(--accent-cyan); font-size: 0.9rem; font-weight: 600; margin-bottom: 1.25rem;">${data.category}</p>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--text-primary);">Project Overview</h4>
            <p style="color: var(--text-secondary); font-size: 0.925rem; line-height: 1.6;">${data.overview}</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--text-primary);">Key Architectural Features</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">
              ${data.features.map((f) => `<li><i class="fa-solid fa-check-circle" style="color: var(--accent-emerald); margin-right: 0.5rem;"></i>${f}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-bottom: 1.75rem;">
            <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--text-primary);">Technologies Employed</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${data.techStack.map((t) => `<span class="tag" style="font-size: 0.8rem; padding: 0.3rem 0.75rem;">${t}</span>`).join('')}
            </div>
          </div>

          <div style="display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
            <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <i class="fa-brands fa-github"></i> Open Source Repository
            </a>
          </div>
        </div>
      `;

      projectModal?.classList.add('active');
    });
  });

  function closeProjectModal() {
    projectModal?.classList.remove('active');
  }

  closeProjectModalBtn?.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  // ==========================================
  // 8. RESUME MODAL HANDLER
  // ==========================================
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const closeResumeModalBtn = document.getElementById('close-resume-modal');

  function openResume() {
    resumeModal?.classList.add('active');
  }

  function closeResume() {
    resumeModal?.classList.remove('active');
  }

  openResumeBtn?.addEventListener('click', openResume);
  heroResumeBtn?.addEventListener('click', openResume);
  closeResumeModalBtn?.addEventListener('click', closeResume);
  resumeModal?.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  // Global ESC key listener for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResume();
    }
  });

  // ==========================================
  // 9. 1-CLICK CLIPBOARD COPY
  // ==========================================
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        btn.classList.add('copied');
        const tooltip = btn.querySelector('.copy-tooltip');
        if (tooltip) tooltip.textContent = 'Copied!';

        showToast(`Copied to clipboard: ${textToCopy}`);

        setTimeout(() => {
          btn.classList.remove('copied');
          if (tooltip) tooltip.textContent = 'Copy';
        }, 2000);
      } catch (err) {
        showToast('Failed to copy. Please manually select the text.');
      }
    });
  });

  // ==========================================
  // 10. CONTACT FORM HANDLER
  // ==========================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value.trim();
      const email = document.getElementById('form-email')?.value.trim();
      const subject = document.getElementById('form-subject')?.value.trim();
      const message = document.getElementById('form-message')?.value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill out all fields before sending.');
        return;
      }

      // Construct mailto link
      const mailtoUrl = `mailto:jaiwanthjai19@gmail.com?subject=${encodeURIComponent(
        `[Portfolio Inquiry] ${subject} - from ${name}`
      )}&body=${encodeURIComponent(
        `Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`
      )}`;

      showToast(`Thank you, ${name}! Launching email client...`);

      // Open email client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      contactForm.reset();
    });
  }

  // ==========================================
  // 11. TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-30px)';
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3200);
  }
});
