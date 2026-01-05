// Explicit site scripts - Simplified for reliability

// ========================================
// NAVIGATION
// ========================================

/**
 * Handle header scroll state
 */
function initHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', function() {
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
  var hamburger = document.querySelector('.nav__hamburger');
  var overlay = document.querySelector('.nav__mobile-overlay');

  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', function() {
    var isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    overlay.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Close overlay when clicking a link
  var overlayLinks = overlay.querySelectorAll('a');
  overlayLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close overlay on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
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
  var animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (!animatedElements.length) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });
}

// ========================================
// CLIENT CARDS ACCORDION
// ========================================

/**
 * Initialize the client cards accordion
 */
function initClientCards() {
  var cards = document.querySelectorAll('.client-card');

  cards.forEach(function(card) {
    var header = card.querySelector('.client-card__header');
    if (!header) return;

    header.addEventListener('click', function() {
      var isOpen = card.classList.contains('is-open');

      // Close all other cards
      cards.forEach(function(otherCard) {
        if (otherCard !== card) {
          otherCard.classList.remove('is-open');
          var otherHeader = otherCard.querySelector('.client-card__header');
          if (otherHeader) {
            otherHeader.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Toggle current card
      card.classList.toggle('is-open');
      header.setAttribute('aria-expanded', !isOpen);
    });
  });
}

// ========================================
// HERO SLIDESHOW
// ========================================

/**
 * Initialize the hero image slideshow
 */
function initHeroSlideshow() {
  var slideshow = document.querySelector('.hero__slideshow');
  if (!slideshow) return;

  var slides = slideshow.querySelectorAll('.hero__slide');
  if (slides.length <= 1) return;

  var nameEl = slideshow.querySelector('.hero__slideshow-name');
  var epitaphEl = slideshow.querySelector('.hero__slideshow-epitaph');
  var slideshowLink = slideshow.querySelector('.hero__slideshow-link');

  var currentIndex = 0;
  var intervalTime = 3000;
  var autoAdvance;

  function updateCaption(slide) {
    if (!nameEl || !epitaphEl) return;
    nameEl.textContent = slide.dataset.name || '';
    epitaphEl.textContent = slide.dataset.desc || slide.dataset.epitaph || '';
  }

  function updateLink(slide) {
    if (!slideshowLink) return;
    var link = slide.dataset.link || '#';
    slideshowLink.href = link;
    if (link.startsWith('http')) {
      slideshowLink.target = '_blank';
      slideshowLink.rel = 'noopener noreferrer';
    } else {
      slideshowLink.target = '';
      slideshowLink.rel = '';
    }
  }

  function showSlide(index) {
    slides[currentIndex].classList.remove('active');
    currentIndex = index;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    slides[currentIndex].classList.add('active');
    updateCaption(slides[currentIndex]);
    updateLink(slides[currentIndex]);
  }

  function showNextSlide() {
    showSlide(currentIndex + 1);
  }

  function showPrevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoAdvance() {
    autoAdvance = setInterval(showNextSlide, intervalTime);
  }

  function resetAutoAdvance() {
    clearInterval(autoAdvance);
    startAutoAdvance();
  }

  // Initialize
  updateCaption(slides[0]);
  updateLink(slides[0]);
  startAutoAdvance();

  // Swipe support
  var touchStartX = 0;
  var swipeThreshold = 50;

  slideshow.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slideshow.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        showNextSlide();
      } else {
        showPrevSlide();
      }
      resetAutoAdvance();
    }
  }, { passive: true });
}

// ========================================
// CONTACT FORM
// ========================================

/**
 * Initialize the contact form
 */
function initContactForm() {
  var contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var form = this;
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      if (response.ok) {
        form.innerHTML = '<div class="form-success"><p>Message sent.</p></div>';
      } else {
        throw new Error('Failed');
      }
    })
    .catch(function() {
      submitBtn.textContent = 'Error - try again';
      submitBtn.disabled = false;
      setTimeout(function() {
        submitBtn.textContent = originalText;
      }, 3000);
    });
  });
}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initHeaderScroll();
  initMobileNav();
  initScrollAnimations();
  initClientCards();
  initHeroSlideshow();
  initContactForm();
});
