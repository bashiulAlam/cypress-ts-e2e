import { defineConfig } from 'cypress'

module.exports = defineConfig({
  defaultCommandTimeout: 8000,
  watchForFileChanges: false,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'https://demoqa.com/books'
  },
});
