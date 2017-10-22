// For timing performance
var t0 = performance.now();


// Male words stats variables
var m_percent;
var m_count = 0;
// Female words stats variables
var f_percent;
var f_count = 0;

// Json with names
var names = window.name_dict;
// MALE
var ignore_names = ['San Diego', 'San Francisco', 'New York', 'Hillary Clinton'];
var ignore_regex = new RegExp(ignore_names.join("|"), "g");
var names_regex = new RegExp(Object.keys(names).join(" |") + '(\.|,|;|:)?', "g");
// FEMALE
var f_ignore_names = [];
var f_ignore_regex = new RegExp(ignore_names.join("|"), "g");
var f_names_regex = new RegExp(Object.values(names).join(" |") + '(\.|,|;|:)?', "g");


// Json with words
var words = window.word_dict;
// MALE
var words_regex = new RegExp("\\b" + Object.keys(words).join("\\b|\\b"), "gi");
// FEMALE
var f_words_regex = new RegExp("\\b" + Object.values(words).join("\\b|\\b"), "gi");



// Get all elements from the html
var elements = document.getElementsByTagName('*');

// Count all female words
var countFemale = function(regex) {
  // loop through the html tags
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    // loop inside the tags for child nodes
    for (var j = 0; j < element.childNodes.length; j++) {
      var node = element.childNodes[j];
      // if the element is text get its value and replace the text with something else.
      if (node.nodeType === 3) {
        var text = node.nodeValue;
        if (!ignore_regex.test(text)) {
          new_string = text.replace(regex, function(matched) {
            // Just count! don't replace
            f_count++;
          });
        }
      }
    };
  }
}

// Replace function
function replaceAll(str, mapObj, regex) {
  var mod = false;
  if (!ignore_regex.test(str)) {
    new_string = str.replace(regex, function(matched) {
      m_count++;
      var replacement = mapObj[matched.trim()];
      // If it can't find it it's in uppercase:
      if (replacement == null) {
        // match to lower case word
        replacement = mapObj[matched.toLowerCase().trim()];
        // replace with upper case word
        replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      mod = true;
      if (element.nodeName == "TITLE") {
        // If male word is in title, don't format it
        document.title = document.title.replace(matched, replacement + " ");
        return replacement + " ";
      } else if (element.nodeName == "TEXTAREA") {
        // If in a text area, such as a tweet, don't replace!
        return matched;
      } else {
        // Any other type of text, OK to replace and format
        return '<span class="replacement">' + replacement + ' </span>';
      }
    });
  }
  if (mod) {
    return new_string;
  } else {
    return false;
  }
}

var element;
// Find function
var findAll = function(mapObj, regex) {
  // loop through the html tags
  for (var i = 0; i < elements.length; i++) {
    element = elements[i];
    // loop inside the tags for child nodes
    for (var j = 0; j < element.childNodes.length; j++) {
      var node = element.childNodes[j];
      // if the element is text get its value and replace the text with something else.
      if (node.nodeType === 3) {
        var text = node.nodeValue;
        var updated_text = replaceAll(text, mapObj, regex);
        if (element != null && updated_text != false) {
          element.innerHTML = updated_text;
        }
      }
    }
  }
};


countFemale(f_names_regex);
countFemale(f_words_regex);
findAll(names, names_regex);
findAll(words, words_regex);

// Calculate percentages
m_percent = Math.round(m_count / (m_count + f_count) * 100);
f_percent = Math.round(f_count / (m_count + f_count) * 100);

var t1 = performance.now();
console.log("Finding and replacing all values took " + (t1 - t0) + " milliseconds.");
console.log("Found " + m_count + " male values and " + f_count + " female values.");


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
    // through the specified callback */
    response(stats);
  }
});
