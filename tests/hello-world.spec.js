const { test, expect } = require('@playwright/test');

test('Print hello world', async ({ page }) => {
  // Print hello world to console
  console.log('hello world');
  
  // Verify the test passes
  expect(true).toBe(true);
});
