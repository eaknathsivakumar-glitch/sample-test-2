// Sample test case for printing hello world
const { test, expect } = require('@playwright/test');

test('Print hello world', async ({ page }) => {
  // Print hello world to console
  console.log('hello world');
  
  // Verify the test runs successfully
  expect(true).toBe(true);
});
