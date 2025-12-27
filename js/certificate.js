// Certificate Page Logic (Simplified - No Email Modal)

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
  }

  document.addEventListener('DOMContentLoaded', init);
})();
