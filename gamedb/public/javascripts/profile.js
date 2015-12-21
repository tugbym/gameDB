document.addEventListener("DOMContentLoaded", function(event) {
    
    var editSubmit = document.getElementById('edit-submit');
    
    document.getElementById('edit-toggle').addEventListener('click', function(event) {
        toggleDisabled();
    });
    
    document.getElementById('show-extras').addEventListener('click', function(event) {
        var editDivs = document.getElementsByClassName('edit'),
            editToggle = document.getElementById('edit-toggle');
        for(var j = 0; j<editDivs.length; j++) {
            if(editDivs[j].style.display === "table-row") {
                editDivs[j].style.display = "none";
                event.target.innerHTML = "Show Statistics";
                editToggle.style.display = "none";
                toggleDisabled();
                editSubmit.style.display = "none";
            } else {
                editDivs[j].style.display = "table-row";
                event.target.innerHTML = "Hide Statistics";
                editToggle.style.display = "block";
            }
        }
    });
    
    function toggleDisabled() {
        var editInputs = document.getElementsByClassName('editable-item');
        for(var i = 0; i<editInputs.length; i++) {
            if(editInputs[i].disabled) {
                editInputs[i].disabled = false;
                editSubmit.style.display = "table-row";
            } else {
                editInputs[i].disabled = true;
                editSubmit.style.display = "none";
            }
        }
    }
    
});