const equationInput = document.getElementById("equationInput");
const degreeInput = document.getElementById("degreeInput");
const plotButton = document.getElementById("plotButton");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

let randomOrigin = { x: window.innerWidth / 2, y: (window.innerHeight - 120) / 2 };

let playerX = 0;
let playerY = 0;
let enemy;
let enemyX = 0;
let enemyY= 0;

const roomName = sessionStorage.getItem("last_room") || "{{ room_name }}";

const username = document.body.getAttribute("data-username");
// const socket = new WebSocket("ws://127.0.0.1:8001/ws/game/server/");
// const socket = new WebSocket("wss://graphgame-821c09cecdee.herokuapp.com/ws/game/server/");
const socket = new WebSocket("wss://" + window.location.host + "/ws/game/server/");
console.log("run test")
socket.onopen = function () {
    console.log("Connected to WebSocket!!!.");
    sessionStorage.setItem("last_room", roomName);

    socket.send(JSON.stringify({
        "command": "JOIN_ROOM",
        "room_name": roomName,
        "sender": username
    }));

    socket.send(JSON.stringify({
        "command": "READY",
        "room_name": roomName,
        "sender": username
    }));

    socket.send(JSON.stringify({
        "command": "CONFIRM_GAME_ROOM",
        "room_name": roomName,
        "sender": username
    }));


};

socket.onclose = function(event){
    socket.send(JSON.stringify({
        "command": "disconnect",
        "room_name": roomName,
        "sender": username
    }));
}

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log(data);
    let u1 = "";
    let u2 = "";

    if (data.command == "SET_POSITION") {
        let dataflag = data.message;
        let pairs = dataflag.split("|");

        let [username1, point1] = pairs[0].split(":");
        let [username2, point2] = pairs[1].split(":");

        let p1Array =  point1.slice(1, -1).split(",").map(Number);
        let p2Array =  point2.slice(1, -1).split(",").map(Number);

        u1 = username1
        u2 = username2

        if(username1 == username){
            playerX = p1Array[0] * 40
            playerY = p1Array[1] * 40
            enemyX = p2Array[0] * 40
            enemyY = p2Array[1] * 40

            enemy = p2Array
        }
        else{
            playerX = -p2Array[0] * 40
            playerY = p2Array[1] * 40
            enemyX = -p1Array[0] * 40
            enemyY = p1Array[1] * 40
            enemy = p1Array

        }

        drawPoint(playerX, playerY, "green");
        drawPoint(enemyX, enemyY, "red");


    }

    else if(data.command == "DRAW"){

        if( data.recipient == username){
            console.log("BeforeRun")
            animateGraph(data.message);
    
            console.log("run", data.message)
        }
        else{
            animateGraphEnemy(data.message);
        }
    }

    else if(data.command == "ROUND_SET"){
        const roundIndicator = document.getElementById('round-indicator');
        roundIndicator.textContent = "ROUND:" + data.message;
    }
   
};


function showWinMessage() {
    ctx.font = "100px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
}


function showLoseMessage() {
    ctx.font = "100px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
}


function endRound(){
    socket.send(JSON.stringify({
        "command": "SW_ROUND",
        "room_name": roomName,
        "sender": username
    }));
}

function endGame(){
    socket.send(JSON.stringify({
        "command": "endGame",
        "room_name": roomName,
        "sender": username
    }));
}

function animateGraphEnemy(pointsArray) {
    let step = 2;
    let progress = 0;
    let currentPointIndex = 0;

    function isPointCollidingWithEnemy(x, y) {
        for (let i = 0; i < enemy.length; i++) {
            // console.log("check",x,y)
            let _enemyX = playerX + randomOrigin.x;
            let _enemyY = canvas.height - (playerY + randomOrigin.y);

        

            let distance = Math.sqrt(Math.pow(x - _enemyX, 2) + Math.pow(y - _enemyY, 2));
            // console.log("Checking collision:", { enemyX, enemyY, x, y, distance });
            if (distance < 10) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                showLoseMessage();


                return true;
            }
        }
        return false;
    }

    function drawAnimatedLine() {
        if (currentPointIndex >= pointsArray.length - 1) return; // หยุดเมื่อถึงจุดสุดท้ายในอาเรย์
        
        // console.log("x");
  
        let startX = -pointsArray[currentPointIndex][0] + randomOrigin.x+enemyX;
        let startY = canvas.height - (pointsArray[currentPointIndex][1] + randomOrigin.y + enemyY);
        let endX = -pointsArray[currentPointIndex + 1][0] + randomOrigin.x+enemyX;
        let endY = canvas.height - (pointsArray[currentPointIndex + 1][1] + randomOrigin.y + enemyY);

        let dxToDraw = (endX - startX) / 50;
        let dyToDraw = (endY - startY) / 50;

        let currentX = startX + dxToDraw * progress;
        let currentY = startY + dyToDraw * progress;

        if (currentX < 0 || currentX > canvas.width || currentY < 0 || currentY > canvas.height) {
            // endRound();s
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGridAndAxes();
            drawPoint(playerX, playerY, "green");
            drawPoint(enemyX, enemyY, "red");
            return;
        }

        // วาดเส้นระหว่างสองจุด
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // // ตรวจสอบว่าจุดที่วาดชนกับศัตรูหรือไม่
        if (isPointCollidingWithEnemy(currentX, currentY)) {
            endGame()
            return; // หยุดการวาดหากชนกับจุดใน enemy
        }

        progress += step;

        if (progress > 50) {
            progress = 0;
            currentPointIndex++; // ขยับไปที่จุดถัดไปในอาเร
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
            // console.log("check",x,y)
            let _enemyX = enemyX + randomOrigin.x;
            let _enemyY = canvas.height - (enemyY + randomOrigin.y);

            let distance = Math.sqrt(Math.pow(x - _enemyX, 2) + Math.pow(y - _enemyY, 2));
            // console.log("dis: ", distance)
            if (distance < 10) {
                // ลบจุดที่ชนออกจากอาเรย์
                let deletedPoint = enemy.splice(i, 1)[0]; // เก็บจุดที่ถูกลบ

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                showWinMessage();


                return true;
            }
        }
        return false;
    }

    function drawAnimatedLine() {
        if (currentPointIndex >= pointsArray.length - 1) return; // หยุดเมื่อถึงจุดสุดท้ายในอาเรย์
        
        // console.log("x");
  
        let startX = pointsArray[currentPointIndex][0] + randomOrigin.x+playerX;
        let startY = canvas.height - (pointsArray[currentPointIndex][1] + randomOrigin.y + playerY);
        let endX = pointsArray[currentPointIndex + 1][0] + randomOrigin.x+playerX;
        let endY = canvas.height - (pointsArray[currentPointIndex + 1][1] + randomOrigin.y + playerY);

        let dxToDraw = (endX - startX) / 50;
        let dyToDraw = (endY - startY) / 50;

        let currentX = startX + dxToDraw * progress;
        let currentY = startY + dyToDraw * progress;

        if (currentX < 0 || currentX > canvas.width || currentY < 0 || currentY > canvas.height) {
            console.log("start");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGridAndAxes();
            drawPoint(playerX, playerY, "green");
            drawPoint(enemyX, enemyY, "red");
            endRound();
            console.log("Stop");
            return;
        }

        // วาดเส้นระหว่างสองจุด
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // // ตรวจสอบว่าจุดที่วาดชนกับศัตรูหรือไม่
        if (isPointCollidingWithEnemy(currentX, currentY)) {
            endGame();
            return; // หยุดการวาดหากชนกับจุดใน enemy
        }

        progress += step;

        if (progress > 50) {
            progress = 0;
            currentPointIndex++; // ขยับไปที่จุดถัดไปในอาเร
        }

        requestAnimationFrame(drawAnimatedLine);
    }

    drawAnimatedLine();
}


plotButton.addEventListener("click", function () {
    const equation = equationInput.value.trim(); 
    const equationPattern = /^y=(-?\d+(\.\d+)?\*x|-?x)$/;

    if (!equationPattern.test(equation)) {
        alert("กรุณาใส่สมการในรูปแบบ y=เลข*x เช่น y=2*x หรือ y=0.5*x");
        return;
    }

    socket.send(JSON.stringify({
        "command": "EQUATION",
        "message": equation,
        "room_name": roomName,
        "sender": username
    }));
});




function drawPoint(x, y, color) {
    ctx.beginPath();
    ctx.arc(x + randomOrigin.x, randomOrigin.y - y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = color === "red" ? "rgb(255, 0, 0)" : color;
    ctx.fill();
}


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

    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);

    ctx.stroke();

}




window.onload = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 120;

    drawGridAndAxes();
};