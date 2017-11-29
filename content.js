var exist = document.getElementById('made_it_she');
names = window.name_dict;

// Function taken from https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page,
// to ensure looping only once through each element, hence avoiding infinite loop when inserting original name in span
var getElementsWithNoChildren = function(el, ignore_scripts) {
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_ELEMENT,{ acceptNode: function(node) {

    if(ignore_scripts.indexOf(node.nodeName) == -1){
      return NodeFilter.FILTER_ACCEPT;
    } else {
      return NodeFilter.FILTER_SKIP;
    }

  } },false);
  while(n=walk.nextNode()){
    for (var i = 0; i < n.childNodes.length; i++){
      console.log(n.childNodes[i]);
      if(typeof(n.childNodes[i]) != 'undefined'&& n.childNodes[i].nodeType == 3){
        a.push(n.childNodes[i]);
      }
    }
  }
  return a;
};

// Replace function
var replaceAll = function(element, str, mapObj, regex) {
  var mod = false;
  new_string = str.replace(regex, function(matched) {
    m_count++;
    var original_word = matched.trim();
    var original_word_lc = matched.toLowerCase().trim();
    var replacement = mapObj[original_word];
    // If it can't find it it's in uppercase:
    if (replacement == null || replacement == undefined) {
      // match to lower case word
      replacement = mapObj[original_word_lc];
      // replace with upper case word
      if (replacement == null || replacement == undefined) {
        replacement = mapObj[matched];
        if (replacement == null) {
          return false;
        }
      } else {
        replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
    }

    // Any other type of text, OK to replace and format
    mod = true;
    // this freezes the page:
    var returnHTML = '<span class="ignore-css replacement">' + replacement + '<span class="ignore-css tooltiptext">' + original_word + '</span>' + '</span>';
    return returnHTML;
    // WIP:
    // return '<span class="ignore-css replacement">' + replacement + '<span class="ignore-css tooltiptext">'+ original_word + '</span></span> ';

  });

  if (mod) {
    // Hacky way of avoiding infinite loop
    return new_string;
  } else {
    return false;
  }
};

if (exist === null) {
  var made_it_she = document.createElement('div');
  made_it_she.setAttribute('id', 'made_it_she');
  document.body.appendChild(made_it_she);

  // For timing performance
  var t0 = performance.now();

  // Male words stats variables
  var m_percent;
  var m_count = 0;
  // Female words stats variables
  var f_percent;
  var f_count = 0;

  // Json with names


  // MALE
  var ignore_names = ['San Diego', 'San Francisco', 'New York', 'Hillary Clinton'];
  var ignore_regex = new RegExp(ignore_names.join("|"), "g");
  //var names_regex = new RegExp(Object.keys(names).join("|") + '(\.|,|;|:)?', "g");
  var names_regex = new RegExp("\\b" + Object.keys(names).join("\\b|\\b"), "gi");
  console.log(names_regex);
  // FEMALE
  var f_ignore_names = [];
  var f_ignore_regex = new RegExp(ignore_names.join("|"), "g");
  // var f_names_regex = new RegExp(Object.values(names).join("|") + '(\.|,|;|:)?', "g");
  var f_names_regex = new RegExp("\\b" + Object.keys(names).join("\\b|\\b"), "gi");
  var ignore_scripts = ['SCRIPT', '#comment', 'BODY', 'HEAD', 'CODE', 'LINK', 'META', 'IMG', 'BR', 'clipPath', 'polygon', 'svg'];


  // Json with words
  var words = window.word_dict;
  // MALE
  var words_regex = new RegExp("\\b" + Object.keys(words).join("\\b|\\b"), "gi");
  // FEMALE
  var f_words_regex = new RegExp("\\b" + Object.values(words).join("\\b|\\b"), "gi");



  // Get all elements from the html
  var elements = getElementsWithNoChildren(document.body, ignore_scripts);

  // Count all female words
  var countFemale = function(regex, elements) {
    // loop through the elements parameter
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (element.nodeType === 3) {
        var text = element.nodeValue;
        if (!ignore_regex.test(text) && ignore_scripts.indexOf(element.nodeName) == -1) {
          new_string = text.replace(regex, function(matched) {
            // Just count! don't replace
            f_count++;
          });
        }
      }
    }
  };

  // Find function
  var findAll = function(mapObj, regex, elements) {
    // loop through the html tags
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      // loop inside the tags for child nodes

      var text = element.nodeValue;
      var updated_text = replaceAll(element, text, mapObj, regex);
      if (element.parentNode != null && updated_text != false) {
        // console.log(element.parentNode);
        // element.nodeValue = updated_text;
        var replacementNode = document.createElement('span');
        replacementNode.innerHTML = updated_text;
        element.parentNode.insertBefore(replacementNode, element);
        element.parentNode.removeChild(element);
      }
    }
  };


  countFemale(f_names_regex, elements);
  countFemale(f_words_regex, elements);

  // Switch words first
  findAll(words, words_regex, elements);
  // Then switch names
  findAll(names, names_regex, elements);


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

}
