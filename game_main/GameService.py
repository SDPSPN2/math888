import random

class GameControl:
    def __init__(self, maxX, maxY):
        self.maxX = maxX
        self.maxY = maxY
        self.targetPosition = self.generate_target_position(1)
        self.playerPosition = self.random_player_position()

    def generate_target_position(self, num_targets):
        return [[random.randint(1, self.maxX), random.randint(-self.maxY, self.maxY)] for _ in range(num_targets)]

    def random_player_position(self):
        x = random.randint(-self.maxX, -1)
        y = random.randint(-self.maxY, self.maxY)
        return [x, y]

class Player:
    def __init__(self, maxX, maxY, username):
        self.username = username
        self.maxX = maxX
        self.maxY = maxY
        self.game_control = GameControl(maxX, maxY)
        self.player_status = True

    def set_player_dead(self):
        self.player_status = False

    def set_player_alive(self):
        self.player_status = True

    def get_player_status(self):
        return self.player_status

    def get_player_position(self):
        return self.game_control.playerPosition

    def get_target_position(self):
        return self.game_control.targetPosition


class GameService:
    def __init__(self):
        self.players_data = {}

    def create_new_player(self, username, maxX=20, maxY=10):
        if username in self.players_data:
            return {'status': 'error', 'message': 'Username already exists'}
        player = Player(maxX, maxY, username)
        self.players_data[username] = player
        return {'status': 'success', 'message': f'Player {username} created successfully'}

    def get_game_status(self, username):
        player = self.players_data.get(username)
        if player:
            return {
                "username": username,
                "targetPosition": player.get_target_position(),
                "playerPosition": player.get_player_position(),
                "playerStatus": player.get_player_status()
            }
        return {'status': 'error', 'message': 'Player not found'}

    def delete_enemy(self, username, point_to_delete):
        player = self.players_data.get(username)
        if player:
            if point_to_delete in player.get_target_position():
                player.game_control.targetPosition.remove(point_to_delete)

                # เช็คว่าถ้าศัตรูหมดแล้วให้ส่งว่า "win"
                if not player.game_control.targetPosition:
                    return {'status': 'win', 'message': 'All enemies defeated! You win!'}

                return {'status': 'success', 'message': 'Point deleted successfully'}
            return {'status': 'error', 'message': 'Point not found'}
        return {'status': 'error', 'message': 'Player not found'}


    def solve_point(self, expr, player_point, max_x):
        data = []
        for i in range(player_point[0], max_x):
            x = i
            y = eval(expr)
            data.append([x * 40, y * 40])
        return data

    def calculate(self, username, equation):
        player = self.players_data.get(username)
        if not player:
            return {'status': 'error', 'message': 'Player not found'}
        
        points_array = []
        try:
            eq = equation.replace("y=", "").strip()
            points_array = self.solve_point(str(eq), [0, 0], 50)
        except Exception as e:
            return {'status': 'error', 'message': f"Error processing equation: {e}"}
        return {'status': 'success', 'points': points_array}
    
    def botAttach(self, equation):
        points_array = []
        botRand = random.uniform(-4.0, 4.0)
        eq = f"{botRand}*x"
        try:
            points_array = self.solve_point(str(eq), [0, 0], 50)
        except Exception as e:
            return {'status': 'error', 'message': f"Error processing equation: {e}"}
        return {'status': 'success', 'points': points_array}

