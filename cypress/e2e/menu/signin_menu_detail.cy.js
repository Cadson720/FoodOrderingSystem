describe('Menu Page Navigation Test', () => {
    it('should navigate to the menu page and verify the page loads correctly', () => {
        // Visit the sign-in page
        cy.visit('/signin');

        // Input valid email and phone number using the placeholder attribute
        cy.get('input[placeholder="Enter your email"]').type('test@example.com');
        cy.get('input[placeholder="Enter your phone number"]').type('1234567890');

        // Submit the sign-in form
        cy.get('button[type="submit"]').click();

        // Ensure we are redirected to the home page after login
        cy.url().should('eq', 'http://localhost:3000/');

        // Navigate to the Menu page using the navbar
        cy.get('a.nav-link').contains('Menu').click();

        // Ensure the Menu page is loaded
        cy.url().should('eq', 'http://localhost:3000/Menu');

        // Verify that the 'Sydney Burgers' heading is visible
        cy.get('h1').contains('Sydney Burgers').should('be.visible');

        // Verify that the search input is present
        cy.get('input[placeholder="Search for items"]').should('be.visible');
    });
});
