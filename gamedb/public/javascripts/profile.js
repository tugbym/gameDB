document.addEventListener("DOMContentLoaded", function(event) {
    
    var gameInfos = document.getElementsByClassName('show-extras');
    
    for(var i = 0; i<gameInfos.length; i++) {
        
        document.getElementsByClassName('edit-toggle-' + i)[0].addEventListener('click', function(event) {
            var currentIter = event.target.className,
                pos = currentIter.split("glyphicon glyphicon-pencil edit-toggle edit-toggle-"),
                editSubmit = document.getElementsByClassName('edit-submit-' + pos[1])[0];
            toggleDisabled(pos[1], editSubmit, false);
        });
        
        gameInfos[i].addEventListener('click', function(event) {
            var currentIter = event.target.className,
                pos = currentIter.split("button show-extras show-extras-"),
                editDivs = document.getElementsByClassName('edit-' + pos[1]),
                editToggle = document.getElementsByClassName('edit-toggle-' + pos[1])[0],
                editSubmit = document.getElementsByClassName('edit-submit-' + pos[1])[0];
            if(editDivs[0].style.display === "table-row") {
                editToggle.style.display = "none";
                event.target.innerHTML = "Show Statistics";
                editSubmit.style.display = "none";
                divLoop(editDivs);
            } else {
                toggleDisabled(pos[1], editSubmit, true);
                event.target.innerHTML = "Hide Statistics";
                editToggle.style.display = "block";
                divLoop(editDivs);
            }
      });
    }
    
    function toggleDisabled(iter, editSubmit, alwaysDisable) {
        var editInputs = document.getElementsByClassName('editable-item-' + iter);
        console.log(iter, editInputs, editSubmit);
        for(var k = 0; k<editInputs.length; k++) {
            if(editInputs[k].disabled && !alwaysDisable) {
                editInputs[k].disabled = false;
                editSubmit.style.display = "table-row";
            } else {
                editInputs[k].disabled = true;
                editSubmit.style.display = "none";
            }
        }
    }
    
    function divLoop(editDivs) {
        for(var j = 0; j<editDivs.length; j++) {
            if(editDivs[j].style.display === "table-row") {
                editDivs[j].style.display = "none";
            } else {
                editDivs[j].style.display = "table-row";
            }
        }
    }
    
});