document.addEventListener("DOMContentLoaded", function(event) { 
    
    var inputs = document.getElementsByClassName("input");
    
    for(var i = 0; i<inputs.length; i++) {
        inputs[i].addEventListener("change", function(event) {
            var sibling = event.target.nextSibling;
            if(event.target.validity.valid) {
                sibling.className = "glyphicon glyphicon-ok";
            } else {
                sibling.className = "glyphicon glyphicon-remove";
            }
        });
    }
});