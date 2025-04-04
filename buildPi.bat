@echo off
setlocal enabledelayedexpansion

:: =============================================
:: Build Next.js and TypeScript
:: =============================================
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

:: =============================================
:: Environment Setup
:: =============================================
echo Checking if .env file exists...
if exist modbus-app\src\.env (
    echo Copying .env file...
    copy /Y modbus-app\src\.env modbus-app\out\
) else (
    echo WARNING: .env file not found! Skipping copy.
)

:: =============================================
:: Docker Build (ARMv7 with .tar export)
:: =============================================
echo Initializing Docker Buildx...
docker buildx create --use --name multiarch_builder 2>nul
docker buildx inspect --bootstrap

echo.
echo Building for Raspberry Pi (arm/v7) and exporting to .tar...
set TIMESTAMP=%DATE:~-4%-%DATE:~4,2%-%DATE:~7,2%_%TIME:~0,2%-%TIME:~3,2%
set TAR_FILE=evse-app_armv7_%TIMESTAMP%.tar

:: Build and export to .tar
docker buildx build --platform linux/arm/v7 -t evse-app:armv7 -f docker/Dockerfile --output type=docker,dest=builds/%TAR_FILE% .

if %ERRORLEVEL% neq 0 (
    echo ERROR: Docker build failed.
    exit /b %ERRORLEVEL%
)

echo Docker image successfully exported to: %TAR_FILE%


:: Cleanup (optional)
docker buildx rm multiarch_builder 2>nul

endlocal