// Certificate Page Logic (Simplified)

(function() {
  var CLAIM_DATA_KEY = 'explicit-claim-data';

  function getClaimData() {
    var stored = localStorage.getItem(CLAIM_DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  function formatDate(isoString) {
    var date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function init() {
    var data = getClaimData();

    if (!data) {
      window.location.href = '/claim.html';
      return;
    }

    // Populate term sheet
    document.getElementById('investorName').textContent = data.name;
    document.getElementById('investorHandle').textContent = '@' + data.handle;
    document.getElementById('claimDate').textContent = formatDate(data.claimedAt);
    document.getElementById('eggsFound').textContent = data.eggsFound + '/5';

    // Email modal handlers
    document.getElementById('emailBtn').addEventListener('click', openEmailModal);
    document.getElementById('closeModal').addEventListener('click', closeEmailModal);
    document.getElementById('submitEmail').addEventListener('click', submitEmail);

    document.getElementById('emailModal').addEventListener('click', function(e) {
      if (e.target === this) closeEmailModal();
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeEmailModal();
      }
    });
  }

  function openEmailModal() {
    document.getElementById('emailModal').classList.add('active');
  }

  function closeEmailModal() {
    document.getElementById('emailModal').classList.remove('active');
  }

  function submitEmail() {
    var email = document.getElementById('emailInput').value.trim();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email.');
      return;
    }

    var data = getClaimData();
    data.email = email;
    localStorage.setItem(CLAIM_DATA_KEY, JSON.stringify(data));

    alert("Got it! We'll be in touch.");
    closeEmailModal();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
