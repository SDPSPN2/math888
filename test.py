
# import asyncio
# import websockets
# import json

# async def test_websocket():
#     uri = "ws://localhost:8001/ws/game/"  # URL ของ WebSocket server ของ Django
#     async with websockets.connect(uri) as websocket:
#         # ส่งข้อความไปยัง Django server
#         await websocket.send(json.dumps({"message": "Hello from Python client!2222",
#                                          "group" : "game_room"}))
        
#         # รับข้อความจาก WebSocket server (Django)
#         response = await websocket.recv()
#         print(f"Received from Django: {response}")

# # รันฟังก์ชัน
# asyncio.run(test_websocket())
