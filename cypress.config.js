const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false, // 禁用 supportFile
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
