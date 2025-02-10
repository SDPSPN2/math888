let playerX = 0; 
let playerY = 0;  

setInterval(function() {
    fetch('/game/update/', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data.message); 
        // console.log(data.player);
        plotPointsFromArray(data.message);
        
        playerX = (data.player[0]*40);
        playerY = (data.player[1]*40);
        drawPoint(playerX, playerY, "green");

    })
    .catch(error => console.error('Error:', error));
}, 100);

function plotPointsFromArray(pointsArray) {
    pointsArray.forEach(point => {
        let x = point[0] * 40;
        let y = point[1] * 40;
        
        // Shift the coordinates by randomOrigin to adjust the origin on the canvas
        let canvasX = x ;
        let canvasY = y;  // Invert y for canvas coordinates (y grows downwards)
        
        // Plot the point in red color
        drawPoint(canvasX, canvasY, "red");
    });
}

// Function to plot a single point
function drawPoint(x, y, color) {
    ctx.beginPath();
    ctx.arc(x+ randomOrigin.x, randomOrigin.y - y, 5, 0, 2 * Math.PI);  // Draw a circle with radius 5
    ctx.fillStyle = color;  // Set point color to red
    ctx.fill();
}



const equationInput = document.getElementById("equationInput");
const degreeInput = document.getElementById("degreeInput");
const plotButton = document.getElementById("plotButton");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
 // .then(response => response.json())
    // .then(data => {
    //     console.log("Data from server:", data);
    //     drawGridAndAxes();
    //     animateGraph(data.pointsArray);  // ใช้ pointsArray ที่ส่งมาจาก server
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
// Store the random origin
let randomOrigin = { x: window.innerWidth/2, y: (window.innerHeight-120)/2 };

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

    ctx.moveTo(centerX, 0);   // ctx.beginPath();
    // ctx.arc(randomOrigin.x, randomOrigin.y, 5, 0, 2 * Math.PI);
    // ctx.fillStyle = "green";
    // ctx.fill();
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);

    ctx.stroke();

    // Mark the random origin
    // ctx.beginPath();
    // ctx.arc(randomOrigin.x, randomOrigin.y, 5, 0, 2 * Math.PI);
    // ctx.fillStyle = "green";
    // ctx.fill();
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
// function animateGraph(equation, degree) {
//     let m = parseEquation(equation);
//     if (m === null) return;

//     degree = parseFloat(degree);
//     if (isNaN(degree) || degree < 0 || degree > 360) {
//         alert("Please enter a valid degree (0-360°)");
//         return;
//     }

//     // Convert degree to radians
//     let radians = (degree * Math.PI) / 180;
//     let dx = Math.cos(radians);
//     let dy = Math.sin(radians);

//     // Set animation properties
//     let length = Math.max(canvas.width, canvas.height) * 0.8;
//     let step = 2; // Speed of animation
//     let progress = 0;

//     function drawAnimatedLine() {
//         if (progress > length) return;

//         // Draw segment
//         ctx.beginPath();
//         ctx.strokeStyle = "blue";
//         ctx.lineWidth = 2;
//         ctx.moveTo(randomOrigin.x+playerX, randomOrigin.y - playerY);
//         ctx.lineTo((randomOrigin.x+playerX) + dx * progress, (randomOrigin.y - playerY) - dy * progress);
//         ctx.stroke();

//         progress += step; // Increase length
//         requestAnimationFrame(drawAnimatedLine); // Continue animation
//     }

//     drawAnimatedLine(); // Start animation
// }

let pointsArray = [
    [0, 0],  // จุดที่ 1
    [100, 100],  // จุดที่ 2
    [200, 200],  // จุดที่ 3
    [300, 300],
   
];
function animateGraph(pointsArray) {
    let step = 2; // Speed of animation
    let progress = 0;
    let currentPointIndex = 0; // เริ่มจากจุดแรกในอาเรย์
    function drawAnimatedLine() {
        if (currentPointIndex >= pointsArray.length - 1) return; // หยุดเมื่อถึงจุดสุดท้ายในอาเรย์

        // Get current and next points from pointsArray
        let startX = pointsArray[currentPointIndex][0] + randomOrigin.x + playerX;
        let startY = canvas.height - (pointsArray[currentPointIndex][1] + randomOrigin.y + playerY); // คำนวณตำแหน่ง y ให้เพิ่มขึ้นจากล่างขึ้นบน
        let endX = pointsArray[currentPointIndex + 1][0] + randomOrigin.x + playerX;
        let endY = canvas.height - (pointsArray[currentPointIndex + 1][1] + randomOrigin.y + playerY); // คำนวณตำแหน่ง y สำหรับจุดถัดไป

        // การคำนวณส่วนที่ควรจะวาดระหว่างจุด
        let dxToDraw = (endX - startX) / 50; // จำนวน step ที่จะค่อยๆ วาด
        let dyToDraw = (endY - startY) / 50;

        // คำนวณพิกัดที่จะแสดงระหว่างจุด
        let currentX = startX + dxToDraw * progress;
        let currentY = startY + dyToDraw * progress;

        // วาดเส้นในระหว่างสองจุด
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        progress += step; // เพิ่มความยาวในการลากเส้น

        if (progress > 50) { // ถ้าผ่านไป 50 step แล้วให้ไปยังจุดถัดไป
            progress = 0;
            currentPointIndex++; // ขยับไปที่จุดถัดไปในอาเรย์
        }

        requestAnimationFrame(drawAnimatedLine); // ทำให้อนิเมชั่นเดินต่อไป
    }

    drawAnimatedLine(); // เริ่มการอนิเมชั่น
}



// // Event listener for the plot button
// plotButton.addEventListener("click", function () {
//     drawGridAndAxes();
//     animateGraph(pointsArray);
// });

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // ตรวจสอบว่า cookie ชื่อเดียวกับที่เราต้องการ
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

plotButton.addEventListener("click", function () {
    const equation = equationInput.value; 
    const csrfToken = getCookie('csrftoken'); 
    fetch('/game/cal/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ equation: equation }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Data from server:", data.pointsArray);
        drawGridAndAxes();
        animateGraph(data.pointsArray); 
        // animateGraph(pointsArray); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


// Set up canvas on page load
window.onload = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 120;

    console.log(window.innerWidth);
    console.log(window.innerHeight-120);
    
    // generateRandomOrigin();
    drawGridAndAxes();
};

