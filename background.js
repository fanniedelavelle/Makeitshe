chrome.runtime.onMessage.addListener(function(msg, sender) {
  // First, validate the message's structure
  if ((msg.from === 'content') && (msg.subject === 'updateStats')) {
    // Enable the page-action for the requesting tab
    chrome.pageAction.show(sender.tab.id);
  }
});

chrome.webRequest.onCompleted.addListener(function(e) {
  console.log('web request');
});

