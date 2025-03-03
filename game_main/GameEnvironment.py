import random 

class GameEnvironment:
    def __init__(self, maxX, maxY):
        self.maxX = maxX
        self.maxY = maxY

    def generate_target_position(self, num:int):
        position = []
        for i in range(0, num):
            x = random.randint(1, self.maxX)
            y = random.randint(-self.maxY, self.maxY)

            position.append([x,y])
# 
        return position
    
