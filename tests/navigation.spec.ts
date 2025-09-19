import { test, expect } from '@playwright/test';
import { CREDENTIALS,CONFIG } from '../config';
test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto(CONFIG.URL);
  await test.step('Entering Credentials', async() => {
    await page.locator('#content').getByRole('button', { name: 'Sign up / Login' }).click();
    await page.getByRole('button', { name: 'Sign in with email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(CREDENTIALS.email);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(2000);
  })

});

test('Verify user is able to login', async ({ page }) => {
  await test.step('Validate user is correct and logged in', async() => {
    await expect(page.locator('#sidebar')).toContainText('WJ Sy');
  })
});

test('Verify navbar handbook leads to the correct url', async({ page, context }) => {
  const pagePromise = context.waitForEvent('page');
  
  // Click the link that opens a new tab
  await page.getByRole('link', { name: 'Resources' }).click();
  
  // Get the new page object
  const newPage = await pagePromise;
  await expect(newPage.getByRole('link', { name: 'Anycase.ai Knowledge Base' })).toBeVisible();
  await expect(newPage.getByRole('contentinfo').getByRole('img', { name: 'Anycase.ai Knowledge Base' })).toBeVisible();
  await expect(newPage).toHaveURL(/help\.anycase\.ai/);
});

test('Verify navbar profile button redirects correctly', async({page}) => {
  await expect(page.getByTestId('user-tier')).toBeVisible();
  await page.waitForTimeout(1000);
  // await page.getByRole('button', { name: 'View your account details' }).click();
  await page.getByTestId('user-profile').click()
  await expect(page.getByRole('heading', { name: 'Profile Information' })).toBeVisible();

  await expect(page).toHaveURL(CONFIG.URL+'profile');

  await expect(page.getByRole('heading', { name: 'Profile Information' })).toBeVisible();
  await expect(page.locator('#content')).toContainText('WJ Sy');
  await expect(page.locator('#content')).toContainText(CREDENTIALS.email);
  await expect(page.getByRole('heading', { name: 'Account Profile' })).toBeVisible();  
});

test('verify sidebar bookmark redirects correctly', async({page}) => {
  await page.getByRole('link', { name: 'Bookmarks' }).click();
  await expect(page).toHaveURL(CONFIG.URL +'bookmarks');
  await expect(page.getByRole('heading', { name: 'Bookmarks' })).toBeVisible();
  
});
test('verify sidebar profile redirects correctly', async({page}) => {
  await page.getByRole('link', { name: 'WJ Sy '+ CREDENTIALS.email }).click();
  await expect(page).toHaveURL(CONFIG.URL+'profile');

  await expect(page.getByRole('heading', { name: 'Profile Information' })).toBeVisible();
  await expect(page.locator('#content')).toContainText('WJ Sy');
  await expect(page.locator('#content')).toContainText(CREDENTIALS.email);
  await expect(page.getByRole('heading', { name: 'Account Profile' })).toBeVisible();
  
});

test('verify user logs out when clicking logout sidebar button', async({page}) => {
  await page.locator('#sidebar').getByRole('button', { name: 'Sign Out' }).click();
  await expect(page.getByRole('banner')).toContainText('Sign up / Login');
});
