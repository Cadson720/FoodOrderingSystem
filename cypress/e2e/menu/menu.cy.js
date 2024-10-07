describe('Menu Page Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/Menu'); // Assuming the menu page is at the root path
    });

    it('should load the menu page and display items', () => {
        cy.get('.menu-object').should('be.visible');
        cy.get('.menu-container').should('contain', 'Sydney Burgers');
        cy.get('.menu-item').should('have.length.greaterThan', 0);
    });

    it('should filter items based on search input', () => {
        cy.get('.menu-search').type('Pizza');
        cy.get('.menu-item').each($item => {
            cy.wrap($item).should('contain.text', 'Pizza');
        });
    });

    it('should navigate to item detail when clicking on a menu item', () => {
        cy.get('.menu-item-button').first().click();
        cy.url().should('include', '/menu/');
        cy.get('.menu-item-detail-container').should('be.visible');
    });
});
