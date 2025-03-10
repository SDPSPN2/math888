release: python manage.py makemigrations users && python manage.py migrate
release: python manage.py makemigrations
release: python manage.py migrate
web: daphne graphGame.asgi:application --port $PORT --bind 0.0.0.0 
worker: python manage.py runworker channels --settings=graphGame.settings 