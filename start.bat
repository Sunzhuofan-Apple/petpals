@echo off

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
pip install -r requirements.txt

REM Run database migrations
python petpal\manage.py makemigrations
python petpal\manage.py migrate

REM Start Django development server
python petpal\manage.py runserver