/**
 * Created by chloe on 10/1/2017.
 */
var t0 = performance.now();
var json_map = window.name_dict;

var names_regex = new RegExp(Object.keys(json_map).join(" |")+'(\.|,|;|:)?',"g");

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

          var updated_text = replaceAll(text, json_map, names_regex);
            if(element!=null && updated_text != false){
                element.innerHTML = updated_text;
            }
        }
      }
    }
};

swapNames();
var t1 = performance.now();
console.log("Call to swapNames took " + (t1 - t0) + " milliseconds.");
