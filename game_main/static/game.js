// const equationInput = document.getElementById("equationInput");
// const degreeInput = document.getElementById("degreeInput");
// const plotButton = document.getElementById("plotButton");
// const canvas = document.getElementById("graphCanvas");
// const ctx = canvas.getContext("2d");

// let randomOrigin = { x: window.innerWidth / 2, y: (window.innerHeight - 120) / 2 };

// let playerX = 0;
// let playerY = 0;
// let enemy;


// const roomName = sessionStorage.getItem("last_room") || "{{ room_name }}";
// // document.getElementById("roomName").textContent = roomName;

// const username = document.body.getAttribute("data-username");
// const socket = new WebSocket("ws://127.0.0.1:8001/ws/game/server/");

// socket.onopen = function () {
//     console.log("Connected to WebSocket!!!.");
//     sessionStorage.setItem("last_room", roomName);

//     socket.send(JSON.stringify({
//         "command": "JOIN_ROOM",
//         "room_name": roomName,
//         "sender": username
//     }));

//     socket.send(JSON.stringify({
//         "command": "READY",
//         "room_name": roomName,
//         "sender": username
//     }));


// };

// socket.onmessage = function (event) {
//     const data = JSON.parse(event.data);
//     console.log(data.message);

//     if (data.command == "SET_POSITION") {
//         let dataflag = data.message;
//         let pairs = dataflag.split("|");

//         let [username1, point1] = pairs[0].split(":");
//         let [username2, point2] = pairs[1].split(":");

//         let p1Array =  point1.slice(1, -1).split(",").map(Number);
//         let p2Array =  point2.slice(1, -1).split(",").map(Number);


//         if(username1 == username){
//             playerX = p1Array[0]
//             playerY = p1Array[1]

//             enemy = p2Array
//         }
//         else{
//             playerX = p2Array[0]
//             playerY = p2Array[1]
//             enemy = p1Array

//         }

//         drawPoint(playerX*40,playerY*40, "green");
//         drawPoint(enemy[0]*40, enemy[1]*40, "red");
//     }
   
// };



// plotButton.addEventListener("click", function () {
//     const equation = equationInput.value; 

//     socket.send(JSON.stringify({
//         "command": "EQUATION",
//         "message": equation,
//         "room_name": roomName,
//         "sender": username
//     }));
   
// });



// function drawPoint(x, y, color) {
//     ctx.beginPath();
//     ctx.arc(x + randomOrigin.x, randomOrigin.y - y, 5, 0, 2 * Math.PI);
//     ctx.fillStyle = color === "red" ? "rgb(255, 0, 0)" : color;
//     ctx.fill();
// }


// function drawGridAndAxes() {
//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;
//     const gridSpacing = 40;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw grid
//     ctx.beginPath();
//     ctx.lineWidth = 0.5;
//     ctx.strokeStyle = "#ddd";

//     for (let x = centerX % gridSpacing; x < canvas.width; x += gridSpacing) {
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, canvas.height);
//     }
//     for (let y = centerY % gridSpacing; y < canvas.height; y += gridSpacing) {
//         ctx.moveTo(0, y);
//         ctx.lineTo(canvas.width, y);
//     }

//     ctx.stroke();

//     // Draw XY axes at the center
//     ctx.beginPath();
//     ctx.lineWidth = 2;
//     ctx.strokeStyle = "#000";

//     ctx.moveTo(centerX, 0);   // ctx.beginPath();

//     ctx.lineTo(centerX, canvas.height);
//     ctx.moveTo(0, centerY);
//     ctx.lineTo(canvas.width, centerY);

//     ctx.stroke();

// }




// window.onload = function () {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight - 120;


//     // startUpdatingDataOnce()
//     // startUpdatingDataOnce()
//     drawGridAndAxes();
// };