document.addEventListener("DOMContentLoaded", function(event) {
    
    var gameInfos = document.getElementsByClassName('show-extras');
    
    for(var i = 0; i<gameInfos.length; i++) {
        
        document.getElementsByClassName('edit-toggle-' + i)[0].addEventListener('click', function(event) {
            var currentIter = event.target.className,
                pos = currentIter.split("edit-toggle-").pop(),
                editSubmit = document.getElementsByClassName('edit-submit-' + pos)[0],
                editInput = document.getElementsByClassName('editable-item-' + pos)[0];
            toggleDisabled(pos, editSubmit, false);

            if(editInput.disabled) {
                removeStars();
            } else {
                iterateStars();
            }
        });
        
        gameInfos[i].addEventListener('click', function(event) {
            var currentIter = event.target.className,
                pos = currentIter.split("show-extras-").pop(),
                editDivs = document.getElementsByClassName('edit-' + pos),
                editSubmit = document.getElementsByClassName('edit-submit-' + pos)[0],
                editToggle = document.getElementsByClassName('edit-toggle-' + pos)[0],
                stringToReplace;
            if(editToggle.className.includes('off')) {
                stringToReplace = editToggle.className.replace(/edit-toggle-off/, 'edit-toggle-on');
                editToggle.className = stringToReplace;
            } else {
                stringToReplace = editToggle.className.replace(/edit-toggle-on/, 'edit-toggle-off');
                editToggle.className = stringToReplace;
            }
            if(editDivs[0].style.display === "table-row") {
                event.target.innerHTML = "Show Statistics";
                editSubmit.style.display = "none";
                divLoop(editDivs);
            } else {
                toggleDisabled(pos, editSubmit, true);
                event.target.innerHTML = "Hide Statistics";
                divLoop(editDivs);
            }
      });
    }
    
    function toggleDisabled(iter, editSubmit, alwaysDisable) {
        var editInputs = document.getElementsByClassName('editable-item-' + iter);
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
    
    function iterateStars() {
        var stars = document.getElementsByClassName('glyphicon-star-empty');
    
        for(var h = 0; h<stars.length; h++) {
            stars[h].addEventListener('mouseover', addMouseOver);
        }
    }
    
    function removeStars() {
        var stars = document.getElementsByClassName('star');
        
        for(var g = 0; g<stars.length; g++) {
            stars[g].removeEventListener('mouseover', addMouseOver);
        }
        
    }
    
    function addMouseOver(event) {
        var currentIter = event.target.className,
            iter = currentIter.split("star-").pop(),
            iter2 = parseInt(iter, 10) + 1,
            starsToShine,
            starsToNotShine;
        for(iter; 0<iter; iter--) {
            starsToShine = document.getElementsByClassName('star-' + iter);
            starsToShine[0].className = 'glyphicon glyphicon-star star star-' + iter;
        }
        for(iter2; 6>iter2; iter2++) {
            starsToNotShine = document.getElementsByClassName('star-' + iter2);
            starsToNotShine[0].className = 'glyphicon glyphicon-star-empty star star-' + iter2;
        }
    }
    
});