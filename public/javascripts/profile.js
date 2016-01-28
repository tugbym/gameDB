document.addEventListener("DOMContentLoaded", function(event) {
    var gameInfos = document.getElementsByClassName('show-extras');
    
    for(var i = 0; i < gameInfos.length; i++) {
        
        var IDs = gameInfos[i].className.split('button show-extras show-extras-').pop().split('-'),
            stars = document.getElementById('star-rating-' + IDs[0] + '-' + IDs[1]).value,
            stars2 = stars + 1,
            edit_toggle = document.getElementsByClassName('edit-toggle-' + IDs[0] + '-' + IDs[1])[0];
        
        showAndHideStars(stars, stars2, IDs);
        
        if(edit_toggle) {
            edit_toggle.addEventListener('click', function(event) {
                var currentIter = event.target.className,
                    IDs = currentIter.split("edit-toggle-").pop().split('-'),
                    editSubmit = document.getElementsByClassName('edit-submit-' + IDs[0] + '-' + IDs[1])[0],
                    editInput = document.getElementsByClassName('editable-item-' + IDs[0] + '-' + IDs[1])[0];
                toggleDisabled(IDs, editSubmit, false);
                if(editInput.disabled) {
                    removeStars(IDs);
                } else {
                    iterateStars(IDs);
                }
            });
            
            gameInfos[i].addEventListener('click', function(event) {
                var currentIter = event.target.className,
                    IDs = currentIter.split("show-extras-").pop().split('-'),
                    editDivs = document.getElementsByClassName('edit-' + IDs[0] + '-' + IDs[1]),
                    editSubmit = document.getElementsByClassName('edit-submit-' + IDs[0] + '-' + IDs[1])[0],
                    editToggle = document.getElementsByClassName('edit-toggle-' + IDs[0] + '-' + IDs[1])[0],
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
                    toggleDisabled(IDs, editSubmit, true);
                    event.target.innerHTML = "Hide Statistics";
                    divLoop(editDivs);
                }
            });
            
        } else {
            gameInfos[i].addEventListener('click', function(event) {
                
                var currentIter = event.target.className,
                    IDs = currentIter.split("show-extras-").pop().split('-'),
                    editDivs = document.getElementsByClassName('edit-' + IDs[0] + '-' + IDs[1]),
                    editSubmit = document.getElementsByClassName('edit-submit-' + IDs[0] + '-' + IDs[1])[0];
                
                if(editDivs[0].style.display === "table-row") {
                    event.target.innerHTML = "Show Statistics";
                    divLoop(editDivs);
                } else {
                    toggleDisabled(IDs, editSubmit, true);
                    event.target.innerHTML = "Hide Statistics";
                    divLoop(editDivs);
                }
                
            });
        }
    }

    function toggleDisabled(iter, editSubmit, alwaysDisable) {
        var editInputs = document.getElementsByClassName('editable-item-' + iter[0] + '-' + iter[1]);
        for(var k = 0; k < editInputs.length; k++) {
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
        for(var j = 0; j < editDivs.length; j++) {
            if(editDivs[j].style.display === "table-row") {
                editDivs[j].style.display = "none";
            } else {
                editDivs[j].style.display = "table-row";
            }
        }
    }

    function iterateStars(pos) {
        var stars = document.getElementsByClassName('star-' + pos[0] + '-' + pos[1]),
            starList = document.getElementById('star-list-' + pos[0] + '-' + pos[1]);
        starList.addEventListener('mouseleave', revertStars);
        for(var h = 0; h < stars.length; h++) {
            stars[h].addEventListener('mouseover', addMouseOver);
            stars[h].addEventListener('click', addClick);
        }
    }

    function removeStars(pos) {
        var stars = document.getElementsByClassName('star-' + pos[0] + '-' + pos[1]),
            starList = document.getElementById('star-list-' + pos[0] + '-' + pos[1]);
        starList.addEventListener('mouseleave', revertStars);
        for(var g = 0; g < stars.length; g++) {
            stars[g].removeEventListener('mouseover', addMouseOver);
            stars[g].removeEventListener('click', addClick);
        }
    }

    function addMouseOver(event) {
        var currentIter = event.target.className,
            iterAndRatingArray = currentIter.split('glyphicon-star-').pop().split('-'),
            iter = iterAndRatingArray[2],
            iter2 = parseInt(iter, 10) + 1,
            pos = iterAndRatingArray.splice(0, 2);
        
        showAndHideStars(iter, iter2, pos);
    }

    function addClick(event) {
        var currentIter = event.target.className,
            iterAndRatingArray = currentIter.split('glyphicon-star-').pop().split('-'),
            rating = parseInt(iterAndRatingArray[2], 10),
            iter = iterAndRatingArray.splice(0, 2),
            starRating = document.getElementById('star-rating-' + iter[0] + '-' + iter[1]);
        starRating.value = rating;
    }

    function revertStars(event) {
        var pos = event.target.id.split('star-list-').pop().split('-'),
            starRating = document.getElementById('star-rating-' + pos[0] + '-' + pos[1]);
        if(starRating.value) {
            var iter = parseInt(starRating.value, 10),
                iter2 = iter + 1;
            showAndHideStars(iter, iter2, pos);
        }
    }

    function showAndHideStars(iter, iter2, pos) {
        for(iter; 0 < iter; iter--) {
            var starsToShine = document.getElementsByClassName('glyphicon-star-' + pos[0] + '-' + pos[1] + '-' + iter);
            starsToShine[0].className = 'glyphicon glyphicon-star star-' + pos[0] + '-' + pos[1] + ' glyphicon-star-' + pos[0] + '-' + pos[1] + '-' + iter;
        }
        for(iter2; 6 > iter2; iter2++) {
            var starsToNotShine = document.getElementsByClassName('glyphicon-star-' + pos[0] + '-' + pos[1] + '-' + iter2);
            starsToNotShine[0].className = 'glyphicon glyphicon-star-empty star-' + pos[0] + '-' + pos[1] + ' glyphicon-star-' + pos[0] + '-' + pos[1] + '-' + iter2;
        }
    }
});