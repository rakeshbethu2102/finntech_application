# FinTech Application - Pre-deployment Tests (PowerShell)
Write-Host "🧪 FinTech Application - Pre-deployment Tests" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Test Functions
function Test-NodeJS {
    Write-Host "[TEST] Checking Node.js version..." -NoNewline
    try {
        $version = node --version
        $majorVersion = [int]($version -replace '^v', '' -split '\.')[0]
        if ($majorVersion -ge 16) {
            Write-Host " PASS - Node.js $version" -ForegroundColor Green
            return $true
        } else {
            Write-Host " FAIL - Node.js version too old. Need v16+" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host " FAIL - Node.js not found" -ForegroundColor Red
        return $false
    }
}

function Test-NPM {
    Write-Host "[TEST] Checking npm..." -NoNewline
    try {
        $version = npm --version
        Write-Host " PASS - npm v$version" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " FAIL - npm not found" -ForegroundColor Red
        return $false
    }
}

function Test-BackendDeps {
    Write-Host "[TEST] Checking backend dependencies..." -NoNewline
    Push-Location backend
    try {
        npm list --depth=0 | Out-Null
        Write-Host " PASS - Backend dependencies OK" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " FAIL - Backend dependencies missing. Run 'npm install' in backend/" -ForegroundColor Red
        return $false
    } finally {
        Pop-Location
    }
}

function Test-FrontendDeps {
    Write-Host "[TEST] Checking frontend dependencies..." -NoNewline
    Push-Location frotend
    try {
        npm list --depth=0 | Out-Null
        Write-Host " PASS - Frontend dependencies OK" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " FAIL - Frontend dependencies missing. Run 'npm install' in frotend/" -ForegroundColor Red
        return $false
    } finally {
        Pop-Location
    }
}

function Test-EnvFiles {
    Write-Host "[TEST] Checking environment files..." -NoNewline
    $missingFiles = @()

    if (!(Test-Path "backend/.env.production")) {
        $missingFiles += "backend/.env.production"
    }

    if (!(Test-Path "frotend/.env.production")) {
        $missingFiles += "frotend/.env.production"
    }

    if ($missingFiles.Count -eq 0) {
        Write-Host " PASS - Environment files present" -ForegroundColor Green
        return $true
    } else {
        Write-Host " WARN - Missing environment files: $($missingFiles -join ', ')" -ForegroundColor Yellow
        Write-Host "       Copy from .env.production templates and configure" -ForegroundColor Yellow
        return $false
    }
}

function Test-BuildScripts {
    Write-Host "[TEST] Checking build scripts..." -NoNewline

    $backendOK = $false
    $frontendOK = $false

    # Check backend package.json
    if (Test-Path "backend/package.json") {
        $packageJson = Get-Content "backend/package.json" -Raw | ConvertFrom-Json
        if ($packageJson.scripts.start) {
            $backendOK = $true
        }
    }

    # Check frontend package.json
    if (Test-Path "frotend/package.json") {
        $packageJson = Get-Content "frotend/package.json" -Raw | ConvertFrom-Json
        if ($packageJson.scripts.build) {
            $frontendOK = $true
        }
    }

    if ($backendOK -and $frontendOK) {
        Write-Host " PASS - Build scripts OK" -ForegroundColor Green
        return $true
    } else {
        Write-Host " FAIL - Missing build scripts" -ForegroundColor Red
        return $false
    }
}

# Run all tests
function Run-Tests {
    $failedTests = 0

    if (!(Test-NodeJS)) { $failedTests++ }
    if (!(Test-NPM)) { $failedTests++ }
    if (!(Test-BackendDeps)) { $failedTests++ }
    if (!(Test-FrontendDeps)) { $failedTests++ }
    if (!(Test-EnvFiles)) { $failedTests++ }
    if (!(Test-BuildScripts)) { $failedTests++ }

    Write-Host ""
    if ($failedTests -eq 0) {
        Write-Host "All critical tests passed! Ready for deployment 🚀" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Configure environment variables" -ForegroundColor White
        Write-Host "2. Set up MongoDB Atlas database" -ForegroundColor White
        Write-Host "3. Run deployment commands or follow DEPLOYMENT_README.md" -ForegroundColor White
    } else {
        Write-Host "$failedTests test(s) failed. Please fix before deploying." -ForegroundColor Red
        Write-Host ""
        Write-Host "Common fixes:" -ForegroundColor Yellow
        Write-Host "- Run 'npm install' in both backend/ and frotend/" -ForegroundColor White
        Write-Host "- Copy and configure .env.production files" -ForegroundColor White
        Write-Host "- Ensure Node.js v16+ is installed" -ForegroundColor White
    }
}

# Main execution
Run-Tests