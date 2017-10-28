var btnsrc = '<div id="make_it_she_wrap" class="ignore-css"><input type="button" id="make_it_she" value="Make it She" class="ignore-css"/></div>';

document.body.insertAdjacentHTML('beforeEnd', btnsrc);

document.getElementById('make_it_she').addEventListener("click", function(){  

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
    var names = window.name_dict;
    var f_names_regex = new RegExp(Object.values(names).join(" |") + '(\.|,|;|:)?', "g");


    // Json with words
    var words = window.word_dict;
    // MALE
    var words_regex = new RegExp("\\b" + Object.keys(words).join("\\b|\\b"), "gi");
    // FEMALE
    var f_words_regex = new RegExp("\\b" + Object.values(words).join("\\b|\\b"), "gi");
    var ignore_scripts = ['SCRIPT', '#comment', 'HEAD', 'CODE', 'LINK', 'META', 'IMG', 'BR'];



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
        }
      }
    };

    // Replace function
    function replaceAll(str, mapObj, regex) {
      var mod = false;
      if (!ignore_regex.test(str)) {
        new_string = str.replace(regex, function(matched) {
          m_count++;
          var replacement = mapObj[matched.trim()];
          // If it can't find it it's in uppercase:
          if (replacement == null || replacement == undefined) {
            // match to lower case word
            replacement = mapObj[matched.toLowerCase().trim()];
            // replace with upper case word
            replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
          }

          if (element.nodeName == "TITLE") {
            // If male word is in title, don't format it
            document.title = document.title.replace(matched, replacement + " ");
            mod = true;
            return replacement + " ";
          } else if (element.nodeName == "TEXTAREA") {
            // If in a text area, such as a tweet, don't replace!
            mod = true;
            return matched;
          } else {
            // Any other type of text, OK to replace and format
            mod = true;
             return '<span class="ignore-css replacement">' + replacement + '<span class="ignore-css tooltiptext">'+ matched.trim() + '</span>' + '</span> ';
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
          if (ignore_scripts.indexOf(node.nodeName) == -1){
              if (node.nodeType === 3) {
                var text = node.nodeValue;
                var updated_text = replaceAll(text, mapObj, regex);
                if (element != null && updated_text != false) {
                  element.innerHTML = element.innerHTML.replace(text, updated_text+" ");
                  // element.innerHTML = updated_text;
                }
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
          female: f_percent
        };

        // Directly respond to the sender (popup),
        // through the specified callback */
        response(stats);
      }
    });

    if(typeof observer == 'undefined') {
        // create an observer instance, to update dynamically added content
        observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                try {
                    if (mutation.addedNodes.length >= 1) {
                        var target = mutation.target;


                        Object.keys(mutation.addedNodes).map(function (objectKey, index) {
                            if (ignore_scripts.indexOf(mutation.addedNodes[index].nodeName)) {
                                if (mutation.addedNodes[index].nodeType == 3) {
                                    var childText = mutation.addedNodes[index].nodeValue;
                                    var updated_node_text = replaceAll(element, childText, names, names_regex);
                                    var element = mutation.addedNodes[index];
                                    if (updated_node_text != false) {
                                        updated_node_text_words = replaceAll(element, updated_node_text, words, words_regex);
                                    } else {
                                        updated_node_text_words = replaceAll(element, childText, words, words_regex);
                                    }
                                    if (updated_node_text_words != false) {
                                        mutation.addedNodes[index].innerHTML = updated_node_text_words;
                                    } else if (updated_node_text != false) {
                                        mutation.addedNodes[index].innerHTML = updated_node_text;
                                    }
                                    return;
                                }
                                var elements = mutation.addedNodes[index].getElementsByTagName('*');
                                // loop inside the tags for child nodes
                                for (var i = 0; i < elements.length; i++) {
                                    var element = elements[i];
                                    for (var j = 0; j < element.childNodes.length; j++) {
                                        var childNode = element.childNodes[j];
                                        // if the element is text get its value and replace the text with something else.
                                        if (childNode.nodeType === 3) {
                                            var childText = childNode.nodeValue;
                                            var updated_node_text = replaceAll(element, childText, names, names_regex);
                                            if (updated_node_text != false) {
                                                updated_node_text_words = replaceAll(element, updated_node_text, words, words_regex);
                                            } else {
                                                updated_node_text_words = replaceAll(element, childText, words, words_regex);
                                            }
                                            if (updated_node_text_words != false) {
                                                element.innerHTML = updated_node_text_words;
                                            } else if (updated_node_text != false) {
                                                element.innerHTML = updated_node_text;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                } catch (err) {
                    console.log(err);
                    return;
                }
            });
        });
    }

    var targets = document.getElementsByTagName('body')[0];
    var config = { attributes: false, childList: true, characterData: true, subtree: true, characterDataOldValue:true };
    // pass in the target node, as well as the observer options
    observer.observe(targets, config);
});
