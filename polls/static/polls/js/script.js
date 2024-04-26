// Clock

function updateClock() {
    const options = {
      timeZone: 'America/New_York',
      hour: '2-digit',       // Use 2-digit hour format
      minute: '2-digit',     // Use 2-digit minute format
      second: '2-digit',     // Use 2-digit second format
      year: 'numeric',       // Full numeric year
      month: '2-digit',      // 2-digit month
      day: '2-digit',        // 2-digit day
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const nyTime = formatter.format(new Date());
  
    document.getElementById('nyClock').innerText = `${nyTime}`;
}
 
setInterval(updateClock, 1000); 

document.addEventListener("DOMContentLoaded", function() {
    updateClock();

    const responseDivs = Array.from(document.querySelectorAll('.response'));
    
    responseDivs.forEach(function(responseDiv) {
        // Positioning and animations for .question-text within each .response div
        const questionDiv = responseDiv.querySelector('.question-text');
        if (questionDiv) {
            questionDiv.style.position = "absolute";
            questionDiv.style.left = Math.random() * (window.innerWidth - questionDiv.offsetWidth) + 'px';
            questionDiv.style.top = Math.random() * (window.innerHeight - questionDiv.offsetHeight) + 'px';

            makeDraggable(questionDiv);
            applyFloatingAnimation(questionDiv);
        }

        // Base coordinates for positioning other elements relative to .question-text
        const questionCenterX = questionDiv ? questionDiv.offsetLeft + questionDiv.offsetWidth / 2 : 0;
        const questionCenterY = questionDiv ? questionDiv.offsetTop + questionDiv.offsetHeight / 2 : 0;

        // Position and animate the .response-text relative to .question-text
        const responseTextDiv = responseDiv.querySelector('.response-text');
        if (responseTextDiv) {
            positionRelatedDiv(responseTextDiv, questionCenterX, questionCenterY, 200); // radius fixed at 70
        }

        // Positioning for .emotion-item, .person-item, .action-item
        responseDiv.querySelectorAll('.emotion-item, .person-item, .action-item').forEach(function(div) {
            positionRelatedDiv(div, questionCenterX, questionCenterY, Math.random() * 200); // radius up to 400
        });
    });

    function positionRelatedDiv(div, centerX, centerY, radius) {
        const angle = Math.random() * Math.PI * 2;
        const divX = centerX + radius * Math.cos(angle) - div.offsetWidth / 2;
        const divY = centerY + radius * Math.sin(angle) - div.offsetHeight / 2;

        div.style.position = "absolute";
        div.style.left = Math.max(0, Math.min(window.innerWidth - div.offsetWidth, divX)) + 'px';
        div.style.top = Math.max(0, Math.min(window.innerHeight - div.offsetHeight, divY)) + 'px';

        makeDraggable(div);
        applyFloatingAnimation(div);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const responses = document.querySelectorAll('.response');

    responses.forEach(response => {
        const pubDateString = response.getAttribute('data-creation-date');
        const pubDate = new Date(pubDateString.replace(' ', 'T')); // Convert date string to ISO format for better compatibility
        const ageInDays = (today - pubDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
        const opacity = calculateOpacity(ageInDays);
        
        // Apply opacity to question, actions, emotions, and people within the response
        response.querySelectorAll('.question-text, .action-item, .person-item, .emotion-item').forEach(el => {
            el.style.opacity = opacity;
        });
    });

    function calculateOpacity(daysOld) {
        // This function defines how opacity changes with the age of the entry
        if (daysOld < 1) {
            return 1; // Less than a month old
        } else if (daysOld < 2) {
            return 0.75; // 1 to 6 months old
        } else if (daysOld < 4) {
            return 0.5; // 6 to 12 months old
        } else {
            return 0.25; // Older than a year
        }
    }
});

//Making the Divs draggable

function makeDraggable(element) {
    element.onmousedown = function(event) {
        event.preventDefault();

        let startX = event.clientX - element.offsetLeft;
        let startY = event.clientY - element.offsetTop;

        function elementDrag(e) {
            e.preventDefault();

            // Calculate new position
            let newPosLeft = e.clientX - startX;
            let newPosTop = e.clientY - startY;

            updateLinePositions(element);

            // Ensure the position does not exceed the viewport
            element.style.left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newPosLeft)) + 'px';
            element.style.top = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newPosTop)) + 'px';
        }

        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', function _func() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', _func); // Clean up to prevent memory leak
        });
    };
}

// Dream Count

document.addEventListener('DOMContentLoaded', function() {
    // Select all question entries
    const questions = document.querySelectorAll('.response');
    // Count the entries
    const questionCount = questions.length;
    // Update the placeholder with the count
    document.getElementById('questionCount').innerText = `Dream Count: ${questionCount}`;
});

function updateQuestionCount() {
    const questionCount = document.querySelectorAll('.response').length;
    document.getElementById('questionCount').innerText = `Dream Count: ${questionCount}`;
}

// Call this function whenever a question is added or removed
updateQuestionCount();

//Info Section

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.question-text').forEach(item => {
        item.addEventListener('click', function() {
            console.log('Question text div clicked:', this.textContent);

            // Fetch response text from data attribute
            const responseText = this.getAttribute('data-response-text');
            const creationDate = this.closest('.response').getAttribute('data-creation-date');

            // Create a Date object from the creationDate string
            const dateObject = new Date(creationDate);

            // Define options for date formatting
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };

            // Create a formatter using Intl.DateTimeFormat
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const formattedCreationDate = formatter.format(dateObject);

            // Update the info box with formatted date
            const infoBox = document.getElementById('infoBox');
            infoBox.innerHTML = `
                Dreamer: ${this.textContent}<br>
                Dream: ${responseText}<br>
                Date and Time: ${formattedCreationDate}
            `;
            infoBox.style.display = 'block';
        });
    });
});

//Floating Animation

function applyFloatingAnimation(div) {
    const animationDuration = Math.random() * 5 + 3; // Duration between 3 to 8 seconds

    // Apply the animation style directly to the div
    div.style.animation = `floatAnimation ${animationDuration}s ease-in-out infinite alternate`;
}

function toggleModal() {
    var overlay = document.getElementById('modalOverlay');
    // Toggle visibility based on the overlay's current display state.
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

document.getElementById('openModal').addEventListener('click', toggleModal);

// Add this new function to close the modal when clicking on the overlay
document.getElementById('modalOverlay').addEventListener('click', function(event) {
    // Check if the click happened on the overlay itself and not on its children
    if (event.target === this) {
        // Hide the overlay
        this.style.display = 'none';
    }
});

//Drawing Lines

let currentLineId = 0; // Initialize line ID counter
let connections = {}; // To keep track of connections, if needed

function drawLinesBetweenQuestionsAndResponses() {
    const svgContainer = document.querySelector('.svg-container');
    const questionTextDivs = document.querySelectorAll('.question-text');

    questionTextDivs.forEach(questionDiv => {
        const entryId = questionDiv.getAttribute('data-entry-id');
        
        // Existing functionality to draw line to response-text
        const responseDiv = document.querySelector(`.response-text[data-entry-id="${entryId}"]`);
        if (responseDiv) {
            createAndAppendLine(questionDiv, responseDiv, 'white', svgContainer);
        }

        // New functionality to draw lines to each action-item under the same question
        const actionItems = document.querySelectorAll(`.action-item[data-entry-id="${entryId}"]`);
        actionItems.forEach(actionDiv => {
            createAndAppendLine(questionDiv, actionDiv, 'white', svgContainer);
        });

        const peopleItems = document.querySelectorAll(`.person-item[data-entry-id="${entryId}"]`);
        peopleItems.forEach(personDiv => {
            createAndAppendLine(questionDiv, personDiv, 'white', svgContainer);
        });

        const emotionItems = document.querySelectorAll(`.emotion-item[data-entry-id="${entryId}"]`);
        emotionItems.forEach(emotionDiv => {
            createAndAppendLine(questionDiv, emotionDiv, 'white', svgContainer);
        });

    });
}

let lineCounter = 0;
let lineConnections = {};

function createAndAppendLine(fromDiv, toDiv, color, svgContainer) {
    var lineId = 'line-' + lineCounter++;
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.id = lineId;
    line.setAttribute('class', 'svg-line');
    line.style.stroke = color;

    var fromRect = fromDiv.getBoundingClientRect();
    var toRect = toDiv.getBoundingClientRect();

    line.setAttribute('x1', fromRect.left + fromRect.width / 2 + window.scrollX);
    line.setAttribute('y1', fromRect.top + fromRect.height / 2 + window.scrollY);
    line.setAttribute('x2', toRect.left + toRect.width / 2 + window.scrollX);
    line.setAttribute('y2', toRect.top + toRect.height / 2 + window.scrollY);

    svgContainer.appendChild(line);

    // Store the line reference for easy access during updates
    if (!lineConnections[fromDiv.id]) lineConnections[fromDiv.id] = [];
    if (!lineConnections[toDiv.id]) lineConnections[toDiv.id] = [];
    lineConnections[fromDiv.id].push({ line: line, from: fromDiv, to: toDiv });
    lineConnections[toDiv.id].push({ line: line, from: fromDiv, to: toDiv });
}

function updateLinePositions(div) {
    if (lineConnections[div.id]) {
        lineConnections[div.id].forEach(connection => {
            var fromRect = connection.from.getBoundingClientRect();
            var toRect = connection.to.getBoundingClientRect();
            connection.line.setAttribute('x1', fromRect.left + fromRect.width / 2 + window.scrollX);
            connection.line.setAttribute('y1', fromRect.top + fromRect.height / 2 + window.scrollY);
            connection.line.setAttribute('x2', toRect.left + toRect.width / 2 + window.scrollX);
            connection.line.setAttribute('y2', toRect.top + toRect.height / 2 + window.scrollY);
        });
    }
}

window.addEventListener('load', function() {
    drawLinesBetweenQuestionsAndResponses();
});

// Toggle lines on and off

function toggleLinesVisibility() {
    var svgContainer = document.querySelector('.svg-container');
    var allLines = document.querySelectorAll('.svg-line');
    var button = document.getElementById('removeLines');  // Get the button element

    if (svgContainer.style.display === 'block') {
        // Fade out
        allLines.forEach(line => line.style.opacity = 0);
        // Wait for the animation to complete before setting display to 'none'
        setTimeout(() => {
            svgContainer.style.display = 'none';
            button.textContent = 'Find Connections';  // Update the button text to 'Find Connections'
        }, 1500); // Ensure this timeout matches your CSS transition duration
    } else {
        // Set display to 'block' before starting the fade-in to ensure it's visible
        svgContainer.style.display = 'block';
        setTimeout(() => {
            allLines.forEach(line => line.style.opacity = 0.6); // Ensure this matches your desired opacity level
            button.textContent = 'Hide Connections';  // Update the button text to 'Hide Connections'
        }, 10); // Small delay to ensure display change has taken effect
    }
}

document.getElementById('removeLines').addEventListener('click', toggleLinesVisibility);

// Time travel slider

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('timeSlider');
    const sliderValueLabel = document.getElementById('sliderValue');
    const responses = document.querySelectorAll('.response');
    const today = new Date();

    slider.oninput = function() {
        const daysAgo = parseInt(this.value);
        const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
        sliderValueLabel.textContent = daysAgo === 0 ? 'Today' : `${daysAgo} days ago`;

        responses.forEach(response => {
            const pubDateString = response.getAttribute('data-creation-date');
            const pubDate = new Date(pubDateString.replace(' ', 'T'));
            const ageInDays = (today - pubDate) / (1000 * 60 * 60 * 24);
            
            if (pubDate > targetDate) {
                response.style.display = 'none'; // This div did not exist at the target date
            } else {
                response.style.display = ''; // Make div visible
                const opacity = calculateOpacity(Math.floor(ageInDays - daysAgo));
                response.querySelectorAll('.question-text, .action-item, .person-item, .emotion-item').forEach(el => {
                    el.style.opacity = opacity;
                });
            }
        });
    };

    function calculateOpacity(daysOld) {
        if (daysOld < 1) {
            return 1; // Less than a day old
        } else if (daysOld < 30) {
            return 0.75; // 1 to 29 days old
        } else if (daysOld < 180) {
            return 0.5; // 30 to 179 days old
        } else {
            return 0.25; // 180 days old and more
        }
    }
});
