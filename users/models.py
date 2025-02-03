from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    character_name = models.CharField(max_length=50, unique=True, null=True, blank=True)  # ชื่อตัวละคร

    def __str__(self):
        return self.character_name if self.character_name else self.username 

