"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [userAgent, setUserAgent] = useState<string>("");

  // Get viewport and user agent only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setUserAgent(navigator.userAgent);

      // Update viewport on resize
      const handleResize = () => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const addResult = (result: string) => {
    setTestResults((prev) => [...prev, result]);
  };

  const runTests = async () => {
    setTestResults(["🧪 Starting Atraiva Homepage Tests..."]);

    // Test 1: Check viewport
    if (typeof window !== "undefined") {
      const currentViewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      addResult(`📱 Current viewport: ${currentViewport.width}x${currentViewport.height}`);

      // Test 2: Check if we're on the right page
      if (window.location.pathname === "/test") {
        addResult("✅ Test page loaded correctly");
      }

      // Test 4: Responsive breakpoint detection
      if (currentViewport.width < 640) {
        addResult("📱 Mobile viewport detected");
      } else if (currentViewport.width < 1024) {
        addResult("📱 Tablet viewport detected");
      } else {
        addResult("🖥️ Desktop viewport detected");
      }
    } else {
      addResult("⚠️ Window object not available (server-side rendering)");
    }

    // Test 3: Check if main page is accessible
    try {
      const response = await fetch("/");
      if (response.ok) {
        addResult("✅ Main homepage is accessible");
      } else {
        addResult("❌ Main homepage not accessible");
      }
    } catch (error) {
      addResult("❌ Error accessing homepage");
    }

    addResult("🏁 Test completed!");
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Atraiva Homepage Test Suite
          </h1>
          <p className="text-muted-foreground">
            Test the homepage functionality and responsiveness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Test Controls */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-y-4">
              <Button onClick={runTests} className="w-full">
                Run Homepage Tests
              </Button>
              <Button
                onClick={clearResults}
                variant="outline"
                className="w-full"
              >
                Clear Results
              </Button>
              <Button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open("/", "_blank");
                  }
                }}
                variant="secondary"
                className="w-full"
              >
                Open Homepage in New Tab
              </Button>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Viewport:</span>{" "}
                {viewport.width > 0
                  ? `${viewport.width}x${viewport.height}`
                  : "Loading..."}
              </div>
              <div>
                <span className="font-medium">User Agent:</span>
                <span className="text-xs">
                  {userAgent ? `${userAgent.slice(0, 50)}...` : "Loading..."}
                </span>
              </div>
              <div>
                <span className="font-medium">Time:</span>{" "}
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-muted rounded-md p-4 font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-muted-foreground">
                Click "Run Homepage Tests" to start testing...
              </div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manual Test Instructions */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Manual Test Instructions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Logo Test</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Navigate to homepage</li>
                <li>• Check header logo displays</li>
                <li>• Check footer logo displays</li>
                <li>• Resize window to test responsive scaling</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Theme Toggle Test</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Look for sun/moon icon in header</li>
                <li>• Click to toggle themes</li>
                <li>• Verify smooth transition</li>
                <li>• Check logo visibility in both themes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Responsive Test</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Test at 375px width (mobile)</li>
                <li>• Test at 768px width (tablet)</li>
                <li>• Test at 1200px+ width (desktop)</li>
                <li>• Check hamburger menu on mobile</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Content Test</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Verify "Protect. Comply. Automate." headline</li>
                <li>• Check all sections load</li>
                <li>• Test smooth scrolling</li>
                <li>• Verify animations work</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Browser Console Test */}
        <div className="mt-6 bg-accent/10 border border-accent/20 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-accent">
            Browser Console Test
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Copy and paste this code into your browser console on the homepage:
          </p>
          <code className="block bg-muted p-2 rounded text-xs overflow-x-auto">
            fetch('/test-homepage.js').then(r =&gt; r.text()).then(code =&gt;
            eval(code))
          </code>
        </div>
      </div>
    </div>
  );
}
