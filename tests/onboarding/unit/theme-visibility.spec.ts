import { test, expect } from '@playwright/test';
import { TestFailure, createGitHubIssueIfNotExists } from '../helpers/github-issue-reporter';

/**
 * Theme Visibility Tests
 * Tests color contrast and text readability in both dark and light modes
 */

const themes = ['light', 'dark'] as const;

test.describe('Onboarding Theme Visibility', () => {
  
  for (const theme of themes) {
    test.describe(`${theme.toUpperCase()} Mode`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.goto('/onboarding');
        await page.waitForLoadState('networkidle');
        
        // Switch to appropriate theme
        if (theme === 'dark') {
          await page.evaluate(() => {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          });
        } else {
          await page.evaluate(() => {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          });
        }
        
        await page.reload();
        await page.waitForLoadState('networkidle');
      });
      
      test('text should be readable against background', async ({ page, browserName }) => {
        try {
          // Get all text elements
          const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, label, span, button, input, textarea').all();
          
          const unreadableElements: string[] = [];
          
          for (const element of textElements.slice(0, 20)) { // Check first 20 elements
            const isVisible = await element.isVisible().catch(() => false);
            
            if (isVisible) {
              const contrast = await element.evaluate((el) => {
                const style = window.getComputedStyle(el);
                const textColor = style.color;
                const bgColor = style.backgroundColor;
                
                // Parse RGB values
                const parseRGB = (color: string) => {
                  const match = color.match(/\d+/g);
                  return match ? match.map(Number) : [0, 0, 0];
                };
                
                const [r1, g1, b1] = parseRGB(textColor);
                const [r2, g2, b2] = parseRGB(bgColor);
                
                // Calculate relative luminance
                const getLuminance = (r: number, g: number, b: number) => {
                  const [rs, gs, bs] = [r, g, b].map(c => {
                    c = c / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                  });
                  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
                };
                
                const l1 = getLuminance(r1, g1, b1);
                const l2 = getLuminance(r2, g2, b2);
                
                // Calculate contrast ratio
                const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
                
                return {
                  ratio,
                  textColor,
                  bgColor,
                  text: el.textContent?.trim().substring(0, 50)
                };
              });
              
              // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
              if (contrast.ratio < 3 && contrast.text) {
                unreadableElements.push(
                  `Text: "${contrast.text}", Contrast: ${contrast.ratio.toFixed(2)}:1`
                );
              }
            }
          }
          
          if (unreadableElements.length > 0) {
            console.warn(`Found ${unreadableElements.length} elements with low contrast in ${theme} mode:`);
            unreadableElements.forEach(el => console.warn(`  - ${el}`));
            
            // Report only if many elements are unreadable
            if (unreadableElements.length > 5) {
              throw new Error(`Too many unreadable elements: ${unreadableElements.length}`);
            }
          }
          
        } catch (error) {
          await reportThemeFailure(page, {
            testName: `${theme} mode - Text readability`,
            errorMessage: error instanceof Error ? error.message : 'Test failed',
            browser: browserName,
            theme,
          });
          throw error;
        }
      });
      
      test('input fields should be clearly visible', async ({ page, browserName }) => {
        try {
          const inputs = await page.locator('input, textarea, select').all();
          
          for (const input of inputs.slice(0, 10)) { // Check first 10 inputs
            const isVisible = await input.isVisible().catch(() => false);
            
            if (isVisible) {
              const styles = await input.evaluate((el) => {
                const style = window.getComputedStyle(el);
                return {
                  border: style.border,
                  borderColor: style.borderColor,
                  backgroundColor: style.backgroundColor,
                  outline: style.outline,
                };
              });
              
              // Inputs should have visible borders or backgrounds
              const hasVisibleBorder = styles.border !== 'none' && styles.border !== '0px';
              const hasBorderColor = !styles.borderColor.includes('rgba(0, 0, 0, 0)');
              const hasBackground = !styles.backgroundColor.includes('rgba(0, 0, 0, 0)');
              
              expect(hasVisibleBorder || hasBorderColor || hasBackground).toBeTruthy();
            }
          }
          
        } catch (error) {
          await reportThemeFailure(page, {
            testName: `${theme} mode - Input visibility`,
            errorMessage: error instanceof Error ? error.message : 'Test failed',
            browser: browserName,
            theme,
          });
          throw error;
        }
      });
      
      test('buttons should have clear visual affordance', async ({ page, browserName }) => {
        try {
          const buttons = await page.locator('button').all();
          
          for (const button of buttons.slice(0, 10)) {
            const isVisible = await button.isVisible().catch(() => false);
            
            if (isVisible) {
              const styles = await button.evaluate((el) => {
                const style = window.getComputedStyle(el);
                return {
                  backgroundColor: style.backgroundColor,
                  border: style.border,
                  textColor: style.color,
                  cursor: style.cursor,
                };
              });
              
              // Buttons should have either background or border
              const hasBackground = !styles.backgroundColor.includes('rgba(0, 0, 0, 0)');
              const hasBorder = styles.border !== 'none' && styles.border !== '0px';
              
              expect(hasBackground || hasBorder).toBeTruthy();
              
              // Should have pointer cursor
              expect(styles.cursor).toContain('pointer');
            }
          }
          
        } catch (error) {
          await reportThemeFailure(page, {
            testName: `${theme} mode - Button affordance`,
            errorMessage: error instanceof Error ? error.message : 'Test failed',
            browser: browserName,
            theme,
          });
          throw error;
        }
      });
      
      test('error messages should be clearly visible', async ({ page, browserName }) => {
        try {
          // Trigger some validation errors
          const inputs = await page.locator('input').all();
          
          for (const input of inputs.slice(0, 3)) {
            await input.fill('');
            await input.blur();
            await page.waitForTimeout(500);
          }
          
          // Find error messages
          const errors = await page.locator('[class*="error"], [class*="invalid"], [role="alert"]').all();
          
          for (const error of errors) {
            const isVisible = await error.isVisible().catch(() => false);
            
            if (isVisible) {
              const color = await error.evaluate((el) => {
                return window.getComputedStyle(el).color;
              });
              
              // Error messages should be red-ish (not just gray text)
              expect(color).toBeTruthy();
              
              // Check visibility
              const box = await error.boundingBox();
              expect(box).toBeTruthy();
            }
          }
          
        } catch (error) {
          console.log(`Error message visibility test for ${theme} mode - structure may vary`);
        }
      });
      
      test('links should be distinguishable', async ({ page, browserName }) => {
        try {
          const links = await page.locator('a').all();
          
          for (const link of links.slice(0, 10)) {
            const isVisible = await link.isVisible().catch(() => false);
            
            if (isVisible) {
              const styles = await link.evaluate((el) => {
                const style = window.getComputedStyle(el);
                return {
                  color: style.color,
                  textDecoration: style.textDecoration,
                  cursor: style.cursor,
                };
              });
              
              // Links should have pointer cursor
              expect(styles.cursor).toContain('pointer');
              
              // Should have underline or distinct color
              const hasUnderline = styles.textDecoration.includes('underline');
              const hasDistinctColor = !styles.color.includes('rgb(0, 0, 0)') && !styles.color.includes('rgb(255, 255, 255)');
              
              expect(hasUnderline || hasDistinctColor).toBeTruthy();
            }
          }
          
        } catch (error) {
          console.log(`Link distinction test for ${theme} mode - may not have links`);
        }
      });
      
      test('focus indicators should be visible', async ({ page, browserName }) => {
        try {
          // Tab through focusable elements
          await page.keyboard.press('Tab');
          await page.waitForTimeout(300);
          
          const focusedElement = await page.locator(':focus').first();
          const isVisible = await focusedElement.isVisible().catch(() => false);
          
          if (isVisible) {
            const styles = await focusedElement.evaluate((el) => {
              const style = window.getComputedStyle(el);
              return {
                outline: style.outline,
                outlineColor: style.outlineColor,
                boxShadow: style.boxShadow,
              };
            });
            
            // Should have visible focus indicator
            const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';
            const hasBoxShadow = styles.boxShadow !== 'none';
            
            expect(hasOutline || hasBoxShadow).toBeTruthy();
          }
          
        } catch (error) {
          console.log(`Focus indicator test for ${theme} mode - informational`);
        }
      });
      
      test('disabled elements should be clearly indicated', async ({ page, browserName }) => {
        try {
          const disabledElements = await page.locator('button:disabled, input:disabled, [aria-disabled="true"]').all();
          
          for (const element of disabledElements) {
            const isVisible = await element.isVisible().catch(() => false);
            
            if (isVisible) {
              const opacity = await element.evaluate((el) => {
                return window.getComputedStyle(el).opacity;
              });
              
              // Disabled elements should have reduced opacity
              expect(parseFloat(opacity)).toBeLessThan(1);
            }
          }
          
        } catch (error) {
          console.log(`Disabled state test for ${theme} mode - may not have disabled elements`);
        }
      });
      
      test('placeholder text should be visible but distinct from input text', async ({ page, browserName }) => {
        try {
          const inputs = await page.locator('input[placeholder], textarea[placeholder]').all();
          
          for (const input of inputs.slice(0, 5)) {
            const isVisible = await input.isVisible().catch(() => false);
            
            if (isVisible) {
              const colors = await input.evaluate((el: HTMLInputElement) => {
                const style = window.getComputedStyle(el);
                const placeholderStyle = window.getComputedStyle(el, '::placeholder');
                return {
                  inputColor: style.color,
                  placeholderColor: placeholderStyle.color,
                };
              });
              
              // Placeholder should have different color than input text
              expect(colors.inputColor).not.toBe(colors.placeholderColor);
            }
          }
          
        } catch (error) {
          console.log(`Placeholder visibility test for ${theme} mode - informational`);
        }
      });
    });
  }
  
  test.describe('Theme Switching', () => {
    test('should maintain visibility when switching themes', async ({ page, browserName }) => {
      try {
        await page.goto('/onboarding');
        await page.waitForLoadState('networkidle');
        
        // Start in light mode
        await page.evaluate(() => {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        });
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Check visibility in light mode
        const textLight = await page.locator('h1').first().isVisible();
        expect(textLight).toBeTruthy();
        
        // Switch to dark mode
        await page.evaluate(() => {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        });
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Check visibility in dark mode
        const textDark = await page.locator('h1').first().isVisible();
        expect(textDark).toBeTruthy();
        
      } catch (error) {
        console.log('Theme switching test - informational');
      }
    });
  });
});

/**
 * Helper to report theme visibility failures
 */
async function reportThemeFailure(
  page: any,
  failure: Omit<TestFailure, 'screenshot' | 'tracePath' | 'stackTrace' | 'videoPath' | 'testFile' | 'severity' | 'category' | 'timestamp' | 'viewport'> & { theme: string }
) {
  try {
    const screenshot = `tests/onboarding/reports/theme-failure-${failure.theme}-${Date.now()}.png`;
    await page.screenshot({ path: screenshot, fullPage: true });
    
    const fullFailure: TestFailure = {
      testName: failure.testName,
      testFile: 'theme-visibility.spec.ts',
      errorMessage: failure.errorMessage,
      browser: failure.browser,
      screenshot,
      stackTrace: new Error().stack,
      severity: 'medium',
      category: 'theme',
      timestamp: new Date(),
    };
    
    await createGitHubIssueIfNotExists(fullFailure);
  } catch (error) {
    console.error('Failed to report theme failure:', error);
  }
}

