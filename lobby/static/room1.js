const roomName = sessionStorage.getItem("last_room") || "{{ room_name }}";
document.getElementById("roomName").textContent = roomName;

const username = document.body.getAttribute("data-username");
const socket = new WebSocket("wss://" + window.location.host + "/ws/game/server/");

// const socket = new WebSocket("wss://graphgame-821c09cecdee.herokuapp.com/ws/game/server/");
console.log("run test")

socket.onopen = function () {
    console.log("Connected to WebSocket.");
    sessionStorage.setItem("last_room", roomName);

    socket.send(JSON.stringify({
        "command": "JOIN_ROOM",
        "room_name": roomName,
        "sender": username
    }));

    socket.send(JSON.stringify({
        "command": "CONFIRM_USER",
        "room_name": roomName,
        "sender": username
    }));

    console.log("run")

};

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received:", data);

    if (data.command === "ROOM_CHANGED") {
        document.getElementById("playerCount").textContent = data.player_count;
      
    }
    if(data.command == "ERROR"){
        window.location.href = "/lobby/";
    }

    if(data.command === "START_GAME"){
        window.location.href = "/game/";
        // console.log("x")
    }
};

function leaveRoom() {
    socket.send(JSON.stringify({
        "command": "LEAVE_ROOM",
        "room_name": roomName,
        "sender": username
    }));

    sessionStorage.removeItem("last_room");
    window.location.href = "/lobby/";
}

function startGame() {
    socket.send(JSON.stringify({
        "command": "START_GAME",
        "room_name": roomName,
        "sender": username
    }));
}


window.onload = function () {

};