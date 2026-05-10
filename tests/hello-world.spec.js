// Sample Playwright Test Case - Hello World
// This is a basic test that demonstrates Playwright test structure

const { test, expect } = require('@playwright/test');

test('Print Hello World', async ({ page }) => {
  // Print hello world to console
  console.log('Hello World');
  
  // Verify the test passes
  expect(true).toBe(true);
});

test('Hello World with multiple outputs', async () => {
  // Print hello world multiple times
  console.log('Hello World');
  console.log('Hello World');
  console.log('Hello World');
  
  // Basic assertion
  const message = 'Hello World';
  expect(message).toBe('Hello World');
});
