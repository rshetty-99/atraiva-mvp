// Simple test script to verify Atraiva homepage functionality
// Run this in browser console at http://localhost:3006

console.log('🧪 Atraiva Homepage Test Suite Starting...\n');

// Test 1: Check if logo loads
function testLogo() {
  console.log('1. Testing Logo Loading...');
  const logoImages = document.querySelectorAll('img[alt*="Atraiva"]');
  if (logoImages.length > 0) {
    logoImages.forEach((img, index) => {
      if (img.complete && img.naturalHeight !== 0) {
        console.log(`✅ Logo ${index + 1} loaded successfully`);
      } else {
        console.log(`❌ Logo ${index + 1} failed to load`);
      }
    });
  } else {
    console.log('❌ No Atraiva logos found');
  }
}

// Test 2: Check responsive design
function testResponsiveness() {
  console.log('\n2. Testing Responsive Design...');
  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1200, height: 800, name: 'Desktop' }
  ];
  
  const currentViewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log(`Current viewport: ${currentViewport.width}x${currentViewport.height}`);
  
  // Check if mobile menu is visible on small screens
  const mobileMenu = document.querySelector('.lg\\:hidden');
  const desktopNav = document.querySelector('.hidden.lg\\:flex');
  
  if (currentViewport.width < 1024) {
    console.log(mobileMenu ? '✅ Mobile menu found' : '❌ Mobile menu not found');
  } else {
    console.log(desktopNav ? '✅ Desktop navigation found' : '❌ Desktop navigation not found');
  }
}

// Test 3: Check theme toggle
function testThemeToggle() {
  console.log('\n3. Testing Theme Toggle...');
  const themeButton = document.querySelector('[data-slot="button"]:has(svg)');
  const html = document.documentElement;
  
  if (themeButton) {
    console.log('✅ Theme toggle button found');
    
    // Check current theme
    const isDark = html.classList.contains('dark');
    console.log(`Current theme: ${isDark ? 'Dark' : 'Light'}`);
    
    // Test theme switching (uncomment to test)
    // themeButton.click();
    // setTimeout(() => {
    //   const newIsDark = html.classList.contains('dark');
    //   console.log(`Theme after click: ${newIsDark ? 'Dark' : 'Light'}`);
    //   console.log(isDark !== newIsDark ? '✅ Theme toggle working' : '❌ Theme toggle not working');
    // }, 100);
  } else {
    console.log('❌ Theme toggle button not found');
  }
}

// Test 4: Check page sections
function testPageSections() {
  console.log('\n4. Testing Page Sections...');
  const sections = [
    { name: 'Header', selector: 'header' },
    { name: 'Hero', selector: 'section:has(h1)' },
    { name: 'Features', selector: 'section[id="features"]' },
    { name: 'Solutions', selector: 'section[id="solutions"]' },
    { name: 'CTA', selector: 'section:has(button:contains("Free Trial"))' },
    { name: 'Footer', selector: 'footer' }
  ];
  
  sections.forEach(section => {
    const element = document.querySelector(section.selector);
    console.log(element ? `✅ ${section.name} section found` : `❌ ${section.name} section missing`);
  });
}

// Test 5: Check animations
function testAnimations() {
  console.log('\n5. Testing Animations...');
  const animatedElements = document.querySelectorAll('[style*="transform"], [style*="opacity"]');
  console.log(`Found ${animatedElements.length} animated elements`);
  
  // Check if Framer Motion is loaded
  if (window.MotionGlobalConfig) {
    console.log('✅ Framer Motion detected');
  } else {
    console.log('⚠️ Framer Motion may not be loaded');
  }
}

// Test 6: Check console errors
function checkConsoleErrors() {
  console.log('\n6. Checking for Errors...');
  const errors = [];
  const originalError = console.error;
  
  console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    if (errors.length === 0) {
      console.log('✅ No console errors detected');
    } else {
      console.log(`❌ Found ${errors.length} console errors:`);
      errors.forEach(error => console.log(`   - ${error}`));
    }
  }, 1000);
}

// Run all tests
function runAllTests() {
  testLogo();
  testResponsiveness();
  testThemeToggle();
  testPageSections();
  testAnimations();
  checkConsoleErrors();
  
  console.log('\n🏁 Test suite completed! Check results above.');
}

// Auto-run tests when script loads
runAllTests();

// Expose functions for manual testing
window.atraivaTests = {
  testLogo,
  testResponsiveness,
  testThemeToggle,
  testPageSections,
  testAnimations,
  checkConsoleErrors,
  runAllTests
};

console.log('\n💡 Run individual tests: atraivaTests.testLogo(), etc.');
console.log('💡 Run all tests again: atraivaTests.runAllTests()');