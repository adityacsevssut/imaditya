document.addEventListener('DOMContentLoaded', () => {
  // --- WEBSITE STATS TRACKING ---
  try {
    // 1. Page Load Counter
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0', 10);
    localStorage.setItem('visitCount', visitCount + 1);

    // Add listener for download button
    const downloadBtn = document.querySelector('a[href="AdityaResume.pdf"]');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        // 2. Resume Download Counter
        const downloadCount = parseInt(localStorage.getItem('downloadCount') || '0', 10);
        localStorage.setItem('downloadCount', downloadCount + 1);
      });
    }
  } catch (error) {
    console.error("Error accessing localStorage for stats:", error);
  }

  // --- ELEMENT SELECTORS ---
  const navToggle = document.getElementById('nav-toggle');
  const sideNav = document.getElementById('side-nav');
  const personalInfoLink = document.getElementById('personal-info-link');
  const adminLoginLink = document.getElementById('admin-login-link');
  const loginModal = document.getElementById('login-modal');
  const personalInfoFormModal = document.getElementById('personal-info-form-modal');
  const contactForm = document.getElementById('contactForm');

  // --- HELPER FUNCTION TO CLOSE SIDE NAV ---
  const closeSideNav = () => {
    if (sideNav?.classList.contains('open')) {
      sideNav.classList.remove('open');
      navToggle.classList.remove('open');
    }
  };

  // --- RESPONSIVE SIDE NAVIGATION MENU ---
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      sideNav.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // Close nav when any regular link is clicked
  document.querySelectorAll('.nav-link, .header-nav-link, .hero-cta-button').forEach(link => {
    if (link.id !== 'personal-info-link' && link.id !== 'admin-login-link') {
      link.addEventListener('click', closeSideNav);
    }
  });

  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- DYNAMIC TEXT ANIMATION ---
  const texts = ["Web Developer", "Competitive Programmer", "Tech Enthusiast", "Aspiring ML Engineer"];
  let index = 0;
  const span = document.querySelector(".hero-subtitle-highlight");
  if (span) {
    setInterval(() => {
      span.style.opacity = 0;
      setTimeout(() => {
        index = (index + 1) % texts.length;
        span.textContent = texts[index];
        span.style.opacity = 1;
      }, 500);
    }, 2500);
  }

  // --- INTERSECTION OBSERVER FOR SCROLL-IN EFFECTS ---
  const slideInElements = document.querySelectorAll('.slide-in-element');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  slideInElements.forEach(element => observer.observe(element));

  // --- THEME TOGGLE FUNCTIONALITY ---
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  const body = document.body;
  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) body.setAttribute('data-theme', savedTheme);
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      // 3. Theme Toggle Counter
      const toggleCount = parseInt(localStorage.getItem('toggleCount') || '0', 10);
      localStorage.setItem('toggleCount', toggleCount + 1);
    });
  }

  // --- SCROLL-TO-TOP BUTTON ---
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
  }

  // --- SCROLL PROGRESS BAR ---
  const progressBarContainer = document.querySelector('.scroll-progress-bar');
  if (progressBarContainer) {
      window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / totalHeight) * 100;
        progressBarContainer.querySelector('.scroll-progress-bar-inner').style.width = `${scrollProgress}%`;
      });
  }

  // --- ACTIVE NAVIGATION LINK ON SCROLL ---
  const sections = document.querySelectorAll('main section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link, .header-nav-link');
  if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          allNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -60% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // --- AJAX CONTACT FORM SUBMISSION ---
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formMessage = document.getElementById('formMessage');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        
        // 4. Log message to localStorage before sending
        try {
            const messageData = {
                name: `${contactForm.elements.firstName.value} ${contactForm.elements.lastName.value}`,
                email: contactForm.elements.email.value,
                subject: contactForm.elements.subject.value,
                message: contactForm.elements.message.value,
                timestamp: new Date().toISOString()
            };
            const allMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            allMessages.push(messageData);
            localStorage.setItem('contactMessages', JSON.stringify(allMessages));
        } catch(error) {
            console.error("Error saving message to localStorage:", error);
        }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST', body: new FormData(contactForm), headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                formMessage.style.color = 'var(--highlight-color)';
                contactForm.reset();
            } else { throw new Error('Network response was not ok.'); }
        } catch (error) {
            formMessage.textContent = 'Oops! Something went wrong. Please try again later.';
            formMessage.style.color = '#ff6b6b';
        } finally {
            formMessage.style.display = 'block';
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            setTimeout(() => { formMessage.style.display = 'none'; }, 6000);
        }
    });
  }

  // --- PERSONAL INFO FORM LOGIC ---
  if (personalInfoLink) {
    personalInfoLink.addEventListener('click', (e) => {
      e.preventDefault();
      personalInfoFormModal?.classList.remove('hidden');
      closeSideNav();
    });
  }
  
  const personalInfoForm = document.getElementById('personal-info-form');
  if (personalInfoForm) {
    personalInfoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = personalInfoForm.querySelector('button[type="submit"]');
      const formMessage = document.getElementById('personalInfoFormMessage');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = 'Submitting...';
      try {
        const response = await fetch(personalInfoForm.action, {
            method: 'POST',
            body: new FormData(personalInfoForm),
            headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
            formMessage.textContent = 'Success! Redirecting you now...';
            formMessage.style.color = 'var(--highlight-color)';
            formMessage.style.display = 'block';
            setTimeout(() => {
                window.location.href = 'personal-info.html';
            }, 2000);
        } else {
            throw new Error('Network response was not ok.');
        }
      } catch (error) {
        formMessage.textContent = 'Oops! Something went wrong. Please try again later.';
        formMessage.style.color = '#ff6b6b';
        formMessage.style.display = 'block';
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        setTimeout(() => { formMessage.style.display = 'none'; }, 6000);
      }
    });
  }
  
  // --- ADMIN LOGIN LOGIC ---
  if (adminLoginLink) {
    adminLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal?.classList.remove('hidden');
      closeSideNav();
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const passwordInput = document.getElementById('password');
      const loginError = document.getElementById('login-error');
      const adminPassword = 'Abhi_1999'; // Case-sensitive admin password
      if (passwordInput.value === adminPassword) {
        window.location.href = 'admin.html';
      } else {
        loginError.classList.remove('hidden');
      }
    });
  }

  // --- GENERIC MODAL CLOSING LOGIC ---
  [loginModal, personalInfoFormModal].forEach(modal => {
    if (modal) {
      modal.querySelector('.close-modal-btn')?.addEventListener('click', () => modal.classList.add('hidden'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }
  });
});