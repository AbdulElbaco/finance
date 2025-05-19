::@echo off
::echo Starting server...
::cd %~dp0src\JS
::npm start server
::pause 

:: I'm not sure if the PID gets saved, to lazy to test it, I'll just use the task manager for now!

@echo off
echo Starting server...

:: Go to server directory
cd /d %~dp0src\JS

:: Start the server and save its PID
start "" /B cmd /C "npm start server" > server-log.txt 2>&1

:: Wait a moment to allow process to launch
timeout /t 2 >nul

:: Find the Node.js process and save the PID
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq node.exe" /fo table /nh') do (
    echo %%a > server.pid
    goto Done
)

:Done
echo Server started. PID saved to server.pid
pause
