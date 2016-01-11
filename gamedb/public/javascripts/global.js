document.addEventListener("DOMContentLoaded", function(event) {
    
    if(document.getElementsByClassName("dropdown-toggle")[0]) {
        
        document.getElementsByClassName("dropdown-toggle")[0].addEventListener("click", function(event) {
            var friendsDiv = document.getElementsByClassName("friends")[0],
                wrapper = document.getElementsByClassName("wrapper")[0],
                header = document.getElementsByClassName("header")[0],
                dropdownButton = document.getElementsByClassName("fa")[0],
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
                    wrapper.style.width = "75%";
                    header.style.width = "75%";
                    friendsDiv.style.width = "25%";
                } else {
                    wrapper.style.width = "85%";
                    header.style.width = "85%";
                    friendsDiv.style.width = "15%";
                }
                dropdownButton.className = "fa fa-angle-double-left";
            } else {
                friendsDiv.style.display = "none";
                friendsDiv.style.width = "100%";
                wrapper.style.width = "100%";
                header.style.width = "100%";
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
});