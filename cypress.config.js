// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',  // 确保模式匹配所有测试文件
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
