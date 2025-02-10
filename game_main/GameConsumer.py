import json
from channels.generic.websocket import WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = "game_room"
        self.room_group_name = f"{self.room_name}"

        async_to_sync( self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
 
        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':message,
            }
        )
        print(message)

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type':'chat',
            'message':message
        }))
