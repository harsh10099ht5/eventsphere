@echo off

echo Starting EventSphere...

start "EventSphere Backend" cmd /k "cd /d C:\Users\Harshit Tripathi\Documents\EventSync\eventsphere\backend && node server.js"

start "EventSphere ML" cmd /k "cd /d C:\Users\Harshit Tripathi\Documents\EventSync\eventsphere\python-ai && call venv\Scripts\activate && python app.py"

start "EventSphere Frontend" cmd /k "cd /d C:\Users\Harshit Tripathi\Documents\EventSync\eventsphere\frontend && npm run dev"

echo.
echo EventSphere services started.
echo Backend: http://localhost:5000
echo ML:      http://localhost:5001
echo Frontend: http://localhost:5173
echo.
pause