const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',  // 确保 baseUrl 是正确的
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',  // 默认测试文件路径模式
    supportFile: false,  // 如果不使用支持文件，可以设置为false
  },
});
