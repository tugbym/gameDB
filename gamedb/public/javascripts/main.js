document.addEventListener("DOMContentLoaded", function(event) { 
    
    document.getElementsByClassName("arrow")[0].addEventListener("click", function() {
        var ypos = document.getElementsByClassName("information")[0].getBoundingClientRect().top + document.documentElement.scrollTop + document.body.scrollTop;
        window.scroll(0, ypos);
    });
    
});