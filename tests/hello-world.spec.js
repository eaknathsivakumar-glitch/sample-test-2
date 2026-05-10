const { test, expect } = require('@playwright/test');

test('Print hello world', async ({ page }) => {
  // Print hello world to console
  console.log('Hello world');
  
  // Simple assertion to verify test passes
  expect(true).toBe(true);
});
