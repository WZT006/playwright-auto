import { test, expect } from '@playwright/test';
import { CONFIG, CREDENTIALS } from '../config';
import { manuallySelectText } from '../utils/highlight_text';

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
    await page.waitForLoadState();
  })

});
test.afterEach(async({page})=>{
  await test.step('open sidebar if closed', async() => {
    const visible = await page.getByRole('button', { name: 'Toggle sidebar' }).isVisible();
    if (!visible){
      await page.getByRole('button', { name: 'Show sidebar' }).click();
    }

  })
  await test.step('clear chat history', async() =>{
  await page.getByRole('link', { name: 'WJ Sy winzentt606@gmail.com' }).click();

  const deleteButton = page.getByRole('button', { name: 'Delete Chat History' });
  if (await deleteButton.isEnabled()){
    await page.getByRole('button', { name: 'Delete Chat History' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
  }

  })
  await test.step('clear bookmarks', async() => {
    await page.getByRole('link', { name: 'Bookmarks' }).click();
    await page.waitForSelector('#content svg.lucide-bookmark-icon', { state: 'visible', timeout: 5000 }).catch(() => {});   
    while (await page.locator('#content svg.lucide-bookmark-icon').count() > 0) {
      await page.locator('#content svg.lucide-bookmark-icon').first().click();
      await page.waitForTimeout(200);
  }
  })
});




test('Verify mode dropdown components are visible and accessible', async ({ page }) => {   
  await expect(page.locator('[data-test-id="mode-button"]')).toContainText('Standard');

  await test.step('check all modes', async()=>{
    await page.locator('[data-test-id="mode-button"]').click();
    await expect(page.getByRole('main')).toContainText('Standard');
    await expect(page.getByRole('main')).toContainText('Concise');
    await expect(page.getByRole('main')).toContainText('Professional');
    await expect(page.getByRole('main')).toContainText('Educational');
    await expect(page.getByRole('main')).toContainText('Simple English');
  })
  
  await test.step('check standard',async() => {
    await page.locator('[data-test-id="mode-button"]').click();
    await page.getByText('StandardFor general legal').click();
    await expect(page.locator('[data-test-id="mode-button"] span')).toContainText('Standard');
  })
  await test.step('check concise mode',async() => {
    await page.locator('[data-test-id="mode-button"]').click();
    await page.getByText('ConciseFor lawyers and').click();
    await expect(page.locator('[data-test-id="mode-button"] span')).toContainText('Concise');
  })
  await test.step('check professional mode',async() => {
    await page.locator('[data-test-id="mode-button"]').click();
    await page.getByText('ProfessionalFor legal').click();
    await expect(page.locator('[data-test-id="mode-button"] span')).toContainText('Professional');
  })
  await test.step('check educational mode',async() => {
    await page.locator('[data-test-id="mode-button"]').click();
    await page.getByText('EducationalFor law students,').click();
    await expect(page.locator('[data-test-id="mode-button"] span')).toContainText('Educational');
  })
  await test.step('check simple english mode',async() => {
    await page.locator('[data-test-id="mode-button"]').click();
    await page.getByText('For non-lawyers, the general').click();
    await expect(page.locator('[data-test-id="mode-button"] span')).toContainText('Simple English');
  })
});

test('Verify all preset queries are visible', async ({ page }) => {
  await expect( page.getByRole('button', {name: 'Explain'})).toBeVisible();
  await test.step('Select Explain Preset', async()=> {
    await page.getByRole('button', { name: 'Explain' }).click();
    await expect(page.getByRole('main')).toContainText('Explain the four fold test in employment.');
    await expect(page.getByRole('main')).toContainText('Explain the concept of Easement of Right of Way.');
    await expect(page.getByRole('main')).toContainText('Explain the Right to Inspection of Stockholders and Members under the Revised Corporation Code.');
    await expect(page.getByRole('main')).toContainText('Explain the elements of a contract.');
  })
  await page.getByRole('heading', { name: 'Search or ask a question' }).click()
  await test.step('Select Find Preset', async()=> {
    await page.getByRole('button', { name: 'Find' }).click();
    await expect(page.getByRole('main')).toContainText('Find Hocheng Philippines Corporation v. Farrales, G.R. No. 211497 (2015)');
    await expect(page.getByRole('main')).toContainText('Find Delos Reyes v. Kalibo, G.R. No. 214587 (2018)');
    await expect(page.getByRole('main')).toContainText('Find Narra Nickel Mining v. Redmont Consolidated Mines Corp., G.R. No. 195580 (2014)');
    await expect(page.getByRole('main')).toContainText('Find the elements of Art. 138 - Inciting to Rebellion or Insurrection.');
  })
  await page.getByRole('heading', { name: 'Search or ask a question' }).click()
  await test.step('Select Draft Preset', async()=> {
    await page.getByRole('button', { name: 'Draft' }).click();
    await expect(page.getByRole('main')).toContainText('Draft a sample employment contract for a computer programmer.');
    await expect(page.getByRole('main')).toContainText('Draft a testamentary will for decedent Mr. Aian Ycase');
    await expect(page.getByRole('main')).toContainText('Draft a template Articles of Incorporation for corporation X.');
    await expect(page.getByRole('main')).toContainText('Draft a judicial affidavit for a respondent to an unintentional abortion case.');
  })
  await page.getByRole('heading', { name: 'Search or ask a question' }).click()
  await test.step('Select Digest Preset', async()=> {
    await page.getByRole('button', { name: 'Digest' }).click();
    await expect(page.getByRole('main')).toContainText('Make a digest of the case of Alfredo Laya, Jr. v. PH Veterans Bank and Balbido.');
    await expect(page.getByRole('main')).toContainText('Make a digest of Roman Catholic Bishop of Manila vs. Court of Appeals.');
    await expect(page.getByRole('main')).toContainText('Make a digest of GSIS Family Bank v BPI Family Bank focusing on the issue of corporate name.');
    await expect(page.getByRole('main')).toContainText('List recent jurisprudence highlighting the difference between tax evasion and tax avoidance.');
  })
});


test('Verify mode is kept through queries', async ({ page }) => {
  await test.step('change to educational mode',async() => {
    await page.locator('[data-test-id="mode-button"]').click();
    await expect(page.getByRole('main')).toContainText('Educational');
    await page.getByText('EducationalFor law students,').click();

  })
  await test.step('Query legal question',async() => {
    await page.getByRole('textbox', { name: 'Describe your legal question' }).click();
    await page.getByRole('textbox', { name: 'Describe your legal question' }).fill('Explain how a worker can be terminated and still get paid for months after termination');
    await page.locator('[data-test-id="submit-button"]').click();


  })


  // await expect(page.locator('[data-test-id="mode-button"] span')).toContainText('Educational');
  await expect(page).toHaveURL(/mode=study/);

});

test('Verify user is able to delete existing chat', async ({ page }) => {
  let deletedUrl: string;
  let firstLinkUrl: string;
  
  await test.step('create chat to delete', async() => {
    await page.getByRole('textbox', { name: 'Describe your legal question' }).fill('Explain the four fold test in employment.');
    await page.locator('[data-test-id="submit-button"]').click();

    await expect(page.locator('.answer-container').locator('button').filter({ hasText: /^$/ })).toBeVisible({ timeout: 60000 });
    await page.goto(CONFIG.URL);
    await page.getByRole('textbox', { name: 'Describe your legal question' }).fill('What crime is committed, when a spouse commits murder on their significant other after catching them in the act of adultery.');
    await page.locator('[data-test-id="submit-button"]').click();

    await expect(page.locator('.answer-container').locator('button').filter({ hasText: /^$/ })).toBeVisible({ timeout: 60000 });
  })

  await test.step('Verify chat history exists', async () => {
    await expect(page.locator('.search-history > div > div:has(a)')).not.toHaveCount(0, {timeout:60000});
  });

  await test.step('Open first chat and get URL', async () => {
    await page.locator('.search-history div div').first().click();
    await expect(page.locator('#content')).toContainText('AI Answer');
    deletedUrl = page.url();
  });

  await test.step('Navigate home and delete chat', async () => {
    await page.getByRole('link', { name: 'Home' }).click();
    await page.locator('#sidebar-content').getByRole('img').nth(2).click();
    await page.getByText('Delete').first().click();
    await page.waitForTimeout(2000);
  });

  await test.step('Open new first chat and verify URL changed', async () => {
    await page.locator('.search-history div div').first().click();
    await expect(page.locator('#content')).toContainText('AI Answer');
    firstLinkUrl = page.url();
    expect(firstLinkUrl).not.toBe(deletedUrl);
  });
});


test.skip('Verify user is able to toggle light settings', async ({ page }) => {
  //get current theme mode

  await expect(page.locator('#sidebar')).toContainText('WJ Sy');
  await page.waitForTimeout(4000);
  await page.getByTitle('Toggle light/dark mode').focus();

  await page.getByTestId('theme-toggle').click();
  await page.waitForTimeout(4000);
  
  await expect(page.locator('html')).toHaveClass("dark mdl-js");
});

test('Verify pdfs are downloadable (does not test all types)', async ({ page }) => {
    await test.step('create chat', async() => {
      await page.getByRole('textbox', { name: 'Describe your legal question' }).fill('What crime is committed, when a spouse commits murder on their significant other after catching them in the act of adultery..');
      await page.locator('[data-test-id="submit-button"]').click();
      await expect(page.locator('.answer-container').locator('button').filter({ hasText: /^$/ })).toBeVisible({ timeout: 60000 });
      
    })
    await page.getByText('People of the Philippines v. Oyanib', { exact: true }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'People of the Philippines v. Oyanib', exact: true }).getByRole('button').click();
    const page1 = await page1Promise;
    const downloadPromise = page1.waitForEvent('download');

    await page.waitForTimeout(3000)
    await page1.getByRole('button', { name: 'PDF' }).click();
    const download = await downloadPromise;    
    await expect(download.suggestedFilename()).toBe('G_R_Nos_130634-35.pdf')

  });

test('Verify user is able to Bookmark and unbookmark an article', async ({ page }) => {
    await test.step('Create new chat to bookmark article in', async() => {
      await page.getByRole('button', { name: 'Issuance' }).click();
      await page.getByRole('button', { name: 'Explain' }).click();
      await page.getByText('Explain the four fold test in').nth(0).click();
    })

    await test.step('Bookmark via reader view',async() =>{
      await page.getByText('Mago, et al. v. Sun Power Manufacturing Limited', { exact: true }).click();
      await page.getByRole('button', { name: 'Bookmark' }).click();
    })

    await test.step('Navigate to Bookmark page',async() =>{
      await page.getByTitle('Show sidebar').getByRole('img').click();
      await page.getByRole('link', { name: 'Bookmarks' }).click();  
    })

    await expect(page.getByRole('link', { name: 'Mago, et al. v. Sun Power' })).toBeVisible();
    await test.step('Navigate to Bookmark page',async() =>{
      await page.getByRole('link', { name: 'Bookmarks' }).click();  
    })

    await test.step('Unbookmark article',async() =>{

      const article_button = page.locator('div:has-text("Mago, et al. v. Sun Power") svg.lucide-bookmark-icon').nth(1);
      await expect(article_button).toBeVisible();
      await article_button.click();
      await expect(page.getByRole('link', { name: 'Mago, et al. v. Sun Power' })).not.toBeVisible();
    })
  });

test('Verify user is able to query by highlighting part of an article', async({page}) =>{

    await test.step('Create new chat to bookmark article in', async() => {
      await page.getByRole('button', { name: 'Issuance' }).click();
      await page.getByRole('button', { name: 'Explain' }).click();
      await page.getByText('Explain the four fold test in').nth(0).click();
    })

    await test.step('Open Reader mode',async() =>{
      await page.getByText('Mago, et al. v. Sun Power Manufacturing Limited', { exact: true }).click();
      await expect(page.getByRole('paragraph').filter({hasText: 'The petitioners are former'})).toBeVisible();
      const paragraph = page.getByRole('paragraph').filter({ hasText: 'It was alleged that sometime' });
      await paragraph.scrollIntoViewIfNeeded();
      await manuallySelectText(page, paragraph, 'It', 'Jobcrest');

      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page.locator('.msg-container').first()).toContainText(/Sunpower conducted an operational alignment/)
    })

})

test('Verify user is able to rate the response of the AI', async({page}) => {
    await test.step('create chat', async() => {
      await page.getByRole('textbox', { name: 'Describe your legal question' }).fill('What crime is committed, when a spouse commits murder on their significant other after catching them in the act of adultery..');
      await page.locator('[data-test-id="submit-button"]').click();
      await expect(page.locator('.answer-container').locator('button').filter({ hasText: /^$/ })).toBeVisible({ timeout: 60000 });
      
    })
    await test.step('rate up response', async() => 
    {
      await page.locator('.related-queries').locator('svg.lucide-thumbs-up').click();
      await expect(page.getByText('Thanks for your feedback!')).toBeVisible();
    })
})


test('Verify all sources are available when all sources is enabled for libraries', async ({page}) =>{
  await test.step('Enable all libraries', async() =>
  {
    await page.getByRole("button", {name: "Issuance"}).click()
  })
  await test.step("Enter Query", async() =>{
    await page.getByRole('textbox', { name: 'Describe your legal question' }).fill('Explain the four fold test in employment.');
    await page.locator('[data-test-id="submit-button"]').click();
  })
  await test.step('Verify all libraries have sources', async()=>{
    await expect(page.locator('.answer-container').locator('button').filter({ hasText: /^$/ })).toBeVisible({ timeout: 60000 });

    await expect(page.getByText('Sumifru (Philippines) Corp. v')).toBeVisible();

    await page.getByRole('paragraph').filter({ hasText: /^Law$/ }).click()
    await expect(page.getByText('AN ACT TO PROVIDE FOR THE ORGANIZATION OF A NATIONAL EMPLOYMENT SERVICE')).toBeVisible();

    await page.getByRole('paragraph').filter({ hasText: /^Issuance$/ }).click()
    await expect(page.getByText('DOLE Department Order No. 40, Series of 2003', { exact: true })).toBeVisible();
  })

})