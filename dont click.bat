@echo off
echo Starting Hotel Management System...

:: Start Backend
echo Starting Backend Server...
start "Hotel Backend" cmd /k "cd backend && mvn spring-boot:run"

:: Start Frontend
echo Starting Frontend Client...
start "Hotel Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ---------------------------------------------------
echo Services are starting in separate windows.
echo Backend URL: http://localhost:8080
echo Frontend URL: http://localhost:5173
echo ---------------------------------------------------
echo.
pause
