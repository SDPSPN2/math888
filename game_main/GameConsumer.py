import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
    rooms = {}
    roomsAndUser = {}
    server = {}

    async def connect(self):
        self.room_name = None  
        await self.accept()

        await self.channel_layer.group_add("lobby", self.channel_name)
        await self.channel_layer.group_add("server", self.channel_name)
        # print("connect",self.channel_name)


        await self.send_room_list()

    async def disconnect(self, close_code):
        if self.room_name:
            # pass
            await self.leave_room()
        # print("disconnect",self.channel_name, close_code)
            
    async def receive(self, text_data):
        data = json.loads(text_data)
        command = data.get("command", "")
        sender = data.get("sender", "")
        message = data.get("message", "")
        room_to_join = data.get("room_name", "")

        print(sender, command, message)

        if command == "SERVERCONECTION":  
            self.server["SERVERGAME"] = self.channel_name
            # print("serverConnection",self.server)
            # print(len(self.server))

        elif command == "READY":
            await self.channel_layer.group_send(
                    self.room_name,{
                        "type": "client_ready",
                        "command": "CLIENT_READY",
                        "room_name": self.room_name,
                        "sender": sender,
                    }
                )

        elif command == "CREATE_ROOM":
            new_room = message  
            if new_room not in self.rooms:
                self.rooms[new_room] = 0 
                self.roomsAndUser[new_room] = {}
                self.roomsAndUser[new_room][sender] = {}
                await self.broadcast_room_list()
            await self.change_room(new_room, sender)
            # print("cr", self.server)

        elif command == "JOIN_ROOM":
            if room_to_join in self.rooms:
                await self.change_room(room_to_join, sender)
            else:
                await self.send(text_data=json.dumps({
                    "command": "ERROR",
                    "message": f"Room '{room_to_join}' does not exist.",
                    "sender": sender
                }))

        elif command == "JOIN_ROOM_SERVER":
            if room_to_join in self.rooms:
                await self.change_room(room_to_join, sender)
                await self.channel_layer.group_send(
                    self.room_name,  # ส่งแค่ให้กลุ่มของห้องที่เล่นเกม
                    {
                        "type": "game_started",
                        "command": "START_GAME",
                        "room_name": self.room_name,
                        "sender": sender
                    }
                )
            else:
                await self.send(text_data=json.dumps({
                    "command": "ERROR",
                    "message": f"Room '{room_to_join}' does not exist.",
                    "sender": sender
                }))
         

        elif command == "LEAVE_ROOM":
            if self.room_name:
                await self.leave_room()
            await self.send(text_data=json.dumps({
                "message": f"{sender} returned to lobby.",
                "command": "ROOM_LEFT",
                "sender": sender
            }))
            # print("lr", self.server)


        elif command == "START_GAME":
            if self.room_name in self.rooms:
                await self.channel_layer.send(
                    self.server["SERVERGAME"],
                    {
                        "type": "req_start_game",
                        "command": "START_GAME",
                        "room_name": self.room_name,
                        "sender": sender,
                        "playerInRoom":self.roomsAndUser[self.room_name]
                    }
                )
               
        elif command == "START":
            await self.channel_layer.group_send(
                    self.room_name,  # ส่งแค่ให้กลุ่มของห้องที่เล่นเกม
                    {
                        "type": "game_set_position",
                        "command": "START",
                        "room_name": self.room_name,
                        "sender": sender,
                        "message": message
                    }
                )
          

    async def game_set_position(self, event):
        await self.channel_layer.group_send(
            event["room_name"], 
            {
                "type": "broadcast_game_start",
                "command": "SET_POSITION",
                "room_name": event["room_name"],
                "sender": event["sender"],
                "message": event["message"]
            }
        )

    async def game_started(self, event):
        await self.channel_layer.group_send(
            event["room_name"], 
            {
                "type": "broadcast_game_start",
                "command": "START_GAME",
                "room_name": event["room_name"],
                "sender": event["sender"]
            }
        )

    async def game_started_server(self, event):
        await self.channel_layer.group_send(
            event["room_name"], 
            {
                "type": "broadcast_game_start",
                "command": "START_GAME_SERVER",
                "room_name": event["room_name"],
                "sender": event["sender"]
            }
        )

    async def broadcast_game_start(self, event):
        await self.send(text_data=json.dumps(event))

    async def broadcast_start_server(self, event):
        await self.send(text_data=json.dumps({
        "command": "GAME_START_CONFIG",
        "room_name": event["room_name"],
        "message": "request start game!"
        }))

    async def req_start_game(self, event):
        await self.send(text_data=json.dumps({
        "command": "GAME_START_CONFIG",
        "room_name": event["room_name"],
        "message": "request start game!",
        "playerInRoom": event.get("playerInRoom", [])
        }))

    
    async def client_ready(self, event):
        await self.send(text_data=json.dumps({
        "command": "CLIENT_READY",
        "room_name": event["room_name"],
        "message": "client ready!",
        "sender":event["sender"]
        }))

    async def change_room(self, new_room, sender):
        if self.room_name:
            await self.leave_room()

        self.room_name = new_room
        self.rooms[new_room] += 1  
        self.roomsAndUser[new_room][sender] = self.channel_name
        await self.channel_layer.group_add(new_room, self.channel_name)

        await self.send(text_data=json.dumps({
            "command": "REDIRECT_TO_ROOM",
            "room_name": new_room
        }))

        await self.player_count(self.room_name)


    async def leave_room(self):
        if self.room_name and self.room_name in self.rooms:
            await self.channel_layer.group_discard(self.room_name, self.channel_name)
            self.rooms[self.room_name] -= 1  # ลดจำนวนผู้ใช้ในห้อง
            
            for key in self.roomsAndUser[self.room_name]:
                if self.roomsAndUser[self.room_name][key] == self.channel_name:
                    del self.roomsAndUser[self.room_name][key]
                    break

            # print(self.roomsAndUser)
            # self.roomsAndUser[self.room_name] -= self.sender
            # if self.rooms[self.room_name] == 0:
            #     del self.rooms[self.room_name]  # ลบห้องถ้าไม่มีผู้ใช้เหลืออยู่
            #     await self.broadcast_room_list()
            self.room_name = None

        # await self.player_count(self.room_name)

    async def send_room_list(self):
        await self.send(text_data=json.dumps({
            "command": "ROOM_LIST",
            "rooms": list(self.rooms.keys())
        }))

    async def broadcast_room_list(self):
        await self.channel_layer.group_send(
            "lobby",
            {
                "type": "room_list_update",
                "rooms": list(self.rooms.keys())
            }
        )

    async def room_list_update(self, event):
        await self.send(text_data=json.dumps({
            "command": "ROOM_LIST",
            "rooms": event["rooms"]
        }))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "command": event["command"],
            "sender": event["sender"]
        }))

    async def player_count(self, room_name):
        count = self.rooms.get(room_name, 0) 

        message = {
            "command": "ROOM_CHANGED",
            "room_name": room_name,
            "player_count": count
        }

        await self.channel_layer.group_send(
            room_name,
            {
                "type": "room_player_update",
                "message": message
            }
        )

    async def room_player_update(self, event):
        """ ส่งข้อมูลอัปเดตจำนวนผู้เล่นให้ทุกคนในห้อง """
        await self.send(text_data=json.dumps(event["message"]))

