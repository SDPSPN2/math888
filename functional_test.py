import unittest
from selenium import webdriver


class NewVisitorTest(unittest.TestCase):  
    def setUp(self):  
        self.browser = webdriver.Firefox()  

    def tearDown(self):  
        self.browser.quit()

    def test_can_start_a_math(self):  
       #Jump heard a game about math so he chose to visit the website
        self.browser.get("http://localhost:8000/game/")  

        #On the website there’s a title name math888
        self.assertIn("Math888", self.browser.title)  


        #He found a homepage with 3 difficult gameplay to choose easy, medium, hard 

        #Jump is a chill guy so he chose an easy one. 

        #There is a 2d gameplay with a textbox for typing 2 variables equation. 

        #Jump enter a random equation after that there is a beam rush out from his character to a random direction which is miss to the target. 

        #After the turn is switch to bot's turn bot shoot the same beam but this beam is miss Jump like 0.2px. 

        #Jump understand the gameplay so he calculate the equation for shooting the bot and this time the beam can get the target easily. 

        #The game end and there's an UI displaying Jump is winner



if __name__ == "__main__":  
    unittest.main()  