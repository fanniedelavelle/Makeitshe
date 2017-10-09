// Male words
var m_words = ["he", "He", "his", "His", "father", "Father", "Brother", "brother", "Uncle", "Aunt", "Male", "male", "Mr", "Mister", "Sir", "actor", "Actor", "boy", "Boy", "congressman", "Congressman"];
var m_percent;
var m_count = 0;
// Female words
var f_words = ["she", "She", "her", "Her", "mother", "Mother", "Sister", "brother", "Aunt", "aunt", "Female", "female", "Ms", "Madam", "Madam", "Actress", "Actress", "girl", "Girl", "Congresswoman", "Congresswoman"];
var f_percent;
var f_count = 0;

// Get all elements from the html
var elements = document.getElementsByTagName('*');

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
      for (var k = 0; k < f_words.length; k++) {
        // Search for the m¡f_word
        var m = f_words[k];
        var s = new RegExp("\\b" + m + "\\b");
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
      for (var k = 0; k < m_words.length; k++) {
        // Search for the m_word
        var m = m_words[k];
        var s = new RegExp("\\b" + m + "\\b");
        // Get the position where the word is
        var s_pos = text.search(s);
        // If the text doesn't contain the words, skip it
        if (s_pos != -1) {
          if (element != null) {
            // Replace HTML in order to create a new "span" for each replacement
            // Replace the respective f_word
            s_replace = '<span class="replacement">' + f_words[k] + '</span>';
            element.innerHTML = element.innerHTML.replace(s, s_replace);
            m_count++;
          }
        }
      }
    }
  }
}
console.log("Done replacing");

// Calculate percentages
m_percent = Math.round(m_count / (m_count + f_count) * 100);
f_percent = Math.round(f_count / (m_count + f_count) * 100);


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
