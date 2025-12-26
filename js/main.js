// Explicit site scripts

// ========================================
// THEME TOGGLE
// ========================================

const STORAGE_KEY = 'explicit-theme';

/**
 * Get preferred theme based on localStorage or system preference
 * @returns {'dark' | 'light'}
 */
function getPreferredTheme() {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  // Default to light
  return 'light';
}

/**
 * Apply theme to document and update UI
 * @param {'dark' | 'light'} theme
 */
function setTheme(theme) {
  // Set data-theme attribute on html element
  document.documentElement.setAttribute('data-theme', theme);

  // Update all toggle button texts
  const toggleLabels = document.querySelectorAll('.theme-label');
  toggleLabels.forEach(label => {
    label.textContent = theme;
  });

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

/**
 * Initialize theme on page load
 */
function initTheme() {
  const theme = getPreferredTheme();
  setTheme(theme);

  // Set up toggle button click handlers (desktop and mobile overlay)
  const toggleButtons = document.querySelectorAll('.nav__theme-toggle');
  toggleButtons.forEach(button => {
    button.addEventListener('click', toggleTheme);
  });

  // Set up mobile header toggle button
  const mobileHeaderToggle = document.querySelector('.nav__theme-toggle--mobile-header');
  if (mobileHeaderToggle) {
    mobileHeaderToggle.addEventListener('click', toggleTheme);
  }

  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// ========================================
// NAVIGATION
// ========================================

/**
 * Handle header scroll state
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });
}

/**
 * Handle mobile navigation toggle
 */
function initMobileNav() {
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay = document.querySelector('.nav__mobile-overlay');

  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    overlay.classList.toggle('active');

    // Prevent body scroll when overlay is open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Close overlay when clicking a link
  const overlayLinks = overlay.querySelectorAll('a');
  overlayLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close overlay on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ========================================
// EASTER EGG: XP ERROR MODAL
// ========================================

/**
 * Initialize the "die" easter egg modal
 */
function initEasterEggModal() {
  const trigger = document.querySelector('.easter-egg-die');
  const modal = document.getElementById('errorModal');
  const okBtn = document.getElementById('modalOk');
  const helpBtn = document.getElementById('modalHelp');
  const errorSound = document.getElementById('errorSound');

  if (!trigger || !modal) return;

  // Open modal on click
  trigger.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Play error sound
    if (errorSound) {
      errorSound.currentTime = 0;
      errorSound.play().catch(() => {
        // Audio play failed (autoplay policy), ignore silently
      });
    }
  });

  // Close modal functions
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Register DIE easter egg
    if (typeof registerEgg === 'function') {
      registerEgg('die', "You're paying attention.\nMost people scroll past.");
    }
  }

  // OK button closes modal
  if (okBtn) {
    okBtn.addEventListener('click', closeModal);
  }

  // Help button closes modal and opens email
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      closeModal();
      window.location.href = 'mailto:hello@explicit.studio';
    });
  }

  // Click on overlay closes modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

/**
 * Initialize scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

// ========================================
// HERO SLIDESHOW
// ========================================

/**
 * Initialize the hero image slideshow
 * Images can be easily changed by modifying the HTML
 */
function initHeroSlideshow() {
  const slideshow = document.querySelector('.hero__slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.hero__slide');
  if (slides.length <= 1) return;

  const nameEl = slideshow.querySelector('.hero__slideshow-name');
  const epitaphEl = slideshow.querySelector('.hero__slideshow-epitaph');

  let currentIndex = 0;
  const intervalTime = 3000; // 3 seconds per slide

  function updateCaption(slide) {
    if (!nameEl || !epitaphEl) return;
    const name = slide.dataset.name || '';
    const epitaph = slide.dataset.epitaph || '';
    nameEl.textContent = name;
    epitaphEl.textContent = epitaph ? `"${epitaph}"` : '';
  }

  function showNextSlide() {
    // Remove active class from current slide
    slides[currentIndex].classList.remove('active');

    // Move to next slide (loop back to start if at end)
    currentIndex = (currentIndex + 1) % slides.length;

    // Add active class to new slide
    slides[currentIndex].classList.add('active');

    // Update caption
    updateCaption(slides[currentIndex]);
  }

  // Start the slideshow
  setInterval(showNextSlide, intervalTime);
}

// ========================================
// CLIENT CARDS ACCORDION
// ========================================

/**
 * Initialize the client cards accordion
 */
function initClientCards() {
  const cards = document.querySelectorAll('.client-card');

  cards.forEach(card => {
    const header = card.querySelector('.client-card__header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');

      // Close all other cards
      cards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.classList.remove('is-open');
          otherCard.querySelector('.client-card__header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current card
      card.classList.toggle('is-open');
      header.setAttribute('aria-expanded', !isOpen);
    });
  });
}

// ========================================
// CONTACT FORM
// ========================================

/**
 * Initialize the contact form with Formspree submission
 */
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.innerHTML = '<div class="form-success"><p>Message sent.</p></div>';
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      submitBtn.textContent = 'Error - try again';
      submitBtn.disabled = false;
      setTimeout(() => {
        submitBtn.textContent = originalText;
      }, 3000);
    }
  });
}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Critical initializations - run immediately
  initTheme();
  initHeaderScroll();
  initMobileNav();

  // Non-critical initializations - defer to idle time
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initEasterEggModal();
      initScrollAnimations();
      initHeroSlideshow();
      initClientCards();
      initContactForm();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      initEasterEggModal();
      initScrollAnimations();
      initHeroSlideshow();
      initClientCards();
      initContactForm();
    }, 200);
  }
});
