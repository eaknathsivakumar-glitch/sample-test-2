const { test, expect } = require('@playwright/test');

test('Print hello world', async ({ page }) => {
  console.log('hello world');
  expect(true).toBe(true);
});
