from .GameEnvironment import GameEnvironment
from .Player import Player
import json
from channels.layers import get_channel_layer
from .GameConsumer import GameConsumer
import asyncio
from .WebSocketClient import WebSocketClient
import asyncio

class GameControl(Player, GameEnvironment):
    def __init__(self, maxX, maxY):
        super().__init__(maxX, maxY) 
        GameEnvironment.__init__(self, maxX, maxY)

        self.client =  WebSocketClient("ws://localhost:8001/ws/game/")
        
        self.targetPosition = self.generate_target_position(10)
        self.playerPosition = self.random_player_position() 
       