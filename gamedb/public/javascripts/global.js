document.addEventListener("DOMContentLoaded", function(event) { 
    
    document.getElementsByClassName("dropdown-toggle")[0].addEventListener("click", function(event) {
        var friendsDiv = document.getElementsByClassName("friends")[0],
            wrapper = document.getElementsByClassName("wrapper")[0],
            display;
        
        //IE only
        if (friendsDiv.currentStyle) {
            display = friendsDiv.currentStyle.display;
            
        //Other browsers
        } else {
            display = window.getComputedStyle(friendsDiv, null).getPropertyValue('display');
        }
        
        if(display === "none") {
            friendsDiv.style.display = "block";
            wrapper.style.width = "85%";
        } else {
            friendsDiv.style.display = "none";
            wrapper.style.width = "100%";
        }
    });
    
});