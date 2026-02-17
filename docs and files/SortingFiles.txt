@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ==================================================
REM  SortingFiles.bat
REM  Automatically sorts files by extension
REM  Location: Same folder as this script
REM ==================================================

REM --------------------------------------------------
REM BASE DIRECTORY (where the script is located)
REM --------------------------------------------------
set "BASEDIR=%~dp0"

REM --------------------------------------------------
REM FOLDER NAMES (edit freely)
REM --------------------------------------------------
set "IMAGE_DIR=ImageFiles"
set "PDF_DIR=PdfFiles"
set "EXCEL_DIR=ExcelFiles"
set "VIDEO_DIR=VideoFiles"
set "ZIP_DIR=ZipFiles"
set "DOC_DIR=DocFiles"
set "APP_DIR=AppFiles"
set "CODE_DIR=CodeFiles"

REM --------------------------------------------------
REM FILE EXTENSIONS (space-separated, no dots)
REM --------------------------------------------------
set "IMAGE_EXT=png jpg jpeg ico webp"
set "PDF_EXT=pdf"
set "EXCEL_EXT=xls xlsx csv"
set "VIDEO_EXT=mp4 webm mp3"
set "ZIP_EXT=zip rar 7z tgz"
set "DOC_EXT=json txt doc docx pptx"
set "APP_EXT=apk exe vsix gguf winmd msi"
set "CODE_EXT=html htm js sql xsd css ttf cshtml map pbix rdlc nupkg"

REM ==================================================
REM CREATE FOLDERS IF THEY DO NOT EXIST
REM ==================================================
call :CreateFolder "%IMAGE_DIR%"
call :CreateFolder "%PDF_DIR%"
call :CreateFolder "%EXCEL_DIR%"
call :CreateFolder "%VIDEO_DIR%"
call :CreateFolder "%ZIP_DIR%"
call :CreateFolder "%DOC_DIR%"
call :CreateFolder "%APP_DIR%"
call :CreateFolder "%CODE_DIR%"

REM ==================================================
REM MOVE FILES BY EXTENSION
REM ==================================================
call :MoveFiles "%IMAGE_EXT%" "%IMAGE_DIR%"
call :MoveFiles "%PDF_EXT%"   "%PDF_DIR%"
call :MoveFiles "%EXCEL_EXT%" "%EXCEL_DIR%"
call :MoveFiles "%VIDEO_EXT%" "%VIDEO_DIR%"
call :MoveFiles "%ZIP_EXT%" "%ZIP_DIR%"
call :MoveFiles "%DOC_EXT%" "%DOC_DIR%"
call :MoveFiles "%APP_EXT%" "%APP_DIR%"
call :MoveFiles "%CODE_EXT%" "%CODE_DIR%"

echo.
echo Files sorted successfully.
pause
exit /b

REM ==================================================
REM FUNCTIONS
REM ==================================================

:CreateFolder
if not exist "%BASEDIR%%~1" (
    mkdir "%BASEDIR%%~1"
)
exit /b

:MoveFiles
for %%E in (%~1) do (
    move "%BASEDIR%*.%%E" "%BASEDIR%%~2\" >nul 2>&1
)
exit /b
