import { test, chromium } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import { spawn } from 'child_process';
test.describe.serial('Serial mode (one browser at a time)', ()=> {

test.skip('Lighthouse audit - Chromium only', async ({ browserName }) => {
  test.setTimeout(120000)
  test.skip(browserName !== 'chromium', 'Chromium needed for lighthouse');

  const chromePath = chromium.executablePath();

// chromium browser common automation setup including local port
  const chrome = spawn(chromePath, [
    '--remote-debugging-port=9222',
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    'https://app.anycase.ai/'
  ]);
//not required, can be removed or adjusted based on wait time for page to load
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await playAudit({
    url: 'https://app.anycase.ai/',
    port: 9222,
    thresholds: {
        performance: 50,
        accessibility: 50,
        'best-practices': 50,
        seo: 50,
        pwa: 50,
      },
      reports:{
        formats:{
        html: true,
      },
    },
// add any playwright config here
  });
// kill chrome
  chrome.kill();
});

test.skip('Lighthouse audit after login - Chromium only', async ({ page, browserName }) => {
  test.setTimeout(120000);
  test.skip(browserName !== 'chromium', 'Chromium needed for lighthouse');

  // Launch a regular Playwright browser for login

  // Perform login
  await page.goto('https://app.anycase.ai/signin'); 
  await page.getByRole('button', { name: 'Sign in with email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('maros12496@bamsrad.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for login to complete and navigate to the page you want to audit
  await page.waitForURL('https://app.anycase.ai/');
  
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await playAudit({
    page: page,
    port: 9222,
    thresholds: {
      performance: 50,
      accessibility: 50,
      'best-practices': 50,
      seo: 50,
      pwa: 50,
    },
    reports: {
      formats: {
        html: true,
      },
    },
  });

});
})
