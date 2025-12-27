// Certificate Page Logic

(function() {
  var CLAIM_DATA_KEY = 'explicit-claim-data';
  var CLAIMED_KEY = 'explicit-claimed';
  var ticketDownloaded = false;

  // Get claim data
  function getClaimData() {
    var stored = localStorage.getItem(CLAIM_DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Format date
  function formatDate(isoString) {
    var date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Initialize page
  function init() {
    var data = getClaimData();

    // Redirect if no claim data
    if (!data) {
      window.location.href = '/claim.html';
      return;
    }

    // Populate term sheet
    document.getElementById('investorName').textContent = data.name;
    document.getElementById('investorHandle').textContent = '@' + data.handle;
    document.getElementById('claimDate').textContent = formatDate(data.claimedAt);
    document.getElementById('eggsFound').textContent = data.eggsFound + '/5';

    // Populate golden ticket text
    document.getElementById('ticketText').textContent = data.name + ' (@' + data.handle + ')';

    // Setup button handlers
    document.getElementById('shareBtn').addEventListener('click', openShareModal);
    document.getElementById('downloadBtn').addEventListener('click', function() {
      downloadTicket(this);
    });
    document.getElementById('modalDownloadBtn').addEventListener('click', function() {
      downloadTicket(this, true);
    });
    document.getElementById('modalShareBtn').addEventListener('click', shareToX);
    document.getElementById('closeShareModal').addEventListener('click', closeShareModal);
    document.getElementById('emailLink').addEventListener('click', openEmailModal);
    document.getElementById('closeModal').addEventListener('click', closeEmailModal);
    document.getElementById('submitEmail').addEventListener('click', submitEmail);

    // Close modals on outside click
    document.getElementById('emailModal').addEventListener('click', function(e) {
      if (e.target === this) closeEmailModal();
    });
    document.getElementById('shareModal').addEventListener('click', function(e) {
      if (e.target === this) closeShareModal();
    });

    // Close modals on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeEmailModal();
        closeShareModal();
      }
    });
  }

  // Open share modal
  function openShareModal() {
    document.getElementById('shareModal').classList.add('active');
  }

  // Close share modal
  function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
  }

  // Share to X
  function shareToX() {
    var data = getClaimData();

    // Pre-filled tweet text
    var tweetText = "I'm in.\n\nEarly Believer @explicit_studio\n\nexplicit.studio";

    var tweetUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText);
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  }

  // Download golden ticket as image
  function downloadTicket(btn, isModal) {
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '[GENERATING...]';

    var ticketElement = document.getElementById('goldenTicket');

    // Temporarily make visible for capture
    ticketElement.style.left = '0';
    ticketElement.style.position = 'fixed';
    ticketElement.style.zIndex = '-1';

    html2canvas(ticketElement, {
      width: 1080,
      height: 1080,
      scale: 1,
      useCORS: true,
      backgroundColor: null
    }).then(function(canvas) {
      // Reset position
      ticketElement.style.left = '-9999px';
      ticketElement.style.position = 'absolute';
      ticketElement.style.zIndex = '';

      // Create download link
      var link = document.createElement('a');
      link.download = 'explicit-golden-ticket.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Reset button
      btn.disabled = false;
      btn.textContent = originalText;

      // If in modal, mark step 1 as complete
      if (isModal) {
        ticketDownloaded = true;
        document.getElementById('shareStep1').classList.add('completed');
      }
    }).catch(function(err) {
      console.error('Failed to generate ticket:', err);
      alert('Failed to generate ticket. Please try again.');
      btn.disabled = false;
      btn.textContent = originalText;
    });
  }

  // Email modal functions
  function openEmailModal(e) {
    e.preventDefault();
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

    // Store email with claim data
    var data = getClaimData();
    data.email = email;
    localStorage.setItem(CLAIM_DATA_KEY, JSON.stringify(data));

    alert("Got it! We'll be in touch.");
    closeEmailModal();
  }

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
