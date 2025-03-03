const username = document.body.getAttribute("data-username");
let playerX = 0;
let playerY = 0;
let enemy;
let enemyX = 0;
let enemyY = 0;



function showWinMessage() {
    ctx.font = "100px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
}



function startUpdatingDataOnce(username) {
    let endpoint = window.location.href.includes("test") ? `/game/update/test/${username}/` : `/game/update/${username}/`;

    fetch(endpoint, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            plotPointsFromArray(data.message);
            enemy = data.message;
            enemyX = (data.message[0][0] * 40);
            enemyY = (data.message[0][1] * 40);

            // console.log(enemyX, enemyY)

            playerX = (data.player[0] * 40);
            playerY = (data.player[1] * 40);
            drawPoint(playerX, playerY, "green");
            // drawPoint(0,0,"black");

            console.log("pPoint", playerX, playerY)
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
        let canvasX = x;
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


let randomOrigin = { x: window.innerWidth / 2, y: (window.innerHeight - 120) / 2 };

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
function animateGraphEnemy(pointsArray) {
    let step = 2;
    let progress = 0;
    let currentPointIndex = pointsArray.length - 1; // เริ่มจากจุดสุดท้าย
    console.log("run")

    // function isPointCollidingWithPlayer(x, y) {
    //     let playerXPos = playerX + randomOrigin.x;
    //     let playerYPos = canvas.height - (playerY + randomOrigin.y);

    //     let distance = Math.sqrt(Math.pow(x - playerXPos, 2) + Math.pow(y - playerYPos, 2));

    //     if (distance < 5) {  
    //         console.log("Player hit!");
    //         // handlePlayerHit(); // ฟังก์ชันเมื่อโดน player
    //         return true;
    //     }
    //     return false;
    // }

    function drawAnimatedLine() {
        if (currentPointIndex <= 0) return; // หยุดเมื่อถึงจุดแรก

        let startX = pointsArray[currentPointIndex][0] + randomOrigin.x + enemyX;
        let startY = canvas.height - (pointsArray[currentPointIndex][1] + randomOrigin.y + enemyY);
        let endX = pointsArray[currentPointIndex - 1][0] + randomOrigin.x + enemyX;
        let endY = canvas.height - (pointsArray[currentPointIndex - 1][1] + randomOrigin.y + enemyY);

        console.log("da", startX)
        let dxToDraw = (endX - startX) / 50;
        let dyToDraw = (endY - startY) / 50;

        let currentX = startX - dxToDraw * progress;
        let currentY = startY - dyToDraw * progress;

        // if (currentX < 0 || currentX > canvas.width || currentY < 0 || currentY > canvas.height) {
        //     return;
        // }

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // if (isPointCollidingWithPlayer(currentX, currentY)) {
        //     return; // หยุดถ้าชน player
        // }

        progress += step;

        if (progress > 50) {
            progress = 0;
            currentPointIndex--; // ถอยไปจุดก่อนหน้า
        }

        requestAnimationFrame(drawAnimatedLine);
    }

    drawAnimatedLine();
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

                if (enemy.length === 0) {


                    // ขั้นตอนที่ 1: เลือก canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    showWinMessage();
                }


                return true;
            }
        }
        return false;
    }

    function drawAnimatedLine() {
        if (currentPointIndex >= pointsArray.length - 1) return; // หยุดเมื่อถึงจุดสุดท้ายในอาเรย์

        // Get current and next points from pointsArray
        let startX = pointsArray[currentPointIndex][0] + randomOrigin.x + playerX;
        console.log(startX);
        let startY = canvas.height - (pointsArray[currentPointIndex][1] + randomOrigin.y + playerY);
        let endX = pointsArray[currentPointIndex + 1][0] + randomOrigin.x + playerX;
        let endY = canvas.height - (pointsArray[currentPointIndex + 1][1] + randomOrigin.y + playerY);

        let dxToDraw = (endX - startX) / 50;
        let dyToDraw = (endY - startY) / 50;

        let currentX = startX + dxToDraw * progress;
        let currentY = startY + dyToDraw * progress;

        if (currentX < 0 || currentX > canvas.width || currentY < 0 || currentY > canvas.height) {
            return;
        }

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
    fetch(`/game/cal/${username}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ equation: equation }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("wa", data.pointsArray);
            drawGridAndAxes();
            plotPointsFromArray(enemy);
            drawPoint(playerX, playerY, "green");
            animateGraph(data.pointsArray.points);
            // animateGraphEnemy([[200,-200],[40,-40],[0, 0]]);
            // animateGraph([-100,-80], [80,80]);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function sendDeletedPointToServer(deletedPoint) {
    const csrfToken = getCookie('csrftoken');

    fetch(`/game/delete_enemy/${username}/`, {
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

    startUpdatingDataOnce(username);
    startUpdatingDataOnce(username);
    drawGridAndAxes();
    // drawPoint(0,0,"black");

};


