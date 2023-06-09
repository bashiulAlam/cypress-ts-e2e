import { defineConfig } from 'cypress'

module.exports = defineConfig({
  defaultCommandTimeout: 8000,
  watchForFileChanges: false,
  chromeWebSecurity: false,
  retries: {
    runMode: 1,
  },
  reporter: 'mochawesome',
  "reporterOptions": {
    "html": true,
    "json": true,
    "reportDir": "cypress/reports",
    "reportFilename": "report",
    "overwrite": true 
  },
  e2e: {
    baseUrl: 'https://demoqa.com/books'
  },
});
