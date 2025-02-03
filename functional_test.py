import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By



class NewVisitorTest(unittest.TestCase):  
    def setUp(self):  
        self.browser = webdriver.Firefox()  

    def tearDown(self):  
        self.browser.quit()

    def test_can_start_a_math(self):  
        #Jump heard a game about math so he chose to visit the website
        #On the website there’s a title name math888
        self.browser.get("http://localhost:8000")  
        self.assertIn("Math888", self.browser.title)
        
    def test_login_page_elements_are_present(self):
        #Jump found out there's a login homepage he's decide to sign in then login into the website
        self.browser.get("http://localhost:8000/users/login")
        login_form = self.browser.find_element(By.CLASS_NAME, 'login-form')
        self.assertIsNotNone(login_form)

        username_field = self.browser.find_element(By.NAME, 'username')
        self.assertIsNotNone(username_field)
        
        password_field = self.browser.find_element(By.NAME, 'password')
        self.assertIsNotNone(password_field)
        
        login_button = self.browser.find_element(By.CLASS_NAME, 'btn-primary')
        self.assertIsNotNone(login_button)
        
    def test_register_page_elements_are_present(self):
        self.browser.get("http://localhost:8000/users/register")
        
        register_form = self.browser.find_element(By.CLASS_NAME, 'register-form')
        self.assertIsNotNone(register_form)

        username_field = self.browser.find_element(By.NAME, 'username')
        self.assertIsNotNone(username_field)

        charactername_field = self.browser.find_element(By.NAME, 'charactername')
        self.assertIsNotNone(charactername_field)

        email_field = self.browser.find_element(By.NAME, 'email')
        self.assertIsNotNone(email_field)

        password_field = self.browser.find_element(By.NAME, 'password1')
        self.assertIsNotNone(password_field)

        confirm_password_field = self.browser.find_element(By.NAME, 'password2')
        self.assertIsNotNone(confirm_password_field)

        register_button = self.browser.find_element(By.CLASS_NAME, 'btn-primary')
        self.assertIsNotNone(register_button)

        login_link = self.browser.find_element(By.LINK_TEXT, 'Login')
        self.assertIsNotNone(login_link)

        #He found a homepage with 3 difficult gameplay to choose easy, medium, hard 

        #Jump is a chill guy so he chose an easy one. 

        #There is a 2d gameplay with a textbox for typing 2 variables equation. 

        #Jump enter a random equation after that there is a beam rush out from his character to a random direction which is miss to the target. 

        #After the turn is switch to bot's turn bot shoot the same beam but this beam is miss Jump like 0.2px. 

        #Jump understand the gameplay so he calculate the equation for shooting the bot and this time the beam can get the target easily. 

        #The game end and there's an UI displaying Jump is winner



if __name__ == "__main__":  
    unittest.main()  
