describe('Menu Page Navigation Test', () => {
    beforeEach(() => {
        // Mock the authentication state
        window.localStorage.setItem('isAuthenticated', 'true');
        
        // Mock the API response for fetching menu items
        cy.intercept('GET', 'http://localhost:3001/api/menu', {
            statusCode: 200,
            body: [
                { id: 1, item_name: 'Margherita Pizza', description: 'Classic pizza with tomato, mozzarella, and basil', price: 12.99, category: 'Pizza', SOH: 10 },
                { id: 2, item_name: 'Pepperoni Pizza', description: 'Pepperoni, mozzarella, and tomato sauce', price: 14.99, category: 'Pizza', SOH: 15 },
                { id: 3, item_name: 'Caesar Salad', description: 'Fresh romaine, croutons, and Caesar dressing', price: 8.50, category: 'Salad', SOH: 20 }
            ]
        });

        // Visit the menu page
        cy.visit('http://localhost:3000/Menu');
    });

    it('should navigate to the menu page and verify the page loads correctly', () => {
        // Ensure the Menu page is loaded
        cy.url().should('eq', 'http://localhost:3000/Menu');

        // Verify that the 'Sydney Burgers' heading is visible
        cy.get('h1').contains('Sydney Burgers').should('be.visible');

        // Verify that the search input is present
        cy.get('input[placeholder="Search for items"]').should('be.visible');

        // Verify that menu items are displayed correctly
        cy.get('.menu-item').should('have.length', 3); // Ensure 3 menu items are displayed

        // Verify one of the menu items is displayed
        cy.contains('Margherita Pizza').should('be.visible');
        cy.contains('$12.99').should('be.visible');
    });

    it('should filter menu items based on search input', () => {
        // Enter search term to filter menu items
        cy.get('input[placeholder="Search for items"]').type('Caesar');

        // Verify that only the Caesar Salad is visible
        cy.contains('Caesar Salad').should('be.visible');
        cy.get('.menu-item').should('have.length', 1); // Only 1 item should be displayed
    });
});
