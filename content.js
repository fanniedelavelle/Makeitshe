// Male words
var m_words = ["he", "He", "his", "His", "father", "Father", "Brother", "brother", "Uncle", "Aunt","Male", "male","Mr", "Mister", "Sir", "actor", "Actor", "boy", "Boy", "congressman", "Congressman"];
// Female words
var f_words = ["she", "She", "her", "Her", "mother","Mother","Sister", "brother","Aunt", "aunt", "Female", "female","Ms.", "Madam", "Madam", "Actress", "Actress", "girl", "Girl", "Congresswoman", "Congresswoman"];


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
      for(var k = 0; k < m_words.length; k++){

        // Search for the m_word
        var m = m_words[k];
        var s = new RegExp("\\b"+m+"\\b");
        // Get the position where the word is
        var s_pos = text.search(s);

        // If the text doesn't contain the words, skip it
        if(s_pos!=-1){
          if(element!=null){
            // Replace HTML in order to create a new "span" for each replacement
            // Replace the respective f_word
            s_replace = '<span class="replacement tooltip">' + f_words[k] + '</span>';
            element.innerHTML = element.innerHTML.replace(s, s_replace);
          }
        }
      }
    }
  }
}
console.log("Done replacing");
