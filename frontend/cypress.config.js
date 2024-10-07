const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000', // Ensure this is the correct base URL
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // This ensures Cypress looks for test files in the e2e folder
        supportFile: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here if needed
        },
    },
});
