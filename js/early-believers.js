// Early Believers Page Logic

(function() {
  // For MVP: Manually update this array as people claim
  // For production: Fetch from a backend API
  var believers = [
    // Example entries:
    // { rank: 1, name: "Srijan Mahajan", handle: "srijanm", eggs: 5 },
    // { rank: 2, name: "Jane Doe", handle: "janedoe", eggs: 3 },
  ];

  var TOTAL_SPOTS = 25;

  function init() {
    var grid = document.getElementById('believersGrid');
    var countEl = document.getElementById('claimedCount');

    // Update claimed count
    countEl.textContent = believers.length;

    // Build grid
    var html = '';

    // Add claimed believers
    believers.forEach(function(believer) {
      html += '<div class="believer-card">' +
        '<p class="believer-rank">#' + believer.rank + '</p>' +
        '<p class="believer-name">' + escapeHtml(believer.name) + '</p>' +
        '<p class="believer-handle">' +
          '<a href="https://x.com/' + escapeHtml(believer.handle) + '" target="_blank" rel="noopener">' +
            '@' + escapeHtml(believer.handle) +
          '</a>' +
        '</p>' +
        '<p class="believer-eggs">' + believer.eggs + '/5</p>' +
      '</div>';
    });

    // Add empty spots
    for (var i = believers.length + 1; i <= TOTAL_SPOTS; i++) {
      html += '<div class="believer-card empty">' +
        '<p class="believer-rank">#' + i + '</p>' +
        '<p class="believer-name">—</p>' +
        '<p class="believer-handle">unclaimed</p>' +
      '</div>';
    }

    grid.innerHTML = html;
  }

  // Helper to escape HTML
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
