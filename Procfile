release: python manage.py makemigrations
release: python manage.py migrate
release: python manage.py makemigrations users
release: python manage.py migrate
web: daphne graphGame.asgi:application --port 13433 --bind 0.0.0.0 -v2
worker: python manage.py runworker channels --settings=graphGame.settings -v2