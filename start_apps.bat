@echo off
echo Starting backend and frontend...

:: Start backend
start cmd /k "cd backend-app && node server.js"

:: Start frontend
start cmd /k "cd frontend-app && npm run dev"

echo Both apps are starting...
pause
