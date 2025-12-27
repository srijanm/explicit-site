// Easter Egg System for Explicit

(function() {
  const STORAGE_KEY = 'explicit-eggs';
  const TOTAL_EGGS = 5;
  const CLAIM_THRESHOLD = 3;

  // Get found eggs from storage
  function getFoundEggs() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Save found eggs to storage
  function saveFoundEggs(eggs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eggs));
  }

  // Update the counter display
  function updateCounter() {
    const eggs = getFoundEggs();
    const counter = document.getElementById('eggCounter');

    if (!counter) return;

    if (eggs.length > 0) {
      counter.textContent = `[found: ${eggs.length}/${TOTAL_EGGS}]`;
      counter.classList.add('visible');

      if (eggs.length >= CLAIM_THRESHOLD) {
        counter.classList.add('claimable');
        counter.onclick = function() {
          window.location.href = '/claim.html';
        };
      }
    }
  }

  // Show the easter egg popup
  function showEggPopup(message, isClaimable) {
    const eggs = getFoundEggs();
    const overlay = document.getElementById('eggPopup');
    if (!overlay) return;

    const header = overlay.querySelector('.egg-popup-header');
    const messageEl = overlay.querySelector('.egg-popup-message');
    const btnContainer = overlay.querySelector('.egg-popup-buttons');

    header.textContent = `> FOUND [${eggs.length}/${TOTAL_EGGS}]`;
    messageEl.innerHTML = message.replace(/\n/g, '<br>');

    // Show different buttons at claim threshold
    if (eggs.length >= CLAIM_THRESHOLD && isClaimable) {
      btnContainer.innerHTML = `
        <button class="egg-popup-btn primary" onclick="window.location.href='/claim.html'">CLAIM</button>
        <button class="egg-popup-btn" onclick="closeEggPopup()">KEEP HUNTING</button>
      `;
    } else {
      btnContainer.innerHTML = `
        <button class="egg-popup-btn" onclick="closeEggPopup()">CONTINUE</button>
      `;
    }

    overlay.classList.add('active');
  }

  // Close the popup
  window.closeEggPopup = function() {
    const popup = document.getElementById('eggPopup');
    if (popup) {
      popup.classList.remove('active');
    }
  };

  // Register a found egg
  window.registerEgg = function(eggId, message) {
    const eggs = getFoundEggs();

    // Check if already found
    if (eggs.includes(eggId)) {
      // Already found - show a different message
      showEggPopup("You already found this one.\nKeep looking.", false);
      return;
    }

    // Add new egg
    eggs.push(eggId);
    saveFoundEggs(eggs);

    // Update counter
    updateCounter();

    // Show popup (claimable if this brings them to threshold)
    const justReachedThreshold = eggs.length === CLAIM_THRESHOLD;
    showEggPopup(message, justReachedThreshold);
  };

  // Navigate to claim page
  window.goToClaim = function() {
    window.location.href = '/claim.html';
  };

  // Console easter egg - define found() globally
  console.log("%c> Hey, you're poking around.", "color: #00ff00; font-size: 14px;");
  console.log("%c> We like that.", "color: #00ff00; font-size: 14px;");
  console.log("%c> Type found() to claim this egg.", "color: #00ff00; font-size: 14px;");
  console.log("%c> If you're building something interesting: hello@explicit.studio", "color: #888; font-size: 12px;");

  window.found = function() {
    registerEgg('console', "You're poking around.\nWe like that.");
    console.log("%c> Egg claimed! Check the site.", "color: #00ff00; font-size: 14px;");
  };

  // Initialize on page load
  // Helper to add both click and touch handlers for mobile compatibility
  function addTapHandler(element, handler, useCapture) {
    if (!element) return;

    // Track to prevent double-firing
    let lastTap = 0;

    function wrappedHandler(e) {
      const now = Date.now();
      if (now - lastTap < 300) return; // Debounce
      lastTap = now;
      handler.call(this, e);
    }

    element.addEventListener('click', wrappedHandler, useCapture || false);
    // Add touchend for mobile devices that might not fire click properly
    element.addEventListener('touchend', function(e) {
      e.preventDefault();
      wrappedHandler.call(this, e);
    }, useCapture || false);
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Initialize counter
    updateCounter();

    // Gong click
    const gong = document.getElementById('eggGong');
    if (gong) {
      addTapHandler(gong, function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Play sound
        const audio = new Audio('/assets/sounds/gong.mp3');
        audio.volume = 0.5;
        audio.play().catch(function() {
          // Audio play failed (autoplay policy), still register the egg
        });

        // Animate
        this.style.animation = 'shake 0.5s ease';
        var self = this;
        setTimeout(function() { self.style.animation = ''; }, 500);

        // Register
        registerEgg('gong', "TBPN-iykyk");
      });
    }

    // Ship click
    const ship = document.getElementById('eggShip');
    if (ship) {
      addTapHandler(ship, function(e) {
        e.preventDefault();
        e.stopPropagation();
        registerEgg('ship', "Finally, someone who ships.\nRespect.");
      });
    }

    // Newton clicks (multiple in marquee and hero)
    document.querySelectorAll('.egg-newton').forEach(function(newton) {
      addTapHandler(newton, function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        registerEgg('taste', "Ah, you have taste.\n(Everyone says that now.)");
        return false;
      }, true); // Use capture phase to catch event before parent links
    });

    // Also prevent the parent marquee-link from navigating when Newton is clicked
    document.querySelectorAll('.marquee-link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (e.target.classList.contains('egg-newton')) {
          e.preventDefault();
        }
      });
    });

    // Close popup on overlay click/touch
    const eggPopup = document.getElementById('eggPopup');
    if (eggPopup) {
      function handlePopupClose(e) {
        if (e.target === eggPopup) {
          e.preventDefault();
          closeEggPopup();
        }
      }
      eggPopup.addEventListener('click', handlePopupClose);
      eggPopup.addEventListener('touchend', handlePopupClose);
    }

    // Close popup on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeEggPopup();
      }
    });
  });
})();
