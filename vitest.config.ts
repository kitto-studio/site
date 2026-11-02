import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: [
            "tests/unit/**/*.test.{ts,tsx}",
            "src/plugins/**/__tests__/unit/**/*.test.{ts,tsx}"
          ]
        }
      },
      {
        test: {
          name: "integration",
          include: [
            "tests/integration/**/*.test.{ts,tsx}",
            "src/plugins/**/__tests__/integration/**/*.test.{ts,tsx}"
          ]
        }
      }
    ],
    coverage: {
      provider: "istanbul",
      // Pure logic only: lib helpers, the string registry and the custom plugins. Pages, layouts,
      // components and islands are covered by the integration build and the e2e suite.
      include: ["src/lib/**/*.{ts,tsx}", "src/i18n/**/*.ts", "src/plugins/**/*.ts"],
      exclude: ["src/**/types.ts", "src/**/types/**", "src/**/__tests__/**"],
      reporter: ["text", "lcov"],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 }
    }
  }
});
