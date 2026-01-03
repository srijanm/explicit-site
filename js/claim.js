// Claim Page Logic with Formspree Integration

(function() {
  const STORAGE_KEY = 'explicit-eggs';
  const CLAIMED_KEY = 'explicit-claimed';
  const CLAIM_DATA_KEY = 'explicit-claim-data';
  const MIN_EGGS = 3;

  // Get found eggs from localStorage
  function getFoundEggs() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Check if already claimed
  function hasClaimed() {
    return localStorage.getItem(CLAIMED_KEY) === 'true';
  }

  // Populate hidden fields with egg data
  function populateHiddenFields() {
    const eggs = getFoundEggs();

    document.getElementById('eggsFound').value = eggs.length;
    document.getElementById('eggsArray').value = eggs.join(', ');
    document.getElementById('claimedAt').value = new Date().toISOString();
  }

  // Initialize page
  function init() {
    const eggs = getFoundEggs();

    // Update egg count display
    const eggCountEl = document.getElementById('eggCount');
    if (eggCountEl) {
      eggCountEl.textContent = eggs.length;
    }

    // Redirect if not enough eggs
    if (eggs.length < MIN_EGGS) {
      alert('You need to find at least 3 eggs to claim.');
      window.location.href = '/';
      return;
    }

    // Redirect if already claimed
    if (hasClaimed()) {
      window.location.href = '/certificate.html';
      return;
    }

    // Populate hidden fields
    populateHiddenFields();

    // Setup form submission
    document.getElementById('claimForm').addEventListener('submit', handleSubmit);
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const name = document.getElementById('name').value.trim();
    const handle = document.getElementById('handle').value.trim().replace('@', '');
    const email = document.getElementById('email').value.trim();
    const eggs = getFoundEggs();

    // Validation
    if (!name || !handle || !email) {
      alert('Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      alert('Please enter a valid email.');
      return;
    }

    // Disable button
    const btn = document.querySelector('.claim-btn');
    btn.disabled = true;
    btn.textContent = '[CLAIMING...]';

    // Prepare form data for Formspree
    const formData = new FormData(form);

    // Update handle field to remove @ if user typed it
    formData.set('handle', handle);

    // Submit to Formspree
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(function(response) {
      if (response.ok) {
        // Save to localStorage for certificate page
        const claimData = {
          name: name,
          handle: handle,
          email: email,
          eggsFound: eggs.length,
          eggs: eggs,
          claimedAt: new Date().toISOString()
        };

        localStorage.setItem(CLAIM_DATA_KEY, JSON.stringify(claimData));
        localStorage.setItem(CLAIMED_KEY, 'true');

        // Redirect to certificate
        window.location.href = '/certificate.html';
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(function(error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
      btn.disabled = false;
      btn.textContent = '[CLAIM YOUR SPOT]';
    });
  }

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
