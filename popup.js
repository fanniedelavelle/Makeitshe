// Update the relevant fields with the new data
function setStats(stats) {
  document.getElementById("malep").innerHTML = stats.male;
  document.getElementById("femalep").innerHTML = stats.female;
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function() {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
      tabs[0].id, {
        from: 'popup',
        subject: 'stats'
      },
      // ...also specifying a callback to be called
      //    from the receiving end (content script)
      setStats);
  });
});
