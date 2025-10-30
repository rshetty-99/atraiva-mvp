const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple screenshot attempt
async function captureScreenshot() {
  const resultsDir = path.join(process.cwd(), 'test-results');

  // Ensure directory exists
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // Create a simple HTML file to test if we can capture Figma
  const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Figma Test</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        iframe { width: 100%; height: 800px; border: none; }
        .message { background: #f0f0f0; padding: 20px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="message">
        <h2>Attempting to Load Figma Prototype</h2>
        <p>URL: https://www.figma.com/proto/fPXwXN8jzKLA7a8p2qAmkJ/Atraiva.ai?node-id=629-1408&t=3XvOizEMbw18FYjb-0&scaling=min-zoom&content-scaling=fixed&page-id=1%3A5</p>
    </div>
    <iframe src="https://www.figma.com/proto/fPXwXN8jzKLA7a8p2qAmkJ/Atraiva.ai?node-id=629-1408&t=3XvOizEMbw18FYjb-0&scaling=min-zoom&content-scaling=fixed&page-id=1%3A5"
            title="Figma Prototype">
    </iframe>
</body>
</html>`;

  // Write test file
  fs.writeFileSync(path.join(resultsDir, 'figma-test.html'), testHtml);

  console.log('Created figma-test.html in test-results directory');
  console.log('Note: Figma prototypes may require authentication or have embedding restrictions');

  return path.join(resultsDir, 'figma-test.html');
}

captureScreenshot();