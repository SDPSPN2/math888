from GameEnvironment import GameEnvironment
from Player import Player
import websocket,json,threading,random
# import websockets
import os

host = os.environ.get("HOST", "graphgame-821c09cecdee.herokuapp.com")

class GameController:
    def __init__(self, maxX, maxY, roomName, userInRoom):
        self.maxX = maxX
        self.maxY = maxY
        self.player1 = Player(maxX, maxY, True)
        self.player2 = Player(maxX, maxY, False)

        print(userInRoom)
        
        self.round = True
        self.Ready = False

        self.roomName = roomName
        self.userInRoom = userInRoom

        self.ws = websocket.WebSocketApp(
           f"wss://{host}/ws/game/server/",
            on_message=self.on_message,
            on_open=self.on_open
        )

        self.data = []
        self.ws_thread = threading.Thread(target=self.ws.run_forever, daemon=True)
        self.ws_thread.start()
        self.stateCal = False
        self.p1 = ""
        self.p2 = ""
        self.dataInP1 = False
        self.dataInP2 = False
        self.eq1 = ""
        self.counter = 0
        self.counterUser = 0
        self.endGame = False

    def join_room(self):
        message = json.dumps({"command": "JOIN_ROOM_SERVER",
                              "room_name": self.roomName,
                              "sender" : self.roomName,
                              })
        self.ws.send(message)

    def on_message(self, ws, message):
        # self.round = not self.round
        data = json.loads(message)
        message_text = data.get("message")
        command = data.get("command")
        sender = data.get("sender")
        recipient = data.get("recipient")

        if(command == "CLIENT_READY"):
            self.counterUser +=1

        elif(command == "SW_ROUND"):
            self.round = not self.round
            print(self.round)

        elif(command == "endGame"):
            print("endGame")
            self.endGame = True
        
        elif (command == "EQUATION"):
            if(sender == self.p1):
                # print(f"p1: {sender}")
                self.eq1 = str(message_text).replace("y=", "").strip()
                # print(f"eq = {self.eq1}")
                self.dataInP1 = True

            elif (sender == self.p2):
                self.eq2 = str(message_text).replace("y=", "").strip()
                self.dataInP2 = True
                print(f"p2: {sender}")

            self.counter+=1

    def on_open(self, ws):
        self.join_room()
        print("Connected to ROOM SERVER")

    
    def solvePoint(self, expr, maxX):
        data = []
        # data.append([playerPoint[0]*40, playerPoint[1]*40])

        for i in range(0, maxX):
            x = i
            y = eval(expr)
            data.append([x*40,y*40])

        return data
    
    def solvePointEnemy(self, expr, minX):
        data = []
        # data.append([playerPoint[0]*40, playerPoint[1]*40])

        for i in range(0, minX, -1):
            x = i
            y = eval(expr)
            data.append([x*40,y*40])

        return data

    def sendGraph(self, sender, recipient, data, shootStatus):
        message = json.dumps({"message": data,
                              "command": "DRAW",
                              "sender" : sender,
                              "recipient": recipient,
                              "shootStatus":shootStatus
                              })
        self.ws.send(message)

    def sendRound(self, sender,  data, room_name):
        message = json.dumps({"message": data,
                              "command": "ROUND_SET",
                              "sender" : sender,
                              "room_name": room_name,
                              })
        self.ws.send(message)

    def run(self):
        while self.counterUser < len(self.userInRoom):
            pass

        userName = list(self.userInRoom.keys())
        if(len(userName) == 2):
            self.p1 = userName[0]
            self.p2 = userName[1]
        else:
            self.p1 = userName[0]
            self.p2 = "bot"


        message = json.dumps({"message": f"{self.p1}:{self.player1.get_player_position()}|{self.p2}:{self.player2.get_player_position()}",
                              "command": "START",
                              "sender" : "PLAYER",
                              "recipient": "all",
                              })
        
        self.ws.send(message)


        while True:
            
            if not self.player1.get_player_status() or not self.player2.get_player_status():
                break

            if(self.endGame):
                print("endGame")
                break

            if self.round:
                self.sendRound("SERVER", self.p1, self.roomName)
                while(not self.dataInP1):
                    pass
                
                point_data = self.solvePoint(self.eq1, 50)
                # shootingStatus, point = self.checkTarget(point_data, self.player1.get_player_position())
                
                self.sendGraph("SERVER", self.p1, point_data, False)

                self.dataInP1 = False

                while(self.round):
                    pass
                

            else:
                self.sendRound("SERVER", self.p2, self.roomName)
                if(len(userName) == 2):
                    while not self.dataInP2:
                        pass

                    print("round p2", self.round)

                    point_data = self.solvePoint(self.eq2, 50)

                    self.sendGraph("SERVER", self.p2, point_data, False)

                    self.dataInP2 = False

                    while(not self.round):
                        pass

                else:
                    point_data = self.solvePoint(f"{random.uniform(-4, 4)}*x", 50)
                    self.sendGraph("SERVER", self.p2, point_data, False)
                    self.round = not self.round
                    
            

rooms = [] 
thread = []
client_id = 0
userName = "SERVERGAME"

def on_message(ws, message):
   
    data = json.loads(message)
    message_text = data.get("message")
    command = data.get("command")
    sender = data.get("sender")
    recipient = data.get("recipient")
    roomUser = data.get("playerInRoom")
    roomName = data.get("room_name")

    # print(data)

    counter = 0

    if command == "GAME_START_CONFIG" and roomName not in rooms:
        rooms.append(roomName)
        # print("run", roomUser)
        GC = GameController(10, 10, roomName, roomUser)
        t = threading.Thread(target=GC.run)
        t.start()


def on_open(ws):
    print(f"[Client {client_id}] Connected to WebSocket")

    message = json.dumps({
        "command": "SERVERCONECTION",
        "sender": "SERVERGAME",
    })
        
    ws.send(message)
  
ws = websocket.WebSocketApp(
    f"wss://graphgame-821c09cecdee.herokuapp.com/ws/game/server/",
    on_message=on_message,
    on_open=on_open
)

ws.run_forever()
