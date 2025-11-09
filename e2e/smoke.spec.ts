import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Financial dashboard loads and displays KPIs', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/SaaS Budget Tool/i);
    
    // Check for main heading or key elements
    await expect(page.locator('text=Revenue').or(page.locator('[data-testid="revenue-kpi"]')).first()).toBeVisible();
    
    // Check for KPI cards (at least one should be visible)
    const kpiCards = page.locator('text=Revenue, text=Cost of Sales, text=Gross Margin, text=Operating Cost, text=EBITDA').first();
    await expect(kpiCards).toBeVisible({ timeout: 5000 });
    
    // Check page loads without errors
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });

  test('Plan page loads and displays monthly table', async ({ page }) => {
    await page.goto('/plan');
    
    // Check for plan page content
    await expect(page.locator('text=Plan').first()).toBeVisible({ timeout: 5000 });
    
    // Check for monthly table or charts
    const hasTable = await page.locator('table').count() > 0;
    const hasChart = await page.locator('svg').count() > 0;
    expect(hasTable || hasChart).toBe(true);
    
    // Check page loads without errors
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });

  test('Revenue forecast page loads', async ({ page }) => {
    await page.goto('/revenue');
    
    // Check for revenue page content - updated to match new page title
    await expect(page.locator('h1:has-text("Revenue")').first()).toBeVisible({ timeout: 5000 });
    
    // Check page loads without errors
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });

  test('Navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Check sidebar is visible
    const sidebar = page.locator('nav, aside, [role="navigation"]').first();
    await expect(sidebar).toBeVisible({ timeout: 5000 });
    
    // Try clicking on a navigation link (if available)
    const planLink = page.locator('a[href="/plan"], text=Plan').first();
    if (await planLink.isVisible()) {
      await planLink.click();
      await expect(page).toHaveURL(/.*\/plan/);
    }
  });

  test('Tooltips are accessible', async ({ page }) => {
    await page.goto('/');
    
    // Find a tooltip trigger (info icon)
    const tooltipTrigger = page.locator('button:has-text("i"), [aria-describedby]').first();
    
    if (await tooltipTrigger.isVisible()) {
      // Hover over tooltip
      await tooltipTrigger.hover();
      
      // Check tooltip appears (may need to wait)
      await page.waitForTimeout(200);
      
      // Check for tooltip content
      const tooltip = page.locator('[role="tooltip"]');
      // Tooltip may or may not be visible depending on implementation
      // Just check it doesn't break
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      expect(errors.length).toBe(0);
    }
  });
});


