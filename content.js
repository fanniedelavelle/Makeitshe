
// Male words stats variables
var m_percent;
var m_count = 0;
// Female words stats variables
var f_percent;
var f_count = 0;

// Json with words dictionary
var words = window.word_dict;
const walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
  { acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } },
  false
);

//takes a text node and replaces words
const replaceWords = textNode => {
  let text = textNode.textContent;
  let span = document.createElement('span');
  for (let entry of Object.entries(word_dict)) {
    const [male, female] = entry;
    const re = new RegExp("\\b" + male + "\\b", 'gi');
    text = text.replace(re, `
        <span class="replacement">
            <span class="tooltiptext">
               ${male}
            </span>
            ${female}
        </span>
    `);
  }
  span.innerHTML = text;
  return span;
}

const nodesToReplace = [];
while(walker.nextNode()) {
  const textNode = walker.currentNode;
  const span = replaceWords(textNode);
  nodesToReplace.push([span, textNode]);
};
nodesToReplace.forEach(([span, textNode]) =>
    textNode.parentElement.replaceChild(span, textNode)
);







/*

// Get all elements from the html
var elements = document.getElementsByTagName('*');

var countFemale = function() {

  // FEMALE WORD LOOP: count the female words before replacing the male words
  // loop through the html tags
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    // loop inside the tags for child nodes
    for (var j = 0; j < element.childNodes.length; j++) {
      var node = element.childNodes[j];
      // if the element is text get its value and replace the text with something else.
      if (node.nodeType === 3) {
        var text = node.nodeValue;
        // Search for the female words
        for (m_word in words) {
          var f_word = words[m_word];
          var s = new RegExp("\\b" + f_word + "\\b");
          // Get the position where the word is
          var s_pos = text.search(s);
          // If the text doesn't contain the words, skip it
          if (s_pos != -1) {
            if (element != null) {
              // Count it, don't replace!
              f_count++;
            }
          }
        }
      }
    }
  }
}

var swapMale = function() {
  // MALE WORD LOOP
  // loop through the html tags
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    // loop inside the tags for child nodes
    for (var j = 0; j < element.childNodes.length; j++) {
      var node = element.childNodes[j];

      // if the element is text get its value and replace the text with something else.
      if (node.nodeType === 3) {
        var text = node.nodeValue;
        // Search for the male words to be replaced
        for (m_word in words) {
          var f_word = words[m_word];
          var s = new RegExp("\\b" + m_word + "\\b");
          // Get the position where the word is
          var s_pos = text.search(s);
          // If the text doesn't contain the words, skip it
          if (s_pos != -1) {
            if (element != null) {
              // Replace HTML in order to create a new "span" for each replacement
              // Replace the respective f_word
              if (element.nodeName == "TITLE") {
                // If male word is in title, don't format it
                s_replace = f_word;
                document.title = document.title.replace(s, s_replace);
              } else if (element.nodeName == "TEXTAREA") {
                // If in a text area, such as a tweet, don't replace!
              } else {
                // Any other type of text, OK to replace and format
                s_replace = '<span class="replacement">' + f_word + '</span>';
                element.innerHTML = element.innerHTML.replace(s, s_replace);
              }
              m_count++;
            }
          }
        }
      }
    }
  }
}


// Count female words and swap male words
countFemale();
swapMale();

console.log("Done replacing");

// Calculate percentages
m_percent = Math.round(m_count / (m_count + f_count) * 100);
f_percent = Math.round(f_count / (m_count + f_count) * 100);*/
/*  

// MESSAGING
// In order to communicate between the content script and the popup

// Inform the background page that this tab should have a page-action
chrome.runtime.sendMessage({
  from: 'content',
  subject: 'updateStats'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  // First, validate the message's structure
  if ((msg.from === 'popup') && (msg.subject === 'stats')) {
    // Collect the necessary data
    var stats = {
      male: m_percent,
      female: f_percent,
    };

    // Directly respond to the sender (popup),
    // through the specified callback 
    response(stats);
  }
});*/
