@echo off
title Deploy Yogsang to Vercel
cd /d "%~dp0"
echo ========================================================
echo Deploying Yogsang to Vercel...
echo ========================================================
echo.

npx vercel

echo.
pause
