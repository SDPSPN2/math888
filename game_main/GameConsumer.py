import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
    rooms = {}  

    async def connect(self):
        self.room_name = None  
        await self.accept()

        await self.channel_layer.group_add("lobby", self.channel_name)
        await self.channel_layer.group_add("server", self.channel_name)

        await self.send_room_list()

    async def disconnect(self, close_code):
        if self.room_name:
            # pass
            await self.leave_room()


    async def receive(self, text_data):
        data = json.loads(text_data)
        command = data.get("command", "")
        sender = data.get("sender", "")
        message = data.get("message", "")
        room_to_join = data.get("room_name", "")

        # print(f"Received: command={command}, sender={sender}, message={message}")

        if command == "CREATE_ROOM":
            new_room = message  
            if new_room not in self.rooms:
                self.rooms[new_room] = 0 
                await self.broadcast_room_list()
            await self.change_room(new_room, sender)


        elif command == "JOIN_ROOM":
            if room_to_join in self.rooms:
                await self.change_room(room_to_join, sender)
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


        elif command == "START_GAME":
            if self.room_name in self.rooms:
                await self.channel_layer.group_send(
                    "server",
                    {
                        "type": "broadcast_start_server",
                        "command": "START_GAME",
                        "room_name": self.room_name,
                        "sender": sender
                    }
                )
            else:
                await self.send(text_data=json.dumps({
                    "command": "ERROR",
                    "message": f"Room '{self.room_name}' does not exist.",
                    "sender": sender
                }))

    

        # elif command == "GET_ROOM_LIST":
        #     await self.send_room_list()

        # else:
        #     if self.room_name:
        #         await self.channel_layer.group_send(
        #             self.room_name,
        #             {
        #                 "type": "chat_message",
        #                 "message": message,
        #                 "command": command,
        #                 "sender": sender
        #             }
        #         )
        #     else:
        #         await self.channel_layer.group_send(
        #             "lobby_broadcast",
        #             {
        #                 "type": "chat_message",
        #                 "message": f"[Lobby] {sender}: {message}",
        #                 "command": command,
        #                 "sender": sender
        #             }
        #         )

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

    async def broadcast_game_start(self, event):
        await self.send(text_data=json.dumps(event))

    async def broadcast_start_server(self, event):
        await self.send(text_data=json.dumps({
        "command": "GAME_START_CONFIG",
        "room_name": event["room_name"],
        "message": "request start game!"
        }))

    async def change_room(self, new_room, sender):
        if self.room_name:
            await self.leave_room()

        self.room_name = new_room
        self.rooms[new_room] += 1  
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

