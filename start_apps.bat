@echo off
cd /d %~dp0

:MENU
color 0c
echo.
echo  -=-=-=- MENU -=-=-=-
echo Show choice as below-
echo 1. Web + API
echo 2. Mobile + API
echo 3. Web + Mobile + API
echo 0. Exit
echo.

set /p choice="Enter your choice: "

if %choice%==1 goto WA
if %choice%==2 goto MA
if %choice%==3 goto WMA
if %choice%==0 goto END

echo Invalid choice. Try again.
echo.
goto MENU

:WA
start cmd /k "cd backend-app && node server.js"
start cmd /k "cd frontend-app && npm run dev"
echo  ---- Web + API Running ----
goto MENU

:MA
start cmd /k "cd backend-app && node server.js"
start cmd /k "cd mobile-app && npm run dev"
echo  ---- Mobile + API Running ----
goto MENU

:WMA
start cmd /k "cd backend-app && node server.js"
start cmd /k "cd frontend-app && npm run dev"
start cmd /k "cd mobile-app && npm run dev"
echo  ---- Web + Mobile + API Running ----
goto MENU

:END
echo Process finished.