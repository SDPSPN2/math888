// Get the DOM elements
const equationInput = document.getElementById("equationInput");
const degreeInput = document.getElementById("degreeInput");
const plotButton = document.getElementById("plotButton");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

// Store the random origin
let randomOrigin = { x: 0, y: 0 };

// Function to generate a random origin anywhere in the canvas
function generateRandomOrigin() {
    const padding = 50;
    randomOrigin.x = Math.floor(Math.random() * (canvas.width - 2 * padding) + padding);
    randomOrigin.y = Math.floor(Math.random() * (canvas.height - 2 * padding) + padding);
}

// Function to draw the fixed grid and XY axes at the center
function drawGridAndAxes() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const gridSpacing = 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#ddd";

    for (let x = centerX % gridSpacing; x < canvas.width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = centerY % gridSpacing; y < canvas.height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();

    // Draw XY axes at the center
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";

    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);

    ctx.stroke();

    // Mark the random origin
    ctx.beginPath();
    ctx.arc(randomOrigin.x, randomOrigin.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}

// Function to parse the equation and ignore "b"
function parseEquation(eq) {
    eq = eq.replace(/\s+/g, '');
    const regex = /^y\s*=\s*([-+]?[0-9]*\.?[0-9]*)x([-+]?[0-9]*\.?[0-9]*)?/i;
    const match = eq.match(regex);

    if (match) {
        let m = match[1] ? parseFloat(match[1]) : 1;
        return m; // Only return slope (ignore b)
    } else {
        alert("Invalid format. Use: y = mx + b");
        return null;
    }
}

// Function to animate the graph plotting
function animateGraph(equation, degree) {
    let m = parseEquation(equation);
    if (m === null) return;

    degree = parseFloat(degree);
    if (isNaN(degree) || degree < 0 || degree > 360) {
        alert("Please enter a valid degree (0-360°)");
        return;
    }

    // Convert degree to radians
    let radians = (degree * Math.PI) / 180;
    let dx = Math.cos(radians);
    let dy = Math.sin(radians);

    // Set animation properties
    let length = Math.max(canvas.width, canvas.height) * 0.8;
    let step = 2; // Speed of animation
    let progress = 0;

    function drawAnimatedLine() {
        if (progress > length) return;

        // Draw segment
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.moveTo(randomOrigin.x, randomOrigin.y);
        ctx.lineTo(randomOrigin.x + dx * progress, randomOrigin.y - dy * progress);
        ctx.stroke();

        progress += step; // Increase length
        requestAnimationFrame(drawAnimatedLine); // Continue animation
    }

    drawAnimatedLine(); // Start animation
}

// Event listener for the plot button
plotButton.addEventListener("click", function () {
    drawGridAndAxes();
    animateGraph(equationInput.value, degreeInput.value);
});

// Set up canvas on page load
window.onload = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 120;
    
    generateRandomOrigin();
    drawGridAndAxes();
};

