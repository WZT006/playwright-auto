import { test, expect } from '@playwright/test'

test('basic performance paint timing', async ({ page }) => {
  await page.goto('https://app.anycase.ai/')

  // Get paint timing metrics
  const paintTimingJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType('paint'))
  )
  const paintTiming = JSON.parse(paintTimingJson)

  // Log to console (optional)
  console.log('Paint Timing Metrics:', paintTiming)

  // Add to test report using testInfo
  test.info().annotations.push({
    type: 'performance',
    description: 'Paint Timing Metrics',
    details: JSON.stringify(paintTiming, null, 2)
  });

  // You can also add assertions if needed
  expect(paintTiming.length).toBeGreaterThan(0);
  
  // Or check specific metrics
  const firstContentfulPaint = paintTiming.find(entry => entry.name === 'first-contentful-paint');
  if (firstContentfulPaint) {
    test.info().annotations.push({
      type: 'performance',
      description: 'First Contentful Paint',
      details: `${firstContentfulPaint.startTime}ms`
    });
    
    // Example assertion (adjust threshold as needed)
    expect(firstContentfulPaint.startTime).toBeLessThan(3000);
  }
});