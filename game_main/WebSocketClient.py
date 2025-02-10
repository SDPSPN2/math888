import asyncio
import json
import websockets

class WebSocketClient:
    def __init__(self, uri):
        self.uri = uri
        self.websocket = None

    async def connect(self):
        self.websocket = await websockets.connect(self.uri)

    async def send(self, message, group):
        if self.websocket:
            data = json.dumps({"message": message, "group": group})
            await self.websocket.send(data)
        else:
            print("WebSocket is not connected.")

    async def receive(self):
        if self.websocket:
            response = await self.websocket.recv()
            return response
        else:
            print("WebSocket is not connected.")
            return None

    async def close(self):
        if self.websocket:
            await self.websocket.close()
            self.websocket = None
