import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
import random
import time

from PIL import Image, ImageChops
import numpy as np



class NewVisitorTest(unittest.TestCase):  
    def setUp(self):  
        self.browser = webdriver.Firefox()  
        self.browser.maximize_window()  # เปิดเว็บแบบเต็มหน้าจอ


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
         #Jump heard a game about math so he chose to visit the website
        self.browser.get("http://localhost:8000/")  

        #On the website there’s a title name math888
        self.assertIn("Math888", self.browser.title)  

        #He found a homepage with a text saying "Click to Start".
        content_div = self.browser.find_element("xpath", "//div[@class='content']")
        content_div.click()

        #Since Jump hadn’t logged in yet, the system redirected him to the login page.
        self.assertIn("Login", self.browser.title)  

        # But since Jump didn’t have an account, he clicked on Register.
        register_link = self.browser.find_element("xpath", "//div[@class='registerAccount']/a")
        register_link.click()
        self.assertIn("Register", self.browser.title)  


        userNum = random.randint(0,999999)
        username = "test" + str(userNum)
        charactername = "betaTester" + str(userNum)
        email = f"test{userNum}@gmail.com"
        password = 1234

    #   Then, Jump entered his information to sign up for the game.
        self.browser.find_element(By.NAME, "username").send_keys(username)
        self.browser.find_element(By.NAME, "charactername").send_keys(charactername)
        self.browser.find_element(By.NAME, "email").send_keys(email)
        self.browser.find_element(By.NAME, "password1").send_keys(password)
        self.browser.find_element(By.NAME, "password2").send_keys(password)

        self.browser.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        # When he clicked the Submit button, the system redirected Jump to the login page.
        # Jump entered his credentials and clicked Login.

        self.assertIn("Login", self.browser.title)  


           
        self.browser.find_element(By.NAME, "username").send_keys(username)
        self.browser.find_element(By.NAME, "password").send_keys(password)
        self.browser.find_element(By.CSS_SELECTOR, "button[type='submit']").click()


         # The system then brought Jump back to the homepage.
        self.assertIn("Math888", self.browser.title)  

        # Now, check if the username is displayed in the homepage
        user_display = self.browser.find_element(By.CSS_SELECTOR, ".text-white.me-3")
        self.assertIn(f"Username {username}", user_display.text)

        print(username, password)
        

        #He found a homepage with 3 difficult gameplay to choose easy, medium, hard 

        #Jump is a chill guy so he chose an easy one. 

        #There is a 2d gameplay with a textbox for typing 2 variables equation. 

        #Jump enter a random equation after that there is a beam rush out from his character to a random direction which is miss to the target. 

        #After the turn is switch to bot's turn bot shoot the same beam but this beam is miss Jump like 0.2px. 

        #Jump understand the gameplay so he calculate the equation for shooting the bot and this time the beam can get the target easily. 

        #The game end and there's an UI displaying Jump is winner

    def crop_image_test(self, img1, img2):
            before = Image.open(img1)
            after = Image.open(img2)

            width, height = before.size


            top = 50
            bottom = height - 50
            canvas_box = (0, top, width, bottom)

            # Crop ภาพตามที่กำหนด
            cropped_before = before.crop(canvas_box)
            cropped_after = after.crop(canvas_box)

            # บันทึกภาพ cropped
            cropped_before.save(img1)
            cropped_after.save(img2)


    def test_draw_graph(self):
        self.browser.get("http://127.0.0.1:8000/game/")
        self.assertIn("Math888", self.browser.title)

        img1 = "before.png"
        img2 = "after.png"

        canvas = self.browser.find_element(By.ID, "graphCanvas")
        time.sleep(2)
        canvas.screenshot(img1)

        equation_input = self.browser.find_element(By.ID, "equationInput")
        equation_input.send_keys("y= 2*x")

        plot_button = self.browser.find_element(By.ID, "plotButton")
        plot_button.click()

 
        time.sleep(2)
        canvas.screenshot(img2)

        self.crop_image_test(img1, img2)

        # โหลดภาพ
        before = Image.open("before.png")
        after = Image.open("after.png")

        # คำนวณความแตกต่างของภาพ
        diff = ImageChops.difference(before, after)

        diff_array = np.array(diff)

        # เช็คว่ามีพิกเซลที่แตกต่างกันหรือไม่
        is_different = np.any(diff_array > 0)  

        self.assertTrue(is_different, "Canvas ไม่เปลี่ยนแปลงหลังจากวาดกราฟ")

    def test_not_draw_graph(self):
        self.browser.get("http://127.0.0.1:8000/game")
        self.assertIn("Math888", self.browser.title)

        img1 = "before_not_draw.png"
        img2 = "after_not_draw.png"

        canvas = self.browser.find_element(By.ID, "graphCanvas")
        time.sleep(2)
        canvas.screenshot(img1)
        time.sleep(2)
        canvas.screenshot(img2)

        self.crop_image_test(img1, img2)
        # โหลดภาพ
        before = Image.open(img1)
        after = Image.open(img2)

        # คำนวณความแตกต่างของภาพ
        diff = ImageChops.difference(before, after)
        diff_array = np.array(diff)

        # เช็คว่ามีพิกเซลที่แตกต่างกันหรือไม่
        is_different = np.any(diff_array > 0)  

        # ถ้าภาพไม่เปลี่ยนแปลง ต้อง assertFalse
        self.assertFalse(is_different, "Canvas สั่งไม่วาดเเล้วยังวาด")
    
    def test_shoot_hit(self):
        self.browser.get("http://127.0.0.1:8000/game/test")
        self.assertIn("Math888", self.browser.title)

        img1 = "before_shoot.png"
        img2 = "after_shoot.png"

        canvas = self.browser.find_element(By.ID, "graphCanvas")
        time.sleep(2)
        canvas.screenshot(img1)

        equation_input = self.browser.find_element(By.ID, "equationInput")
        equation_input.send_keys("y= x")

        plot_button = self.browser.find_element(By.ID, "plotButton")
        plot_button.click()

        time.sleep(2)
        canvas.screenshot(img2)

        self.crop_image_test(img1, img2)

        before = Image.open(img1)
        after = Image.open(img2)

        found_red_pixel = False

        for pixel in after.getdata():

            if pixel == (255, 0, 0, 255):  # RGBA = red
                found_red_pixel = True
                break

        self.assertFalse(found_red_pixel, "สั่งยิงโดนเเต่เป้าไม่หาย")


    def test_shoot_not_hit(self):
        self.browser.get("http://127.0.0.1:8000/game/test")
        self.assertIn("Math888", self.browser.title)

        img1 = "before_shoot.png"
        img2 = "after_shoot.png"

        canvas = self.browser.find_element(By.ID, "graphCanvas")
        time.sleep(2)
        canvas.screenshot(img1)

        equation_input = self.browser.find_element(By.ID, "equationInput")
        equation_input.send_keys("y= -x")

        plot_button = self.browser.find_element(By.ID, "plotButton")
        plot_button.click()

        time.sleep(2)
        canvas.screenshot(img2)

        self.crop_image_test(img1, img2)

        # โหลดภาพ
        before = Image.open(img1)
        after = Image.open(img2)


        found_red_pixel = False

        for pixel in after.getdata():

            if pixel == (255, 0, 0, 255):  # RGBA = red
                found_red_pixel = True
                break

        self.assertTrue(found_red_pixel, "ยิงไม่โดนเเต่เป้าหาย")



if __name__ == "__main__":  
    unittest.main()  
