const username = document.body.getAttribute("data-username");
console.log(username);

// const socket = new WebSocket("ws://127.0.0.1:8001/ws/game/server/");
const socket = new WebSocket("wss://graphgame-821c09cecdee.herokuapp.com/ws/game/server/");
console.log("run")
socket.onopen = function () {
    console.log("Connected to the WebSocket server!");

};
socket.onclose = function () {
    console.log("Disconnected from WebSocket server.");
};

socket.onerror = function (error) {
    console.error("WebSocket Error:", error);
};

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received:", data);

    if (data.command === "ROOM_LIST") {
        updateRoomList(data.rooms);
    }

    if (data.command === "REDIRECT_TO_ROOM") {
        sessionStorage.setItem("last_room", data.room_name);
        window.location.href = "/lobby/room/" + data.room_name; 
    }
};


function updateRoomList(rooms) {
    const roomListElement = document.getElementById("roomList");
    roomListElement.innerHTML = "";

    rooms.forEach(room => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        const roomNameSpan = document.createElement("span");
        roomNameSpan.textContent = room;

        const joinButton = document.createElement("button");
        joinButton.textContent = "Join";
        joinButton.classList.add("btn", "btn-primary");
        joinButton.addEventListener("click", function () {
            joinRoom(room);
        });

        listItem.appendChild(roomNameSpan);
        listItem.appendChild(joinButton);
        roomListElement.appendChild(listItem);
    });
}

function joinRoom(roomName) {
    let data = JSON.stringify({
        "command": "JOIN_ROOM",
        "room_name": roomName,
        "sender": username
    });

    socket.send(data);
}


function createRoom(roomName) {
    let data = JSON.stringify(
        {
            "message": roomName,
            "command": "CREATE_ROOM",
            "sender": username,
            "recipient": "server"
        }
    );
    socket.send(data);
}

document.addEventListener("DOMContentLoaded", function () {
    const createRoomForm = document.getElementById("createRoomForm");
    const roomNameInput = document.getElementById("roomName");

    roomNameInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, "");
    });

    createRoomForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const roomName = roomNameInput.value.trim();

        if (roomName === "") {
            alert("Room name cannot be empty!");
            return;
        }

        console.log("Room Name:", roomName);
        createRoom(roomName);


        const modalElement = document.getElementById("createRoomModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }

        roomNameInput.value = "";

    });
});



