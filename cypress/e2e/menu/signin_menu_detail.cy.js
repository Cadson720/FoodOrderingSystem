describe('Menu Page Navigation Test', () => {
    beforeEach(() => {
        // Mock the authentication state
        window.localStorage.setItem('isAuthenticated', 'true');
        // You might need to adjust the key name based on how your app handles auth state
    });

    it('should navigate to the menu page and verify the page loads correctly', () => {
        // Start at home page as if already logged in
        cy.visit('/');

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