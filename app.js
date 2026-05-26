document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. COUNTDOWN TIMER
  // ==========================================
  // Target: 30 May 2026 at 3:00 PM IST (UTC+5:30)
  const targetDate = new Date('2026-05-30T15:00:00+05:30').getTime();
  
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      
      const timerTitle = document.querySelector('.countdown-title');
      if (timerTitle) timerTitle.innerText = 'Masterclass Is Live Now!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ==========================================
  // 2. CURRICULUM TABS TOGGLE
  // ==========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.curriculum-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetEl = document.getElementById(targetId);
      targetEl.classList.add('active');
      
      // Trigger GSAP stagger animation on active tab cards
      if (typeof gsap !== 'undefined') {
        gsap.from(targetEl.querySelectorAll('.module-card'), {
          opacity: 0,
          y: 20,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        
        gsap.from(targetEl.querySelector('.curriculum-banner-card'), {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  });


  // ==========================================
  // 3. TOAST NOTIFICATION GENERATOR
  // ==========================================
  const toastHolder = document.getElementById('toast-holder');

  function showToast(message, type = 'success') {
    if (!toastHolder) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let emoji = '✓';
    if (type === 'error') emoji = '❌';
    if (type === 'warning') emoji = '⚠️';
    
    toast.innerHTML = `<span>${emoji}</span> <div>${message}</div>`;
    toastHolder.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }


  // ==========================================
  // 4. STICKY MOBILE CTA ON SCROLL
  // ==========================================
  const mobileStickyCta = document.getElementById('mobile-sticky-cta');
  
  function checkScrollCta() {
    if (!mobileStickyCta) return;
    
    if (window.innerWidth <= 768) {
      if (window.scrollY > 450) {
        mobileStickyCta.style.display = 'flex';
      } else {
        mobileStickyCta.style.display = 'none';
      }
    } else {
      mobileStickyCta.style.display = 'none';
    }
  }

  window.addEventListener('scroll', checkScrollCta);
  window.addEventListener('resize', checkScrollCta);


  // ==========================================
  // 5. REGISTRATION FORM VALIDATION & INTEGRATION
  // ==========================================
  const form = document.getElementById('registration-form');
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const mobileInput = document.getElementById('reg-mobile');
  const professionInput = document.getElementById('reg-profession');
  const cityInput = document.getElementById('reg-city');
  const intentSelect = document.getElementById('reg-intent');

  const landingView = document.getElementById('landing-view');
  const thankYouView = document.getElementById('thank-you-view');

  const userDisplayEmail = document.getElementById('user-display-email');
  const emailPreviewToName = document.getElementById('email-preview-to-name');
  const emailPreviewToEmail = document.getElementById('email-preview-to-email');
  const emailUserName = document.getElementById('email-user-name');

  function getTrafficSource() {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const referral = document.referrer ? new URL(document.referrer).hostname : '';
    
    if (utmSource) return utmSource;
    if (referral) {
      if (referral.includes('facebook.com')) return 'Facebook Referrer';
      if (referral.includes('t.co') || referral.includes('twitter.com')) return 'Twitter/X';
      if (referral.includes('google.com')) return 'Google Search';
      return referral;
    }
    return 'Direct Landing';
  }

  const inputs = [nameInput, emailInput, mobileInput, professionInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        const parent = input.closest('.form-field');
        if (parent) {
          parent.classList.remove('has-error');
        }
      });
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      // Validate Full Name
      if (!nameInput.value.trim()) {
        showError('field-name');
        isValid = false;
      } else {
        hideError('field-name');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        showError('field-email');
        isValid = false;
      } else {
        hideError('field-email');
      }

      // Validate Mobile (10 digits)
      const sanitizedMobile = mobileInput.value.trim().replace(/[-+()\s]/g, '');
      const mobileRegex = /^\d{10}$/;
      if (!mobileInput.value.trim() || !mobileRegex.test(sanitizedMobile)) {
        showError('field-mobile');
        isValid = false;
      } else {
        hideError('field-mobile');
      }

      // Validate Profession
      if (!professionInput.value.trim()) {
        showError('field-profession');
        isValid = false;
      } else {
        hideError('field-profession');
      }

      if (isValid) {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const mobile = sanitizedMobile;
        const profession = professionInput.value.trim();
        const city = cityInput.value.trim() || 'N/A';
        const goal = intentSelect.value;
        const source = getTrafficSource();
        const timestamp = new Date().toISOString();

        // 1. Save to local storage database (for dashboard metrics sync)
        const localRegs = JSON.parse(localStorage.getItem('masterclass_registrations') || '[]');
        const registrationRecord = { timestamp, name, email, mobile, profession, city, goal, source };
        localRegs.push(registrationRecord);
        localStorage.setItem('masterclass_registrations', JSON.stringify(localRegs));

        // 2. Fetch Webhook URL if configured
        const webhookUrl = localStorage.getItem('masterclass_webhook') || 'https://script.google.com/macros/s/AKfycbxMDYwfmY1PICsoWBT3rXEWmcucq80OWbUVWDNKLS-N7_b-5i4pFxhJ8n2WmzNiuQWVkA/exec';

        if (webhookUrl) {
          fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationRecord)
          })
          .catch(err => {
            console.error('Failed to post to Google Sheets Webhook:', err);
          });
        }

        // 3. Set text overlays in success elements
        if (userDisplayEmail) userDisplayEmail.innerText = email;
        if (emailPreviewToName) emailPreviewToName.innerText = name;
        if (emailPreviewToEmail) emailPreviewToEmail.innerText = email;
        if (emailUserName) emailUserName.innerText = name;

        // 4. Page transition to success screen
        landingView.style.display = 'none';
        thankYouView.style.display = 'block';
        if (mobileStickyCta) mobileStickyCta.style.display = 'none';
        window.scrollTo(0, 0);

        // 5. Fire confetti simulation
        initConfetti();

        // 6. Track Lead event in Meta Pixel
        if (typeof MetaPixel !== 'undefined') {
          MetaPixel.trackEvent('Lead', {
            content_name: 'AI Masterclass Registration',
            status: 'Success'
          });
        }

      } else {
        const card = document.getElementById('register-card');
        if (card) {
          card.classList.remove('shake');
          void card.offsetWidth;
          card.classList.add('shake');
        }
        showToast('Please correct the highlighted fields in the form.', 'error');
      }
    });
  }

  function showError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add('has-error');
    }
  }

  function hideError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.remove('has-error');
    }
  }


  // ==========================================
  // 6. BACK TO HOME SYSTEM RESET
  // ==========================================
  const backHomeBtn = document.getElementById('btn-back-home');
  if (backHomeBtn) {
    backHomeBtn.addEventListener('click', () => {
      if (form) form.reset();
      
      const fields = document.querySelectorAll('.form-field');
      fields.forEach(f => f.classList.remove('has-error'));

      thankYouView.style.display = 'none';
      landingView.style.display = 'block';
      window.scrollTo(0, 0);
      
      // Re-initialize animations and ScrollTriggers for home page
      initGsapAnimations();
      
      checkScrollCta();
    });
  }

  // Handle logo and navbar link clicks when success screen is active
  const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
  const navItems = document.querySelectorAll('.nav-link-item');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // If success page is active, restore the landing view first
      if (thankYouView && thankYouView.style.display === 'block') {
        e.preventDefault();
        
        if (form) form.reset();
        const fields = document.querySelectorAll('.form-field');
        fields.forEach(f => f.classList.remove('has-error'));

        thankYouView.style.display = 'none';
        landingView.style.display = 'block';
        
        // Re-initialize GSAP animations & refresh ScrollTrigger
        initGsapAnimations();
        
        // Programmatically scroll to the clicked target section
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
        
        checkScrollCta();
      }

      // Dynamic class highlighting on click
      if (link.classList.contains('nav-link-item')) {
        navItems.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Scroll Spy function to dynamically highlight navbar links on scroll
  function runScrollSpy() {
    if (!landingView || landingView.style.display === 'none') return;
    
    const sections = ['hero', 'why', 'curriculum', 'audience'];
    let currentActive = 'hero';
    const navHeight = 90; // offset height for navigation bar

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        const top = section.offsetTop - navHeight - 20;
        if (window.scrollY >= top) {
          currentActive = id;
        }
      }
    });

    navItems.forEach(item => {
      if (item.getAttribute('href') === `#${currentActive}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', runScrollSpy);
  window.addEventListener('resize', runScrollSpy);


  // ==========================================
  // 7. CANVAS CONFETTI PHYSICS SYSTEM
  // ==========================================
  const canvas = document.getElementById('confetti-canvas');
  let ctx = null;
  let animationId = null;
  let particles = [];
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  function resizeCanvas() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  window.addEventListener('resize', resizeCanvas);

  function initConfetti() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 120,
        y: canvas.height + 20,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 15,
        speedY: -Math.random() * 15 - 15,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.45,
        opacity: 1
      });
    }
    
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    animateConfetti();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    particles.forEach(p => {
      if (p.opacity > 0) {
        activeParticles++;
        
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += p.gravity;
        p.rotation += p.rotationSpeed;
        p.speedX *= 0.98;
        
        if (p.y > canvas.height * 0.8) {
          p.opacity -= 0.02;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 1.5);
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationId = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ==========================================
  // 8. GSAP AND MOTION GRAPHICS SYSTEM
  // ==========================================
  function initGsapAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Kill existing ScrollTriggers to prevent duplicates/conflicts
    ScrollTrigger.getAll().forEach(t => t.kill());

    // Reset inline CSS styling to prevent blank cards or stuck opacities
    const elementsToReset = document.querySelectorAll(
      '.hero-tag, .hero-title, .hero-subtitle, .hero-cta-group, .hero-visual-card, ' +
      '.why-section .section-header, .benefits-text p, .no-tech-box, .benefit-item, ' +
      '.about-card, .curriculum-section .section-header, .curriculum-grid .module-card, ' +
      '.curriculum-banner-card, ' +
      '.audience-section .section-header, .attend-card, .different-section, ' +
      '.bonuses-section .section-header, .bonuses-mockup-card, .bonuses-grid .bonus-card, ' +
      '.is-not-card, .need-bubble-container, .form-wrapper'
    );
    elementsToReset.forEach(el => {
      el.style.opacity = '';
      el.style.transform = '';
      el.style.visibility = '';
    });

    gsap.registerPlugin(ScrollTrigger);

    // Hero Entrance Animations
    const heroTl = gsap.timeline();
    heroTl.from('.hero-tag', { opacity: 0, y: -20, duration: 0.6, ease: 'power2.out' })
          .from('.hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.4')
          .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.6')
          .from('.hero-visual-card', { opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out' }, '-=0.8');

    // Continuous Floating Animations
    gsap.to('.hero-visual-card', {
      y: -10,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    gsap.to('.bonuses-mockup-card', {
      y: -12,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.5
    });

    gsap.to('.about-visual-card', {
      y: -8,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.2
    });

    // ScrollTrigger Reveals (Consolidated on stable Section IDs with once: true)
    
    // Section 2: Why AI (#why)
    const whyTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#why',
        start: 'top 95%',
        once: true
      }
    });
    whyTl.from('.why-section .section-header', {
      opacity: 0,
      y: 35,
      duration: 0.8,
      ease: 'power2.out'
    })
    .from('.benefits-text p, .no-tech-box', {
      opacity: 0,
      x: -40,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.4');

    // Section 3: About (#about)
    gsap.from('.about-card', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 95%',
        once: true
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out'
    });

    // Section 4 & 5: Curriculum (#curriculum)
    const curriculumTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#curriculum',
        start: 'top 95%',
        once: true
      }
    });
    curriculumTl.from('.curriculum-section .section-header', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Section 6: Who should attend (#audience)
    const audienceTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#audience',
        start: 'top 95%',
        once: true
      }
    });
    audienceTl.from('.audience-section .section-header', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Section 7: Different (#different)
    gsap.from('.different-section', {
      scrollTrigger: {
        trigger: '#different',
        start: 'top 95%',
        once: true
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Section 8: Bonuses (#bonuses)
    const bonusesTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#bonuses',
        start: 'top 95%',
        once: true
      }
    });
    bonusesTl.from('.bonuses-section .section-header', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Set a tiny timeout to refresh ScrollTrigger layout coordinates
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  }

  // Initial call on DOMContentLoaded
  initGsapAnimations();

  // Refresh ScrollTrigger layout coordinates on window load
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

});
