const fs = require('fs');

// Read test output
const testOutput = JSON.parse(fs.readFileSync('./test-output.json', 'utf8'));

// Calculate statistics
const totalTests = testOutput.length;
const passedTests = testOutput.filter(test => test.passed).length;
const failedTests = totalTests - passedTests;
const passPercentage = ((passedTests / totalTests) * 100).toFixed(2);

// Create comparison report
const report = {
  summary: {
    totalTests,
    passedTests,
    failedTests,
    passPercentage: `${passPercentage}%`
  },
  details: testOutput,
  timestamp: new Date().toISOString()
};

// Save comparison report
fs.writeFileSync('./test-comparison.json', JSON.stringify(report, null, 2));
console.log('Test Comparison Report:');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Pass Rate: ${passPercentage}%`);
console.log('\nDetailed results saved to test-comparison.json');
