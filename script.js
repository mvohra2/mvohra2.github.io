
//Hiding and showing the submit and add dream buttons
document.getElementById('addDreamButton').addEventListener('click', function() {
    document.getElementById('dreamForm').style.display = 'block';
    this.style.display = 'none'; // Hide the button
});

document.getElementById('dreamForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    handleFormSubmission();

    currentGroupId++;
    
    addEmotion(); 
    addWho(); 
    addDream();
    drawLine(); 
    
    document.getElementById('dreamForm').style.display = 'none';
    document.getElementById('addDreamButton').style.display = 'block'; // Show the button again
});

var currentGroupId = 0;
let currentDivId = 0; // Global counter for div IDs
let currentLineId = 0; // Global counter for line IDs

function createDiv(text, className) {
    // Check for an existing div with the same text and className
    var existingDiv = Array.from(document.querySelectorAll('.' + className))
        .find(div => div.textContent.trim() === text.trim());

    if (existingDiv) {
        console.log("Existing " + className + " found for: " + text + ". No new div created.");
        return existingDiv; // Return the existing div, no new div created
    }

    // If no existing div found, proceed to create a new one
    var div = document.createElement("div");
    div.textContent = text;
    div.className = "draggable " + className;
    div.id = 'div' + currentDivId++; // Assign unique ID
    div.style.position = "absolute";
    div.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    div.style.top = Math.random() * (window.innerHeight - 20) + 'px';
    document.body.appendChild(div);
    makeDraggable(div);

    return div; // Return the newly created div
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
        
        var offsetX = event.clientX - elmnt.getBoundingClientRect().left;
        var offsetY = event.clientY - elmnt.getBoundingClientRect().top;

        function elementDrag(e) {
            e.preventDefault();
            elmnt.style.top = (e.clientY - offsetY) + "px";
            elmnt.style.left = (e.clientX - offsetX) + "px";
            updateConnectedLines(elmnt.id); // Update lines connected to this div
        }

        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', elementDrag);
        });
    };

    elmnt.addEventListener('mouseenter', function() {
        highlightConnections(elmnt, true); // Highlight on mouse enter
    });
    elmnt.addEventListener('mouseleave', function() {
        highlightConnections(elmnt, false); // Remove highlight on mouse leave
    });
}

function highlightConnections(div, highlight) {
    // Toggle the hover effect on the div directly
    if (highlight) {
        div.classList.add('hover-effect');
    } else {
        div.classList.remove('hover-effect');
    }

    // Retrieve the IDs of lines connected to this div and highlight connected divs
    let connectedLineIds = connections[div.id];
    if (!connectedLineIds) return;

    connectedLineIds.forEach(lineId => {
        let line = document.getElementById(lineId);
        if (line) {
            // Update the line's color
            line.style.stroke = highlight ? 'black' : 'grey'; // Adjust as needed
            line.style.opacity = highlight ? '80%' : '100%' ;

            // Highlight connected divs
            let fromId = line.getAttribute('data-from-id');
            let toId = line.getAttribute('data-to-id');
            [fromId, toId].forEach(id => {
                if (id !== div.id) { // Avoid re-applying the effect to the initiating div
                    let connectedDiv = document.getElementById(id);
                    if (connectedDiv) { // Check if the connected div exists
                        if (highlight) {
                            connectedDiv.classList.add('hover-effect');
                        } else {
                            connectedDiv.classList.remove('hover-effect');
                        }
                    }
                }
            });
        }
    });
}


//DrawLine

let connections = {}; // Example: { 'div1': ['line1', 'line2'], 'div2': ['line1'] }

function drawLine() {
    // No need to remove all lines; this will draw lines only for the current group

    const currentGroupEmotionDivs = document.querySelectorAll('.emotion[data-group-id="' + currentGroupId + '"]');
    const currentGroupDreamDivs = document.querySelectorAll('.dream[data-group-id="' + currentGroupId + '"]');
    const currentGroupWhoDivs = document.querySelectorAll('.who[data-group-id="' + currentGroupId + '"]');

    // Draw lines only within the current group
    currentGroupEmotionDivs.forEach(emotionDiv => {
        currentGroupDreamDivs.forEach(dreamDiv => {
            createAndAppendLine(emotionDiv, dreamDiv, 'grey');
        });
    });

    currentGroupWhoDivs.forEach(whoDiv => {
        currentGroupDreamDivs.forEach(dreamDiv => {
            createAndAppendLine(whoDiv, dreamDiv, 'grey');
        });
    });
}


function createAndAppendLine(fromDiv, toDiv, color) {
    var svgContainer = document.querySelector('.svg-container');
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.id = 'line' + currentLineId++; // Assign unique ID
    line.classList.add('svg-line');
    var fromRect = fromDiv.getBoundingClientRect();
    var toRect = toDiv.getBoundingClientRect();

    line.setAttribute('x1', fromRect.left + fromRect.width / 2 + window.scrollX);
    line.setAttribute('y1', fromRect.top + fromRect.height / 2 + window.scrollY);
    line.setAttribute('x2', toRect.left + toRect.width / 2 + window.scrollX);
    line.setAttribute('y2', toRect.top + toRect.height / 2 + window.scrollY);
    line.setAttribute('style', `stroke:${color};stroke-width:2`);

    line.setAttribute('data-from-id', fromDiv.id);
    line.setAttribute('data-to-id', toDiv.id);

    svgContainer.appendChild(line);

    // Record the connection
    if (!connections[fromDiv.id]) connections[fromDiv.id] = [];
    if (!connections[toDiv.id]) connections[toDiv.id] = [];
    connections[fromDiv.id].push(line.id);
    connections[toDiv.id].push(line.id);
}

function updateConnectedLines(divId) {
    document.querySelectorAll(`line[data-from-id="${divId}"], line[data-to-id="${divId}"]`).forEach(line => {
        let fromDiv = document.getElementById(line.getAttribute('data-from-id'));
        let toDiv = document.getElementById(line.getAttribute('data-to-id'));

        let fromRect = fromDiv.getBoundingClientRect();
        let toRect = toDiv.getBoundingClientRect();

        // Update line coordinates
        line.setAttribute('x1', fromRect.left + fromRect.width / 2 + window.scrollX);
        line.setAttribute('y1', fromRect.top + fromRect.height / 2 + window.scrollY);
        line.setAttribute('x2', toRect.left + toRect.width / 2 + window.scrollX);
        line.setAttribute('y2', toRect.top + toRect.height / 2 + window.scrollY);
    });
}

function handleFormSubmission() {
    // Retrieve input values
    var emotionInput = document.getElementById("emotion").value.trim();
    var whoInput = document.getElementById("who").value.trim();
    var dreamInput = document.getElementById("dream").value.trim();

    // Attempt to create or retrieve existing divs for each input
    var emotionDiv = createDiv(emotionInput, 'emotion');
    var whoDiv = createDiv(whoInput, 'who');
    var dreamDiv = createDiv(dreamInput, 'dream');

    // Assuming createDiv returns null if a div is not created (when a duplicate is found)
    // and returns the existing div otherwise. Adjust this logic based on your actual implementation.
    // The returned div could be new or existing, but it will always be the correct div to connect.

    // Connect divs as necessary. This involves drawing lines between related divs.
    // Since createDiv ensures no duplicates and returns the correct div,
    // these connections will be correctly made to either new or existing divs.
    
    // Example connections (adjust based on your actual needs):
    // Connect 'emotion' and 'dream'
    if (emotionDiv && dreamDiv) {
        createAndAppendLine(emotionDiv, dreamDiv, 'grey');
    }

    // Connect 'who' and 'dream'
    if (whoDiv && dreamDiv) {
        createAndAppendLine(whoDiv, dreamDiv, 'grey');
    }

    // Reset form fields after submission for a better user experience
    document.getElementById("emotion").value = '';
    document.getElementById("who").value = '';
    document.getElementById("dream").value = '';

    // Hide the form or reset visibility settings as necessary
    // For example: document.getElementById('dreamForm').style.display = 'none';
}


//Visibility


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


