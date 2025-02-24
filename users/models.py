import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    character_name = models.CharField(max_length=50, unique=True, null=True, blank=True)  

    def __str__(self):
        return self.character_name if self.character_name else self.username
