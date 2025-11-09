# Vercel Deployment Guide

## Problem: Duplicate Domains

If you're seeing duplicate domains in Vercel, it's likely because:
1. **Two separate projects** are connected to the same repository
2. **Root directory** is being detected as a project (Node.js server)
3. **Subdirectory** (`saas-budget-tool`) is the actual Next.js app

## Solution: Configure Root Directory

### Option 1: Set Root Directory in Vercel (Recommended)

1. Go to your Vercel project settings
2. Navigate to **Settings** → **General**
3. Find **Root Directory** setting
4. Set it to: `saas-budget-tool`
5. Save and redeploy

This tells Vercel to only build and deploy the `saas-budget-tool` directory, ignoring the root-level Node.js server files.

### Option 2: Delete Duplicate Project

1. Go to Vercel Dashboard
2. Check if you have **two projects** connected to the same repository
3. If yes, delete the one that's pointing to the root directory
4. Keep only the project that's configured for `saas-budget-tool`

### Option 3: Deploy from Subdirectory

If using Vercel CLI:
```bash
cd saas-budget-tool
vercel
```

## Verification

After configuration, you should have:
- ✅ **One project** in Vercel
- ✅ **Root Directory** set to `saas-budget-tool`
- ✅ **One production domain** (your custom domain or `.vercel.app` domain)
- ✅ **Preview deployments** for each PR/branch (this is normal)

## Current Project Structure

```
testcursor/                    ← Root (Node.js server - NOT for Vercel)
├── index.js
├── server.ts
├── package.json
└── saas-budget-tool/          ← Next.js app (THIS should be deployed)
    ├── vercel.json            ← Vercel config
    ├── package.json
    ├── next.config.ts
    └── src/
```

## Next Steps

1. **Verify Vercel Settings:**
   - Check Root Directory is set to `saas-budget-tool`
   - Verify Build Command: `npm run build`
   - Verify Output Directory: `.next` (or leave empty for Next.js)

2. **Clean Up:**
   - If you have duplicate projects, delete the incorrect one
   - Ensure only one project is connected to your repository

3. **Test Deployment:**
   - Make a small change and push to trigger a new deployment
   - Verify it deploys correctly to the correct domain

## Troubleshooting

### Still seeing duplicate domains?
- Check if you have multiple Vercel projects
- Verify Root Directory setting
- Check if you're seeing preview deployments (these are normal and different from production)

### Build failing?
- Ensure `saas-budget-tool/package.json` has correct scripts
- Check that all dependencies are installed
- Verify Node.js version in Vercel settings (should match local: Node 20+)

### Wrong content showing?
- Clear Vercel cache
- Check Root Directory setting
- Verify `vercel.json` configuration

