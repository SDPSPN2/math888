const equationInput = document.getElementById("equationInput");
const degreeInput = document.getElementById("degreeInput");
const plotButton = document.getElementById("plotButton");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");


let randomOrigin = { x: window.innerWidth / 2, y: (window.innerHeight - 120) / 2 };

let playerX = 0;
let playerY = 0;
let enemy;

 

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    // console.log("Message from server:", data.message);

    let message = data.message;
    let command = data.command;
    let sender = data.sender;
    let recipient = data.recipient;

    if (sender == "server" && command == "ROOM_CREATED") {
        console.log("connect room");
        connectRoom(message);
    }

};

socket.onclose = function () {
    console.log("Disconnected from WebSocket");
};

function create_room() {
    const message = "room1";
    const command = "CREATE_ROOM";
    const sender = 0;
    const recipient = "server"

    const data = JSON.stringify({
        message: message,
        command: command,
        sender: sender,
        recipient: recipient,
    });

    socket.send(data);
}

function connectRoom(url) {
    roomSocket = new WebSocket(url);


    roomSocket.onopen = function () {
        console.log("Connected to ROOM");
    };

    roomSocket.onmessage = function (event) {
        const data = JSON.parse(event.data);

        let message = data.message;
        let command = data.command;
        let sender = data.sender;
        let recipient = data.recipient;


        if (command == "START" && sender == "player") {
            // console.log("player:", message[0], message[1])
            drawPoint(message[0] * 40, message[1] * 40, "green")
            playerX = message[0] * 40;
            playerY = message[1] * 40;
        }

        if (command == "START" && sender == "BOT") {
            // console.log("player:", message[0], message[1])
            drawPoint(message[0] * 40, message[1] * 40, "red")
            enemy = [[message[0] * 40, message[1] * 40]]
        }

        if(command == "DRAW" && sender == "server" && recipient == "player"){
            console.log("DRAW",message);
        }

    };

    roomSocket.onclose = function () {
        console.log("Disconnected from WebSocket");
    };
}

plotButton.addEventListener("click", function () {
    const equation = equationInput.value; 
    // const csrfToken = getCookie('csrftoken'); 

    const message = equation;
    const command = "CALCULATE";
    const sender = "player";
    const recipient = "server"

    const data = JSON.stringify({
        message: message,
        command: command,
        sender: sender,
        recipient: recipient,
    });

    roomSocket.send(data);
    
    // console.log(equation)
});



function drawPoint(x, y, color) {
    ctx.beginPath();
    ctx.arc(x + randomOrigin.x, randomOrigin.y - y, 5, 0, 2 * Math.PI);
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

    // startUpdatingDataOnce()
    drawGridAndAxes();
};

