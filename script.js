
//Hiding and showing the submit and add dream buttons
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addDreamButton').addEventListener('click', function() {
        document.getElementById('dreamForm').style.display = 'block';
    });

    document.getElementById('dreamForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        addEmotion(); 
        addWho(); 
        addDream();
        drawLine(); 
        
        document.getElementById('dreamForm').style.display = 'none';
    });

    document.getElementById('hideWho').addEventListener('click', function(event) {
        document.getElementById('who').style.display = 'hidden';
    });

    document.getElementById('hideEmotions').addEventListener('click', function(event) {
        document.getElementById('emotion').style.display = 'hidden';
    });

    document.getElementById('hideDreams').addEventListener('click', function(event) {
        document.getElementById('dream').style.display = 'hidden';
    });


});


function createDiv(text, className) {
    // Check for duplicates
    var existingDivs = document.querySelectorAll('.' + className);
    for (var i = 0; i < existingDivs.length; i++) {
        if (existingDivs[i].textContent.trim() === text.trim()) {
            console.log("Duplicate found for " + className + ": " + text + ". No new div created.");
            return; // Exit the function if a duplicate is found
        }
    }

    // Proceed to create a new div if no duplicate is found
    var div = document.createElement("div");
    div.textContent = text;
    div.className = "draggable " + className;
    div.style.position = "absolute";
    div.style.left = Math.random() * (window.innerWidth - 100) + 'px'; // Random initial position
    div.style.top = Math.random() * (window.innerHeight - 20) + 'px';
    document.body.appendChild(div);
    makeDraggable(div);
}

// as they now call createDiv, which includes the duplicate check.
function addEmotion() {
    var input = document.getElementById("emotion").value;
    if (input.trim() !== '') {
        createDiv(input, 'emotion');
    }
}

function addDream() {
    var input = document.getElementById("dream").value;
    if (input.trim() !== '') {
        createDiv(input, 'dream');
    }
}

function addWho() {
    var input = document.getElementById("who").value;
    if (input.trim() !== '') {
        createDiv(input, 'who');
    }
}

function makeDraggable(elmnt) {
    elmnt.onmousedown = function(event) {
        event.preventDefault();
        
        // Calculate the initial offset inside the element at the start of the drag
        var offsetX = event.clientX - elmnt.getBoundingClientRect().left;
        var offsetY = event.clientY - elmnt.getBoundingClientRect().top;

        function elementDrag(e) {
            e.preventDefault();
            // Use the initial offset to set the new position, ensuring the cursor stays in the same relative position within the element
            elmnt.style.top = (e.clientY - offsetY) + "px";
            elmnt.style.left = (e.clientX - offsetX) + "px";
            drawLine(); // Update line position as the element is dragged
        }

        function stopDragElement() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', stopDragElement);
        }

        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', stopDragElement);
    };
}

function drawLine() {
    var emotionDiv = document.querySelector('.emotion');
    var dreamDiv = document.querySelector('.dream');
    var whoDiv = document.querySelector('.who');

    if (emotionDiv && dreamDiv) {
        var emotionRect = emotionDiv.getBoundingClientRect();
        var dreamRect = dreamDiv.getBoundingClientRect();
        var line = document.getElementById("exampleLine");

        line.setAttribute("x1", emotionRect.left + emotionRect.width / 2 + window.scrollX);
        line.setAttribute("y1", emotionRect.top + emotionRect.height / 2 + window.scrollY);
        line.setAttribute("x2", dreamRect.left + dreamRect.width / 2 + window.scrollX);
        line.setAttribute("y2", dreamRect.top + dreamRect.height / 2 + window.scrollY);
    } 
    
    if (whoDiv && dreamDiv) {
        var whoRect = whoDiv.getBoundingClientRect();
        var line2 = document.getElementById("exampleLine2");

        line2.setAttribute("x1", whoRect.left + whoRect.width / 2 + window.scrollX);
        line2.setAttribute("y1", whoRect.top + whoRect.height / 2 + window.scrollY);
        line2.setAttribute("x2", dreamRect.left + dreamRect.width / 2 + window.scrollX);
        line2.setAttribute("y2", dreamRect.top + dreamRect.height / 2 + window.scrollY);

    }
    
}

function toggleVisibility(className) {
    var divs = document.querySelectorAll('.' + className);
    divs.forEach(function(div) {
        // Check if the div is already hidden; if so, show it, else hide it.
        if (div.classList.contains('hidden')) {
            div.classList.remove('hidden');
        } else {
            div.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('hideEmotions').addEventListener('click', function() {
        toggleVisibility('emotion');
    });

    document.getElementById('hideNames').addEventListener('click', function() {
        toggleVisibility('who');
    });

    document.getElementById('hideDreams').addEventListener('click', function() {
        toggleVisibility('dream');
    });
});


