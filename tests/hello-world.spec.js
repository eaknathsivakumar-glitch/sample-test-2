// Sample Playwright Test Case - Hello World
// This is a basic test that demonstrates Playwright test structure

const { test, expect } = require('@playwright/test');

test('Print hello world', async ({ page }) => {
  // Print hello world to console
  console.log('hello world');
  
  // Basic assertion to ensure test passes
  expect(true).toBe(true);
});

test('Hello world without browser', () => {
  // This test demonstrates a simple test without browser interaction
  const message = 'hello world';
  console.log(message);
  
  expect(message).toBe('hello world');
});
