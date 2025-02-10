import random

class Player:
    def __init__(self, maxX, maxY):
        self.maxX = maxX   
        self.maxY = maxY   

        self.player_status = True

    def random_player_position(self):
        x = random.randint(-self.maxX, self.maxX)
        y = random.randint(-self.maxY, self.maxY)
        return [x, y]

    def set_player_dead(self):
        self.player_status = False

    def set_player_alive(self):
        self.player_status = True

    def get_player_status(self):
        return self.player_status

