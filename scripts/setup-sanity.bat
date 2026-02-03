@echo off
REM Sanity.io Setup Script for Disease Detection (Windows)
REM This script helps automate the initial setup

echo.
echo 🌾 Farm Management - Sanity.io Setup
echo ====================================
echo.

REM Check if we're in the right directory
if not exist "sanity" (
    echo ❌ Error: Please run this script from the project root directory
    exit /b 1
)

REM Step 1: Install Sanity dependencies
echo 📦 Step 1: Installing Sanity Studio dependencies...
cd sanity
call npm install
if errorlevel 1 (
    echo ❌ Failed to install Sanity dependencies
    exit /b 1
)
echo ✅ Sanity dependencies installed
echo.

REM Step 2: Install frontend dependencies
echo 📦 Step 2: Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

REM Step 3: Create .env.local if it doesn't exist
echo ⚙️  Step 3: Setting up environment variables...
if not exist ".env.local" (
    copy .env.local.example .env.local
    echo ✅ Created .env.local from example
    echo.
    echo ⚠️  IMPORTANT: Please edit frontend\.env.local and add your Sanity credentials:
    echo    - NEXT_PUBLIC_SANITY_PROJECT_ID
    echo    - NEXT_PUBLIC_SANITY_DATASET
    echo    - NEXT_PUBLIC_SANITY_API_VERSION
    echo.
) else (
    echo ℹ️  .env.local already exists
    echo.
)

REM Step 4: Instructions for Sanity project creation
echo 📝 Step 4: Create Sanity Project
echo ================================
echo.
echo To create a new Sanity project, run:
echo.
echo   cd sanity
echo   npm create sanity@latest
echo.
echo Follow the prompts and note your Project ID.
echo.
echo Then update frontend\.env.local with your credentials.
echo.

REM Step 5: Next steps
echo 🚀 Next Steps
echo =============
echo.
echo 1. Create Sanity project (see above)
echo 2. Update frontend\.env.local with your Sanity credentials
echo 3. Start Sanity Studio:
echo    cd sanity ^&^& npm run dev
echo.
echo 4. Add initial content in Sanity Studio (http://localhost:3333)
echo 5. Start frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 6. Visit the disease detection page to see your content!
echo.
echo 📚 For detailed instructions, see:
echo    - SANITY_SETUP.md
echo    - SANITY_INTEGRATION.md
echo.
echo ✨ Setup preparation complete!
echo.

cd ..
pause
