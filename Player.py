import random

class Player:
    def __init__(self, maxX, maxY, data):
        self.maxX = maxX   
        self.maxY = maxY   

        self.player_status = True

        self.__position = self.random_player_position(data)

    def random_player_position(self, data):
        if(data):
            x = random.randint(-self.maxX, -1)
            y = random.randint(-self.maxY, self.maxY)
        else:
            x = random.randint(1, self.maxX)
            y = random.randint(-self.maxY, self.maxY)

        return [x, y]
    
    def get_player_position(self):
        return self.__position

    def set_player_dead(self):
        self.player_status = False

    def set_player_alive(self):
        self.player_status = True

    def get_player_status(self):
        return self.player_status

