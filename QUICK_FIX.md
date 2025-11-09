# Quick Fix for Multiple Vercel Domains

## The Problem
Vercel is deploying from both the root directory AND the `saas-budget-tool` subdirectory, creating multiple domains.

## The Fix (2 minutes)

### Step 1: Open Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Click on your project (connected to `jiridockal5/app`)

### Step 2: Set Root Directory
1. Click **Settings** (top navigation)
2. Click **General** (left sidebar)
3. Scroll to **Root Directory** section
4. Click **Edit**
5. Select **Other** 
6. Type: `saas-budget-tool`
7. Click **Save**

### Step 3: Check for Duplicate Projects
1. In Vercel Dashboard, check if you see multiple projects
2. If you see 2+ projects connected to the same repo:
   - Keep the one with Root Directory = `saas-budget-tool`
   - Delete the other one(s)

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for build to complete

## Expected Result
✅ One production domain  
✅ Preview domains for branches (normal)

## Need More Help?
See `VERCEL_SETUP.md` for detailed instructions.

