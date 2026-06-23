const addNumbers = require('./src/utils/addNumbers');
const fs = require('fs');

// Test cases
const testCases = [
  { a: 2, b: 3, expected: 5 },
  { a: 10, b: 20, expected: 30 },
  { a: -5, b: 5, expected: 0 },
  { a: 100, b: 50, expected: 150 },
  { a: 0, b: 0, expected: 0 }
];

// Run tests
const results = testCases.map((test, index) => {
  const result = addNumbers(test.a, test.b);
  const passed = result === test.expected;
  return {
    testNumber: index + 1,
    input: `${test.a} + ${test.b}`,
    expected: test.expected,
    actual: result,
    passed: passed
  };
});

// Save results to output file
fs.writeFileSync('./test-output.json', JSON.stringify(results, null, 2));
console.log('Test results saved to test-output.json');
