let playerX = 0; 
let playerY = 0;  
let enemy;

function startUpdatingDataOnce() {
    let endpoint = window.location.href.includes("test") ? "/game/update/test/" : "/game/update/";

    fetch(endpoint, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        plotPointsFromArray(data.message);
        enemy = data.message;

        playerX = (data.player[0] * 40);
        playerY = (data.player[1] * 40);
        drawPoint(playerX, playerY, "green");
    })
    .catch(error => console.error('Error:', error));
}


function plotPointsFromArray(pointsArray) {
    // Clear the canvas before plotting new points
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGridAndAxes();
    drawPoint(playerX, playerY, "green");

    pointsArray.forEach(point => {
        let x = point[0] * 40;
        let y = point[1] * 40;
        
        // Shift the coordinates by randomOrigin to adjust the origin on the canvas
        let canvasX = x ;
        let canvasY = y;  // Invert y for canvas coordinates (y grows downwards)
        
        // Plot the point in red color
        drawPoint(canvasX, canvasY, "rgb(255,0,0)");
    });
}


// Function to plot a single point
function drawPoint(x, y, color) {
    ctx.beginPath();
    ctx.arc(x + randomOrigin.x, randomOrigin.y - y, 5, 0, 2 * Math.PI);  
    ctx.fillStyle = color === "red" ? "rgb(255, 0, 0)" : color;  
    ctx.fill();
}

const equationInput = document.getElementById("equationInput");
const degreeInput = document.getElementById("degreeInput");
const plotButton = document.getElementById("plotButton");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
 

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

}

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
function animateGraph(pointsArray) {
    let step = 2; 
    let progress = 0;
    let currentPointIndex = 0;

    function isPointCollidingWithEnemy(x, y) {
        for (let i = 0; i < enemy.length; i++) {
            let enemyX = enemy[i][0] * 40 + randomOrigin.x;
            let enemyY = canvas.height - (enemy[i][1] * 40 + randomOrigin.y);
    
            let distance = Math.sqrt(Math.pow(x - enemyX, 2) + Math.pow(y - enemyY, 2));
            
            if (distance < 5) {  
                // ลบจุดที่ชนออกจากอาเรย์
                let deletedPoint = enemy.splice(i, 1)[0]; // เก็บจุดที่ถูกลบ
            
                console.log("Deleted point:", deletedPoint);
                sendDeletedPointToServer(deletedPoint);
    
                plotPointsFromArray(enemy);
    
    
                return true; 
            }
        }
        return false;
    }

    function drawAnimatedLine() {
        if (currentPointIndex >= pointsArray.length - 1) return; // หยุดเมื่อถึงจุดสุดท้ายในอาเรย์

        // Get current and next points from pointsArray
        let startX = pointsArray[currentPointIndex][0] + randomOrigin.x + playerX;
        let startY = canvas.height - (pointsArray[currentPointIndex][1] + randomOrigin.y + playerY);
        let endX = pointsArray[currentPointIndex + 1][0] + randomOrigin.x + playerX;
        let endY = canvas.height - (pointsArray[currentPointIndex + 1][1] + randomOrigin.y + playerY);

        let dxToDraw = (endX - startX) / 50;
        let dyToDraw = (endY - startY) / 50;

        let currentX = startX + dxToDraw * progress;
        let currentY = startY + dyToDraw * progress;

        // วาดเส้นระหว่างสองจุด
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // ตรวจสอบว่าจุดที่วาดชนกับศัตรูหรือไม่
        if (isPointCollidingWithEnemy(currentX, currentY)) {
            return; // หยุดการวาดหากชนกับจุดใน enemy
        }

        progress += step;

        if (progress > 50) {
            progress = 0;
            currentPointIndex++; // ขยับไปที่จุดถัดไปในอาเรย์
        }

        requestAnimationFrame(drawAnimatedLine);
    }

    drawAnimatedLine();
}


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
        plotPointsFromArray(enemy);
        drawPoint(playerX, playerY, "green");
        animateGraph(data.pointsArray); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function sendDeletedPointToServer(deletedPoint) {
    const csrfToken = getCookie('csrftoken');
    
    fetch('/game/delete_enemy/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            point: deletedPoint  
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


window.onload = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 120;

    // console.log(window.innerWidth);
    // console.log(window.innerHeight-120);

    
    startUpdatingDataOnce()
    startUpdatingDataOnce()
    drawGridAndAxes();
};

