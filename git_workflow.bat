@echo off
cd /d %~dp0

:START
echo Checking git status...
git status

set /p choice1="Press A to add all changes or N to exit: "
if /I "%choice1%"=="N" goto END
if /I "%choice1%"=="A" goto ADD

echo Invalid choice. Try again.
goto START

:ADD
git add .
set /p choice2="Press C to commit now or N to exit: "
if /I "%choice2%"=="N" goto END
if /I "%choice2%"=="C" goto COMMIT

echo Invalid choice. Try again.
goto ADD

:COMMIT
set /p msg="Write commit message: "
git commit -m "%msg%"
git push
echo Changes pushed!
goto END

:END
echo Process finished.
pause
