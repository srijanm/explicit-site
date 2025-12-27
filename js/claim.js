// Claim Page Logic

(function() {
  var STORAGE_KEY = 'explicit-eggs';
  var CLAIMED_KEY = 'explicit-claimed';
  var CLAIM_DATA_KEY = 'explicit-claim-data';
  var MIN_EGGS = 3;

  // Get found eggs
  function getFoundEggs() {
    var stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Check if already claimed
  function hasClaimed() {
    return localStorage.getItem(CLAIMED_KEY) === 'true';
  }

  // Initialize page
  function init() {
    var eggs = getFoundEggs();

    // Update egg count display
    document.getElementById('eggCount').textContent = eggs.length;

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

    // Setup form submission
    document.getElementById('claimForm').addEventListener('submit', handleSubmit);
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    var name = document.getElementById('name').value.trim();
    var handle = document.getElementById('handle').value.trim().replace('@', '');
    var eggs = getFoundEggs();

    if (!name || !handle) {
      alert('Please fill in all fields.');
      return;
    }

    // Disable button
    var btn = document.querySelector('.claim-btn');
    btn.disabled = true;
    btn.textContent = '[CLAIMING...]';

    // Store claim data
    var claimData = {
      name: name,
      handle: handle,
      eggsFound: eggs.length,
      eggs: eggs,
      claimedAt: new Date().toISOString()
    };

    localStorage.setItem(CLAIM_DATA_KEY, JSON.stringify(claimData));
    localStorage.setItem(CLAIMED_KEY, 'true');

    // Redirect to certificate
    setTimeout(function() {
      window.location.href = '/certificate.html';
    }, 500);
  }

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
