const roomName = sessionStorage.getItem("last_room") || "{{ room_name }}";
document.getElementById("roomName").textContent = roomName;

const username = document.body.getAttribute("data-username");
const socket = new WebSocket("ws://127.0.0.1:8001/ws/game/server/");

socket.onopen = function () {
    console.log("Connected to WebSocket.");
    sessionStorage.setItem("last_room", roomName);

    socket.send(JSON.stringify({
        "command": "JOIN_ROOM",
        "room_name": roomName,
        "sender": username
    }));
};

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received:", data);

    if (data.command === "ROOM_CHANGED") {
        document.getElementById("playerCount").textContent = data.player_count;
    }
};

function leaveRoom() {
    socket.send(JSON.stringify({
        "command": "LEAVE_ROOM",
        "room_name": roomName,
        "sender": username
    }));

    sessionStorage.removeItem("last_room");
    window.location.href = "/";
}

function startGame() {
    socket.send(JSON.stringify({
        "command": "START_GAME",
        "room_name": roomName,
        "sender": username
    }));

    // window.location.href = "/game/";
}