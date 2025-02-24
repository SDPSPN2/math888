from users.models import CustomUser

# ลบข้อมูลทั้งหมดใน CustomUser
CustomUser.objects.all().delete()
