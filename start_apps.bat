@echo off
cd /d %~dp0

:MENU
color 0e
echo.
echo  -=-=-=- MENU -=-=-=-
echo Show choice as below-
echo 1. Web + API + Docs (active)
echo 2. Mobile + API
echo 3. Web + Mobile + API
echo 4. Web
echo 5. Suite + API
echo 6. Docs (active)
echo 7. API + vMart
echo 0. Exit
echo.

set /p choice="Enter your choice: "

if %choice%==1 goto WA
if %choice%==2 goto MA
if %choice%==3 goto WMA
if %choice%==4 goto W
if %choice%==5 goto M
if %choice%==6 goto DOC
if %choice%==7 goto vMart
if %choice%==0 goto END

echo Invalid choice. Try again.
echo.
goto MENU

:WA
start cmd /k "cd backend-app && node server.js"
start cmd /k "cd app-web && npm run dev"
rem start cmd /k "cd app-docs && npm start"
echo  ---- Web + API + Docs Running ----
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

:W
start cmd /k "cd frontend-app && npm run dev"
echo  ---- Web Running ----
goto MENU

:M
start cmd /k "cd backend-app && node server.js"
start cmd /k "cd app-suite && npm run dev"
echo  ---- Suite + API Running ----
goto MENU

:DOC
start cmd /k "cd app-docs && npm start"
echo  ---- DOC Running ----
goto MENU

:vMart
start cmd /k "cd backend-app && node server.js"
start cmd /k "cd vmart-app && npm run dev"
echo  ---- vMart + API Running ----
goto MENU

:END
echo Process finished.