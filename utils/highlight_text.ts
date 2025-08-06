import { Locator, Page } from '@playwright/test';

export async function manuallySelectText(
  page: Page,
  locator: Locator,
  startText: string | RegExp,
  endText?: string | RegExp
): Promise<void> {
  // If endText not provided, select from startText to startText (single word)
  endText = endText || startText;

  // Get bounding boxes for the text matches
  const startBox = await getTextBoundingBox(locator, startText);
  const endBox = await getTextBoundingBox(locator, endText);

  if (!startBox || !endBox) {
    throw new Error('Text patterns not found in the element');
  }

  // Calculate click positions (middle of the matched text)
  const startX = startBox.x + startBox.width / 2;
  const startY = startBox.y + startBox.height / 2;
  const endX = endBox.x + endBox.width / 2;
  const endY = endBox.y + endBox.height / 2;

  // Simulate manual selection
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY);
  await page.mouse.up();
}

async function getTextBoundingBox(
  locator: Locator,
  pattern: string | RegExp
): Promise<{ x: number; y: number; width: number; height: number } | null> {
  return await locator.evaluate((element, { pattern }) => {
    const textContent = element.textContent || '';
    const regex = typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern;
    const match = regex.exec(textContent);
    
    if (!match) return null;

    // Create range for the matched text
    const range = document.createRange();
    const textNode = element.childNodes[0]; // Simplification - may need more complex DOM traversal
    range.setStart(textNode, match.index);
    range.setEnd(textNode, match.index + match[0].length);
    
    // Get bounding rectangle
    const rect = range.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
  }, { pattern });
}