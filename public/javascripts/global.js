document.addEventListener("DOMContentLoaded", function(event) {
    
    if(document.getElementsByClassName("dropdown-toggle")[0]) {
        
        document.getElementsByClassName("dropdown-toggle")[0].addEventListener("click", function(event) {
            var friendsDiv = document.getElementsByClassName("friends")[0],
                wrapper = document.getElementsByClassName("wrapper")[0],
                header = document.getElementsByClassName("header")[0],
                dropdownButton = document.getElementsByClassName("fa")[0],
                dropdownText = document.getElementsByClassName("friends-btn")[0],
                aElements = document.getElementsByTagName("a"),
                display;
            
            //IE only
            if(friendsDiv.currentStyle) {
                display = friendsDiv.currentStyle.display;
                
            //Other browsers
            } else {
                display = window.getComputedStyle(friendsDiv, null).getPropertyValue('display');
            }
            
            if(display === "none") {
                friendsDiv.style.display = "block";
                if(getWidth() <= 1200) {
                    adjustWidths("75%", wrapper);
                    adjustWidths("75%", header);
                    adjustWidths("25%", friendsDiv);
                    if(getWidth() <= 800) {
                        shrinkElements("0.8em", aElements, dropdownText);
                    }
                    if(getWidth() <= 600) {
                        shrinkElements("0.6em", aElements, dropdownText);
                    }
                } else {
                    adjustWidths("85%", wrapper);
                    adjustWidths("85%", header);
                    adjustWidths("15%", friendsDiv);
                }
                dropdownButton.className = "fa fa-angle-double-left";
            } else {
                
                switch(true) {
                    case getWidth() <= 600:
                        shrinkElements("0.7em", aElements, dropdownText);
                        break;
                    case getWidth() <= 900:
                        shrinkElements("1em", aElements, dropdownText);
                        break;
                    case getWidth() <= 1080:
                        shrinkElements("1.1em", aElements, dropdownText);
                        break;
                    default:
                        shrinkElements("18px", aElements, dropdownText);
                }
                
                friendsDiv.style.display = "none";
                adjustWidths("100%", wrapper);
                adjustWidths("100%", header);
                adjustWidths("100%", friendsDiv);
                dropdownButton.className = "fa fa-angle-double-down";
            }
        });
        
    }

    function getWidth() {
        if(self.innerHeight) {
            return self.innerWidth;
        }
        if(document.documentElement && document.documentElement.clientHeight) {
            return document.documentElement.clientWidth;
        }
        if(document.body) {
            return document.body.clientWidth;
        }
    }
    
    function shrinkElements(size, element1, element2) {
        for(var i = 1; i < 5; i++) {
            element1[i].style['font-size'] = size;
        }
        element2.style['font-size'] = size;
    }
    
    function adjustWidths(size, element) {
        element.style.width = size;
    }
    
});