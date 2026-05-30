# Backend Setup Verification Checklist

Use this checklist to verify that the backend setup was completed successfully.

## ✅ 1. Package Installation

Check that Supabase packages are installed:

```bash
npm list @supabase/supabase-js @supabase/ssr
```

Expected output should show both packages installed.

## ✅ 2. Environment Files

Verify these files exist:

- [ ] `.env.example` exists in project root
- [ ] `.env.local` exists in project root (create from .env.example)
- [ ] `.gitignore` includes `.env*` (prevents committing secrets)

Check `.env.local` has all required variables:
```bash
# On Windows (PowerShell)
Get-Content .env.local

# On Windows (CMD)
type .env.local
```

## ✅ 3. Supabase Client Files

Verify these files exist:

```bash
# Check if files exist (PowerShell)
Test-Path lib/supabase/client.ts
Test-Path lib/supabase/server.ts
Test-Path lib/supabase/middleware.ts
Test-Path middleware.ts
```

All should return `True`.

## ✅ 4. Auth Context Updated

Check that `lib/context/AuthContext.tsx` imports Supabase:

```bash
# Search for Supabase import (PowerShell)
Select-String -Path lib/context/AuthContext.tsx -Pattern "supabase"
```

Should show import statement from `@/lib/supabase/client`.

## ✅ 5. API Routes Migrated

Verify API routes use Supabase (not mock data):

```bash
# Check auth routes (PowerShell)
Select-String -Path app/api/auth/login/route.ts -Pattern "createClient"
Select-String -Path app/api/auth/signup/route.ts -Pattern "createClient"

# Check other routes
Select-String -Path app/api/users/route.ts -Pattern "createClient"
Select-String -Path app/api/jobs/route.ts -Pattern "createClient"
Select-String -Path app/api/posts/route.ts -Pattern "createClient"
```

All should show `createClient` imports from `@/lib/supabase/server`.

## ✅ 6. No Mock Data Imports in API Routes

Verify mock data is NOT imported in migrated routes:

```bash
# This should return NO results (PowerShell)
Select-String -Path app/api/auth/*/route.ts -Pattern "from.*lib/data"
Select-String -Path app/api/users/*/route.ts -Pattern "from.*lib/data"
Select-String -Path app/api/jobs/*/route.ts -Pattern "from.*lib/data"
```

If these return results, those routes still use mock data.

## ✅ 7. TypeScript Compilation

Check for TypeScript errors:

```bash
npm run build
```

Should complete without TypeScript errors. Warnings are okay.

## ✅ 8. Documentation Files

Verify documentation exists:

- [ ] `DEPLOYMENT.md` - Deployment guide
- [ ] `BACKEND_SETUP_SUMMARY.md` - Implementation summary
- [ ] `VERIFICATION_CHECKLIST.md` - This file

## ✅ 9. Git Status

Check what files were modified:

```bash
git status
```

Expected modified files:
- `package.json` and `package-lock.json`
- `lib/context/AuthContext.tsx`
- All files in `app/api/` directories
- `.gitignore` (if updated)

Expected new files:
- `lib/supabase/` directory and files
- `middleware.ts`
- `.env.example`
- `.env.local` (should NOT be in git status if .gitignore works)
- Documentation files

## ✅ 10. Local Test (After Supabase Setup)

Once you've set up Supabase and configured `.env.local`:

```bash
npm run dev
```

Then test:

1. Visit http://localhost:3000
2. Open browser DevTools > Console
3. Try to sign up with a test email
4. Check for errors in console
5. Check Supabase dashboard > Auth > Users (should show new user)

## Quick Verification Script (PowerShell)

```powershell
# Run this in PowerShell from project root
Write-Host "`n=== Backend Setup Verification ===" -ForegroundColor Cyan

# Check packages
Write-Host "`n1. Checking packages..." -ForegroundColor Yellow
if (Test-Path "node_modules/@supabase") {
    Write-Host "   ✓ Supabase packages installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ Supabase packages missing" -ForegroundColor Red
}

# Check files
Write-Host "`n2. Checking files..." -ForegroundColor Yellow
$files = @(
    "lib/supabase/client.ts",
    "lib/supabase/server.ts",
    "lib/supabase/middleware.ts",
    "middleware.ts",
    ".env.example",
    "DEPLOYMENT.md",
    "BACKEND_SETUP_SUMMARY.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file missing" -ForegroundColor Red
    }
}

# Check .env.local
Write-Host "`n3. Checking environment..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   ✓ .env.local exists" -ForegroundColor Green

    $envContent = Get-Content .env.local
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL") {
        Write-Host "   ✓ SUPABASE_URL configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ SUPABASE_URL needs configuration" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠ .env.local not created yet (create from .env.example)" -ForegroundColor Yellow
}

# Check Supabase imports
Write-Host "`n4. Checking API routes..." -ForegroundColor Yellow
$apiRoutes = @(
    "app/api/auth/login/route.ts",
    "app/api/users/route.ts",
    "app/api/jobs/route.ts",
    "app/api/posts/route.ts"
)

$allGood = $true
foreach ($route in $apiRoutes) {
    if (Test-Path $route) {
        $content = Get-Content $route -Raw
        if ($content -match "createClient.*supabase") {
            Write-Host "   ✓ $route uses Supabase" -ForegroundColor Green
        } else {
            Write-Host "   ✗ $route not migrated" -ForegroundColor Red
            $allGood = $false
        }
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "Backend setup appears complete! ✓" -ForegroundColor Green
    Write-Host "Next: Follow DEPLOYMENT.md to set up Supabase and deploy" -ForegroundColor Cyan
} else {
    Write-Host "Some issues detected. Review output above." -ForegroundColor Yellow
}
```

## What to Do If Verification Fails

### Issue: Packages Not Installed
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Issue: Files Missing
- Check if files were created in correct locations
- Ensure you're in the project root directory
- Review the implementation steps

### Issue: TypeScript Errors
- Run `npm install` to ensure all dependencies are installed
- Check for syntax errors in modified files
- Ensure imports are correct

### Issue: .env.local Not Working
- Ensure file is in project root
- Restart dev server after creating/editing .env.local
- Check for typos in variable names

## Next Steps After Verification

Once all checks pass:

1. **Set Up Supabase**
   - Create account and project
   - Run database migration
   - Get API credentials

2. **Configure .env.local**
   - Add Supabase credentials
   - Test locally

3. **Deploy to Vercel**
   - Follow DEPLOYMENT.md
   - Add environment variables to Vercel
   - Deploy!

---

**Need Help?**
- See `DEPLOYMENT.md` for detailed setup instructions
- See `BACKEND_SETUP_SUMMARY.md` for implementation details
