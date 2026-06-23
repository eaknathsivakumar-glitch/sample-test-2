const { test, expect } = require('@playwright/test');

test('Hello World Test', async ({ page }) => {
  // Navigate to a simple page
  await page.goto('about:blank');
  
  // Verify the page is loaded
  expect(page).toBeDefined();
  
  // Simple assertion
  const title = await page.title();
  expect(title).toBeDefined();
});
