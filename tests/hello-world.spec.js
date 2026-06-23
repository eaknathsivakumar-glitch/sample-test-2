const { test, expect } = require('@playwright/test');

test('Print hello world', async ({ page }) => {
  // Simple test that prints hello world to console
  console.log('hello world');
  
  // Verify the test passes
  expect(true).toBe(true);
});

test('Hello world with page navigation', async ({ page }) => {
  // Navigate to a simple page
  await page.goto('about:blank');
  
  // Print hello world
  console.log('hello world');
  
  // Verify page is loaded
  expect(page.url()).toBe('about:blank');
});

test('Hello world basic assertion', async () => {
  // Simple test that prints hello world
  const message = 'hello world';
  console.log(message);
  
  // Verify the message
  expect(message).toBe('hello world');
});
