@echo off
title Push Yogsang to GitHub
cd /d "%~dp0"
echo ========================================================
echo Pushing Yogsang project to GitHub repository:
echo https://github.com/paithanpagareparth-ctrl/yogsang.git
echo ========================================================
echo.

git status
echo.
echo Pushing to branch main...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo SUCCESS: Project pushed to GitHub!
    echo You can now deploy on Vercel: https://vercel.com/new
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo Push encountered an issue. Please sign in if prompted.
    echo ========================================================
)

echo.
pause
