const { test, expect } = require('@playwright/test');

test('Print hello world', async ({ page }) => {
  console.log('Hello World');
  expect(true).toBe(true);
});
