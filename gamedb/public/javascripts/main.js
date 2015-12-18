document.addEventListener("DOMContentLoaded", function(event) { 
    document.getElementsByClassName("arrow")[0].addEventListener("click", function() {
        var ypos = document.getElementsByClassName("information")[0].getBoundingClientRect().top;
        window.scroll(0, ypos);
    });
});