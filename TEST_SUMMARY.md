# Playwright Test Case - Hello World Sample

## Files Created

### 1. Test File: `tests/hello-world.spec.js`
A Playwright test file containing 3 sample test cases that print "hello world":

- **Test 1: Print hello world** - Basic test that logs "hello world" to console
- **Test 2: Hello world with page navigation** - Test that navigates to about:blank and prints "hello world"
- **Test 3: Hello world basic assertion** - Test that verifies the "hello world" message

### 2. Configuration File: `playwright.config.js`
Standard Playwright configuration file with:
- Test directory set to `./tests`
- Support for Chromium, Firefox, and WebKit browsers
- HTML reporter enabled
- Trace collection on first retry

### 3. Git Configuration: `.gitignore`
Added to exclude:
- node_modules/
- Playwright test results and reports
- IDE and OS files
- Environment files

## How to Run Tests

Once Playwright is installed, run:
```bash
npx playwright test
```

To run a specific test:
```bash
npx playwright test tests/hello-world.spec.js
```

To run in UI mode:
```bash
npx playwright test --ui
```

## Test Output

Each test will:
1. Print "hello world" to the console
2. Verify assertions pass
3. Generate an HTML report in `playwright-report/`
