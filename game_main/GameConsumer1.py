import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "chatroom"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        command = data["command"]
        sender = data["sender"]
        recipient = data["recipient"]
        

        print(f"Received message: {message}, command: {command}")

        # ส่งข้อความไปยังทุกคนในห้อง
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": message,
                "command": command,
                "sender": sender,
                "recipient": recipient
            }
        )

    async def chat_message(self, event):
        # ส่งทั้ง message และ command ไปยัง client
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "command": event["command"],
            "sender": event["sender"],
            "recipient": event["recipient"]
        }))
32

