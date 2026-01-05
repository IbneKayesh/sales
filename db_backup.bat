@echo off
REM Backup PostgreSQL DB in current folder with timestamp

SET PGPASSWORD=123
SET DB_NAME=shopDb
SET DB_USER=postgres

REM Current folder
SET BACKUP_DIR=%~dp0

REM Get date and time in format YYYYMMDD_HHMMSS
SET DT=%DATE:~-4%%DATE:~3,2%%DATE:~0,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
REM Remove spaces (time may have leading space)
SET DT=%DT: =0%

REM Backup filename
SET BACKUP_FILE=%BACKUP_DIR%shopDb-%DT%.sql

REM Run pg_dump (adjust path if needed)
"C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U %DB_USER% -d %DB_NAME% -F p -f "%BACKUP_FILE%"

echo Backup complete: %BACKUP_FILE%
pause
