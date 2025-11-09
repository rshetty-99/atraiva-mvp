/**
 * Quick responsive check script
 * Checks for common responsive issues on pages
 */

const issues = [];

function checkPage(pagePath, viewport) {
  // This would be run in browser context
  const checks = {
    horizontalScroll: false,
    smallText: [],
    smallTouchTargets: [],
    overflowElements: [],
  };

  // Check horizontal scroll
  const bodyScrollWidth = document.body.scrollWidth;
  const viewportWidth = viewport.width;
  if (bodyScrollWidth > viewportWidth) {
    checks.horizontalScroll = bodyScrollWidth - viewportWidth;
  }

  // Check for small text on mobile
  if (viewport.width < 768) {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
    textElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      if (fontSize < 12 && el.textContent.trim().length > 0) {
        checks.smallText.push({
          element: el.tagName,
          fontSize: fontSize,
          text: el.textContent.substring(0, 50),
        });
      }
    });
  }

  // Check touch targets
  if (viewport.width < 768) {
    const buttons = document.querySelectorAll('button, a, [role="button"]');
    buttons.forEach((btn) => {
      const box = btn.getBoundingClientRect();
      if (box.width < 44 || box.height < 44) {
        checks.smallTouchTargets.push({
          element: btn.tagName,
          size: `${box.width.toFixed(0)}x${box.height.toFixed(0)}`,
        });
      }
    });
  }

  return checks;
}

module.exports = { checkPage };

