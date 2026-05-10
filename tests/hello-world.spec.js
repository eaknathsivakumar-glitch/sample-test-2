const { test, expect } = require('@playwright/test');

test.describe('Hello World Test Suite', () => {
  test('should display hello world message', async ({ page }) => {
    // Navigate to the health endpoint
    await page.goto('http://18.188.207.48:32794/api/v1/health');
    
    // Get the page content
    const content = await page.textContent('body');
    
    // Verify the response contains expected data
    expect(content).toBeTruthy();
    expect(content).toContain('okayyishhhh');
  });

  test('hello world - simple assertion', () => {
    // Simple hello world test
    const message = 'Hello World';
    expect(message).toBe('Hello World');
  });

  test('hello world - verify string contains text', () => {
    // Verify string contains expected text
    const greeting = 'Hello World from Playwright';
    expect(greeting).toContain('Hello World');
  });
});
