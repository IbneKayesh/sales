@echo off
cd /d %~dp0
 
:START
color 0b
echo  -=-=-=- START -=-=-=-
echo Checking git status...
git status
goto MENU

:MENU
echo.
echo.
echo  -=-=-=- MENU -=-=-=-
echo Show choice as below-
echo 1. Check git status
echo 2. Add all changes
echo 3. Add all changes, write commit message and push
echo 4. Auto commit and push
echo 5. Pull changes
echo 0. Exit
echo.

set /p choice="Enter your choice: "

if %choice%==1 goto STATUS
if %choice%==2 goto ADD
if %choice%==3 goto COMMIT
if %choice%==4 goto AUTO_COMMIT
if %choice%==5 goto PULL
if %choice%==0 goto END

echo Invalid choice. Try again.
echo.
goto MENU

:STATUS
git status
echo  ---- STATUS Executed ----
goto MENU

:ADD
git add .
echo  ---- ADD Executed ----
goto MENU

:COMMIT
set /p msg="Write commit message: "
if "%msg%"=="" goto COMMIT
git add .
git commit -m "%msg%"
git push
echo  ---- COMMIT Executed ----
goto MENU


:AUTO_COMMIT
git add .
git commit -m "Auto commit"
git push
echo  ---- AUTO COMMIT Executed ----
goto MENU

:PULL
git pull
echo  ---- PULL Executed ----
goto MENU

:END
echo Process finished.