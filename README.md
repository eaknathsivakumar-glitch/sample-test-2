# revolte-testing-backend

## Add Numbers Feature

This project includes a simple utility function to add two numbers with comprehensive testing.

### Files Added

- **src/utils/addNumbers.js** - Core utility function that adds two numbers
- **test.js** - Test script that runs 5 test cases for the addNumbers function
- **compare-results.js** - Script to analyze and compare test results
- **test-output.json** - Generated file containing raw test results
- **test-comparison.json** - Generated file containing detailed test comparison report

### Usage

#### Running the Tests

```bash
node test.js
```

This will execute all test cases and save the results to `test-output.json`.

#### Comparing Test Results

```bash
node compare-results.js
```

This will analyze the test output and generate a detailed comparison report in `test-comparison.json`.

### Test Cases

The test script includes 5 test cases:
1. 2 + 3 = 5
2. 10 + 20 = 30
3. -5 + 5 = 0
4. 100 + 50 = 150
5. 0 + 0 = 0

### Output Files

- **test-output.json** - Contains raw test results with input, expected, actual, and pass/fail status
- **test-comparison.json** - Contains a summary report with total tests, passed/failed counts, and pass percentage