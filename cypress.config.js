const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  screenshotOnRunFailure: true,
  trashAssetsBeforeRuns: true,
  video: true,
  projectId: process.env.CYPRESS_PROJECT_ID || undefined,
  reporter: "mocha-junit-reporter",
  reporterOptions: {
    mochaFile: "cypress/reports/junit/test-results-[hash].xml",
  },

  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
