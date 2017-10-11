/**
 * Created by chloe on 10/1/2017.
 */
var t0 = performance.now();
var json_map = window.name_dict;

var names_regex = new RegExp(Object.keys(json_map).join(" |")+'(\.|,|;|:)?',"g");

var exclude_tags = ['TITLE', "TEXTAREA", "NOSCRIPT", "META", "STYLE", "SCRIPT", "G-SECTION-WITH-HEADER", "IMG", "LINK"];

function replaceAll(str,mapObj,names_regex){
    var mod = false;
    new_string = str.replace(names_regex, function(matched){
        mod = true;
        var replace_by = mapObj[matched.trim()];
        return '<span class="replacement"> '+mapObj[matched.trim()]+ ' </span>';
    });
    if(mod){
        return new_string;
    } else {
        return mod;
    }
}

var swapNames = function(){
    var inputs = document.getElementsByTagName('*');
    var neededElements = [];

    for (var i = 0, length = inputs.length; i < length; i++) {
        // console.log(inputs[i].nodeName);
        if (exclude_tags.indexOf(inputs[i].nodeName) <= -1) {
             neededElements.push(inputs[i]);
        }
    }

    // loop through the html tags
    for (var j = 0; j < neededElements.length; j++) {
      var neededElement = neededElements[j];
      // loop inside the tags for child nodes
      for (var k = 0; k < neededElement.childNodes.length; k++) {
        var node = neededElement.childNodes[k];

        // if the element is text get its value and replace the text with something else.
        if (node.nodeType === 3) {
          var text = node.nodeValue;
            if (exclude_tags.indexOf(node.nodeName) <= -1) {
                var updated_text = replaceAll(text, json_map, names_regex);
                if(neededElement!=null && updated_text != false){
                    neededElement.innerHTML = updated_text;
                }
            }
        }
      }
    }
};

swapNames();
var t1 = performance.now();
console.log("Nameswapping took " + (t1 - t0) + " milliseconds.")