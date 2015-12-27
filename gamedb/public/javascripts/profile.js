document.addEventListener("DOMContentLoaded", function(event) {
    
    var gameInfos = document.getElementsByClassName('show-extras');
    
    for(var i = 0; i<gameInfos.length; i++) {
        
        var stars = document.getElementById('star-rating-' + i).value,
            stars2 = stars + 1;
        
        showAndHideStars(stars, stars2, i);
        
        document.getElementsByClassName('edit-toggle-' + i)[0].addEventListener('click', function(event) {
            var currentIter = event.target.className,
                pos = currentIter.split("edit-toggle-").pop(),
                editSubmit = document.getElementsByClassName('edit-submit-' + pos)[0],
                editInput = document.getElementsByClassName('editable-item-' + pos)[0];
            toggleDisabled(pos, editSubmit, false);
            if(editInput.disabled) {
                removeStars(pos);
            } else {
                iterateStars(pos);
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
    
    function iterateStars(pos) {
        var stars = document.getElementsByClassName('star-' + pos),
            starList = document.getElementById('star-list-' + pos);
        
        starList.addEventListener('mouseleave', revertStars);
        
        for(var h = 0; h<stars.length; h++) {
            stars[h].addEventListener('mouseover', addMouseOver);
            stars[h].addEventListener('click', addClick);
        }
    }
    
    function removeStars(pos) {
        var stars = document.getElementsByClassName('star-' + pos),
            starList = document.getElementById('star-list-' + pos);
        
        starList.addEventListener('mouseleave', revertStars);
        
        for(var g = 0; g<stars.length; g++) {
            stars[g].removeEventListener('mouseover', addMouseOver);
            stars[g].removeEventListener('click', addClick);
        }
        
    }
    
    function addMouseOver(event) {
        var currentIter = event.target.className,
            iterAndRatingArray = currentIter.split('glyphicon-star-').pop().split('-'),
            pos = iterAndRatingArray[0],
            iter = iterAndRatingArray[1],
            iter2 = parseInt(iter, 10) + 1;
        showAndHideStars(iter, iter2, pos);
    }
    
    function addClick(event) {
        var currentIter = event.target.className,
            iterAndRatingArray = currentIter.split('glyphicon-star-').pop().split('-'),
            iter = iterAndRatingArray[0],
            rating = parseInt(iterAndRatingArray[1], 10),
            starRating = document.getElementById('star-rating-' + iter);
        starRating.value = rating;
    }
    
    function revertStars(event) {
        var pos = event.target.id.split('star-list-').pop(),
            starRating = document.getElementById('star-rating-' + pos);
        if(starRating.value) {
            var iter = parseInt(starRating.value, 10),
                iter2 = iter + 1;
            showAndHideStars(iter, iter2, pos);
        }
    }
    
    function showAndHideStars(iter, iter2, pos) {
        for(iter; 0<iter; iter--) {
            var starsToShine = document.getElementsByClassName('glyphicon-star-' + pos + '-' + iter);
            starsToShine[0].className = 'glyphicon glyphicon-star star-' + pos + ' glyphicon-star-' + pos + '-' + iter;
        }
        for(iter2; 6>iter2; iter2++) {
            var starsToNotShine = document.getElementsByClassName('glyphicon-star-' + pos + '-' + iter2);
            starsToNotShine[0].className = 'glyphicon glyphicon-star-empty star-' + pos + ' glyphicon-star-' + pos + '-' + iter2;
        }
    }
    
});