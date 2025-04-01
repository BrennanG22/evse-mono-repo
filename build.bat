@echo off
setlocal enabledelayedexpansion

echo Starting Next.js build...
pushd next-app
CALL npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Next.js build failed.
    exit /b %ERRORLEVEL%
)
popd

echo Next.js build completed.

echo Compiling TypeScript for modbus-app...
CALL npx tsc --project modbus-app/tsconfig.json
if %ERRORLEVEL% neq 0 (
    echo ERROR: TypeScript compilation failed.
    exit /b %ERRORLEVEL%
)

echo TypeScript compilation completed.

echo Checking if .env file exists...
if exist modbus-app\src\.env (
    echo Copying .env file...
    copy /Y modbus-app\src\.env modbus-app\out\
) else (
    echo WARNING: .env file not found! Skipping copy.
)

echo Starting Docker build...
docker build -t evse-app -f docker/Dockerfile .
if %ERRORLEVEL% neq 0 (
    echo ERROR: Docker build failed.
    exit /b %ERRORLEVEL%
)

echo Docker build completed successfully.

endlocal
