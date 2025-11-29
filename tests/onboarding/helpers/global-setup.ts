/**
 * Global Setup for Onboarding Tests
 * Runs before all tests
 */

import { config } from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from .env.local or .env files
// This is a fallback in case they weren't loaded in playwright.config.ts
const envPath = path.resolve(__dirname, "../../.env.local");
const envFallback = path.resolve(__dirname, "../../.env");

// Load .env.local first (takes precedence), then .env as fallback
const envLocalResult = config({ path: envPath });
const envResult = config({ path: envFallback });

// Store which file was actually loaded (for diagnostics)
const envFileLoaded = envLocalResult.parsed
  ? ".env.local"
  : envResult.parsed
  ? ".env"
  : null;

async function globalSetup() {
  // Suppress noisy console messages during test setup
  const originalWarn = console.warn;
  const originalError = console.error;

  // Filter out known noisy messages
  console.warn = (...args: unknown[]) => {
    const message = String(args[0] || "");
    if (
      message.includes("Webpack is configured while Turbopack") ||
      message.includes("Arcjet will use 127.0.0.1") ||
      message.includes("Failed to create telemetry flag file") ||
      message.includes("mkdir is not a function")
    ) {
      return; // Suppress these messages
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args: unknown[]) => {
    const message = String(args[0] || "");
    if (
      message.includes("Failed to create telemetry flag file") ||
      message.includes("mkdir is not a function")
    ) {
      return; // Suppress these messages
    }
    originalError.apply(console, args);
  };

  console.log("\n🚀 Starting Onboarding Test Suite...\n");
  console.log("📝 Test Configuration:");
  console.log(
    `   Base URL: ${process.env.BASE_URL || "http://localhost:3001"}`
  );
  console.log(`   Headless: ${process.env.HEADLESS !== "false"}`);
  console.log(`   CI Mode: ${process.env.CI ? "Yes" : "No"}`);

  // Show which env file was loaded
  if (envFileLoaded) {
    console.log(`   Environment file: ${envFileLoaded} ✓`);
  } else {
    const envLocalExists = fs.existsSync(envPath);
    const envExists = fs.existsSync(envFallback);
    if (envLocalExists || envExists) {
      console.log(`   Environment file: Found but no variables loaded`);
    } else {
      console.log(
        "   Environment file: ⚠️  Not found (create .env.local in project root)"
      );
    }
  }
  console.log("");

  // Check environment variables
  const requiredEnvVars = ["CLERK_SECRET_KEY"];
  const optionalEnvVars = ["GITHUB_TOKEN", "NEXT_PUBLIC_FIREBASE_API_KEY"];
  const missingVars: string[] = [];
  const loadedVars: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      loadedVars.push(varName);
    }
  });

  if (loadedVars.length > 0) {
    console.log("✅ Loaded environment variables:");
    loadedVars.forEach((varName) => console.log(`   ✓ ${varName}`));
  }

  if (missingVars.length > 0) {
    console.warn("⚠️  Missing required environment variables:");
    missingVars.forEach((varName) => console.warn(`   ✗ ${varName}`));
    console.warn("   Some tests may be skipped.\n");
  }

  // Check optional vars
  const missingOptional = optionalEnvVars.filter((v) => !process.env[v]);
  if (
    missingOptional.length > 0 &&
    missingOptional.length < optionalEnvVars.length
  ) {
    console.log(
      "ℹ️  Some optional variables are missing (tests will still run)"
    );
  }

  console.log("");

  // Restore original console methods after setup
  setTimeout(() => {
    console.warn = originalWarn;
    console.error = originalError;
  }, 1000);
}

export default globalSetup;
