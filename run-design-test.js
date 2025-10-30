const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runDesignTest() {
  console.log('Starting design test...');

  // Ensure test-results directory exists
  const testResultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }

  console.log('Running Playwright test to capture hero design...');

  // Run the specific test
  const testCommand = 'npx playwright test tests/hero-design-test.spec.ts --project=chromium-large-screen';

  exec(testCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Test execution error:', error);
      console.log('You may need to install Playwright browsers first:');
      console.log('npx playwright install');
      return;
    }

    if (stderr) {
      console.log('Test stderr:', stderr);
    }

    console.log('Test output:', stdout);
    console.log('\nDesign test completed!');
    console.log('Screenshots should be available in the test-results directory');

    // List generated screenshots
    try {
      const files = fs.readdirSync(testResultsDir);
      const screenshots = files.filter(file => file.endsWith('.png'));

      if (screenshots.length > 0) {
        console.log('\nGenerated screenshots:');
        screenshots.forEach(screenshot => {
          console.log(`- ${screenshot}`);
        });
      } else {
        console.log('\nNo screenshots found. The test may have failed.');
      }
    } catch (listError) {
      console.log('Could not list screenshots:', listError.message);
    }
  });
}

runDesignTest();