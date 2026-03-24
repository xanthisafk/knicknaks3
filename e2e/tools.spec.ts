import { test, expect } from '@playwright/test';

test.describe('Age Calculator Tool', () => {
  test('should display definitions and calculate age correctly', async ({ page }) => {
    await page.goto('/tools/calculators/age-calculator');

    // Verify Tool Definition
    await expect(page.locator('h1').first()).toContainText('Age Calculator');
    await expect(page.locator('p').filter({ hasText: 'Calculate precise age and get some fun stats!' }).first()).toBeVisible();

    // Functional Logic
    await page.getByLabel('Date of Birth').fill('1990-01-01');
    await page.getByLabel('Calculate To').fill('2020-01-01');

    await expect(page.getByText('30').first()).toBeVisible();
    await expect(page.getByText('0', { exact: true }).nth(0)).toBeVisible(); // 0 months
  });
});

test.describe('Aspect Ratio Calculator Tool', () => {
  test('should display definitions and calculate ratio correctly', async ({ page }) => {
    await page.goto('/tools/calculators/aspect-ratio');

    // Verify Tool Definition
    await expect(page.locator('h1').first()).toContainText('Aspect Ratio Calculator');
    await expect(page.locator('p').filter({ hasText: 'Instantly scale dimensions proportionally' }).first()).toBeVisible();

    // Functional Logic (Detect Ratio mode)
    await page.getByPlaceholder('e.g. 1920').fill('1920');
    await page.getByPlaceholder('e.g. 1080').fill('1080');

    // 16:9 ratio
    await expect(page.getByText('16:9', { exact: true }).first()).toBeVisible();

    // Scale dimensions mode
    await page.getByRole('tab', { name: 'Scale Dimensions' }).click();
    await page.getByPlaceholder('e.g. 16:9').fill('4:3');
    await page.getByPlaceholder('Enter width...').fill('800');
    
    // Result height should be 600
    await expect(page.getByText('600').first()).toBeVisible();
  });
});

test.describe('Base Converter Tool', () => {
  test('should display definitions and convert correctly', async ({ page }) => {
    await page.goto('/tools/encoders/base-converter');

    // Verify Tool Definition
    await expect(page.locator('h1').first()).toContainText('Universal Base Converter');
    await expect(page.locator('p').filter({ hasText: 'Convert numbers across any base' }).first()).toBeVisible();

    // Functional Logic
    await page.getByPlaceholder('Enter a number...').fill('255');
    
    // Default from base is 10, expecting hex FF
    await expect(page.getByText('FF').first()).toBeVisible();
    // Expecting binary 11111111
    await expect(page.getByText('11111111').first()).toBeVisible();
  });
});
