//get all elements from the html
var elements = document.getElementsByTagName('*');
// loop through the html tags
for (var i = 0; i < elements.length; i++) {
  var element = elements[i];
  // loop inside the tags for child nodes
  for (var j = 0; j < element.childNodes.length; j++) {
    var node = element.childNodes[j];
    // if the element is text get its value and replace the text with something else.
    if (node.nodeType === 3) {
      var text = node.nodeValue;
      // Search for the words to be replaced
      var s = text.search(/\bhe\b/gi);
      // If the text doesn't contain the words, skip it
      if(s!=-1){
        if(element!=null){
          // Replace HTML in order to create a new "span" for each replacement
          element.innerHTML = element.innerHTML.replace(/\bhe\b/gi, '<span class="replacement"> she </span>');
        }
      }
    }
  }
}
