@echo off
title WEB TMDT - SETUP AND RUN
color 0A

echo ==================================================
echo   HE THONG THUONG MAI DIEN TU - TEAM 2
echo   Huong dan: Chay file nay de cai dat va khoi dong
echo ==================================================
echo.

:: 1. Kiem tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [LOI] Chua cai dat Node.js!
    echo Vui long tai Node.js tai https://nodejs.org/
    pause
    exit
)

:: 2. Kiem tra file .env
if not exist ".env" (
    color 0E
    echo [CANH BAO] Khong tim thay file .env!
    echo Vui long hoi Truong nhom xin file .env va chep vao day.
    echo (Nhan Enter neu ban muon tiep tuc chay du an...)
    pause
)

:: 3. Cai dat thu vien
if not exist "node_modules" (
    echo.
    echo [1/3] Dang cai dat thu vien (npm install)...
    echo Viec nay co the mat vai phut...
    call npm install
) else (
    echo.
    echo [1/3] Thu vien da duoc cai dat. Bo qua.
)

:: 4. Prisma Generate
echo.
echo [2/3] Dong bo Database (Prisma)...
call npx prisma generate

:: 5. Chay Server
echo.
echo [3/3] Dang khoi dong Server...
echo --------------------------------------------------
echo Truyen cap Local:   http://localhost:3000
echo --------------------------------------------------
echo Nhan Ctrl + C de dung server.
echo.

:: Chay lenh share de mo mang LAN luon cho tien
call npm run share

pause
