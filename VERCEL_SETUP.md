# Fix Multiple Domains on Vercel

## Problem
You're seeing multiple domains because Vercel is detecting both:
- Root directory (Node.js server - `index.js`, `server.ts`)
- Subdirectory (`saas-budget-tool` - Next.js app)

## Solution: Set Root Directory in Vercel Dashboard

### Step 1: Go to Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project (the one connected to `jiridockal5/app`)

### Step 2: Configure Root Directory
1. Go to **Settings** → **General**
2. Scroll down to **Root Directory**
3. Click **Edit**
4. Select **Other** and enter: `saas-budget-tool`
5. Click **Save**

### Step 3: Delete Duplicate Projects (if any)
1. Check if you have multiple projects connected to the same repository
2. Go to each project's **Settings** → **General**
3. Look for projects that don't have Root Directory set to `saas-budget-tool`
4. **Delete** those duplicate projects (or disconnect them from the repo)

### Step 4: Verify Configuration
After setting Root Directory, verify:
- ✅ **Root Directory**: `saas-budget-tool`
- ✅ **Framework Preset**: Next.js (should auto-detect)
- ✅ **Build Command**: `npm run build` (or leave empty for Next.js)
- ✅ **Output Directory**: `.next` (or leave empty for Next.js)
- ✅ **Install Command**: `npm install` (or leave empty)

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger a fresh deployment

## Expected Result
After configuration, you should have:
- ✅ **One production domain** (your main `.vercel.app` domain)
- ✅ **Preview domains** for branches/PRs (this is normal and expected)
- ✅ **No duplicate production deployments**

## Domain Types in Vercel

### Production Domain
- Main domain: `app-*.vercel.app` or your custom domain
- This is your live production site
- Should only be ONE production domain

### Preview Domains
- Format: `app-git-{branch}-{username}-projects.vercel.app`
- These are automatic preview deployments for branches/PRs
- Having multiple preview domains is **normal and expected**
- Each branch/PR gets its own preview domain

## Troubleshooting

### Still seeing duplicate production domains?
1. Check if you have multiple projects in Vercel
2. Verify Root Directory is set correctly
3. Delete any projects deploying from the root directory
4. Wait a few minutes and refresh

### Build failing after setting Root Directory?
1. Verify `saas-budget-tool/package.json` exists
2. Check that `npm run build` works locally in `saas-budget-tool` directory
3. Clear Vercel cache and redeploy

### Need to check current configuration?
Run this locally to verify:
```bash
cd saas-budget-tool
npm run build
```
If this works locally, it should work on Vercel after setting Root Directory.

