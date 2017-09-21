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
            var he = /(\she\s)/gi;
            for (var h = 0; h < text.length; h++){
                var replacedText = text.replace(he,  " SHE ");
                //var new_html = "<span><strong>" + replacedText + "</strong></span>";
            }
            if (replacedText !== text) {
                element.replaceChild(document.createTextNode(replacedText), node);
            }
        }
    }
}