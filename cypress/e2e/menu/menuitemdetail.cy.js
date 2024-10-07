describe('Menu Item Detail Page Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/menu/1');
    });

    it('should load the menu item detail page', () => {
        cy.get('.menu-item-detail-container').should('be.visible');
        cy.get('.item-names').should('contain.text', 'Pizza');
    });

    it('should display correct item details', () => {
        cy.get('.item-description').should('be.visible');
        cy.get('.item-price').should('be.visible').and('contain', '$');
        cy.get('.item-category').should('contain.text', 'Pizza');
        cy.get('.item-stock').should('contain.text', 'Available');
    });

    it('should navigate back to the menu when clicking "Back to Menu" button', () => {
        cy.get('.back-button').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });
});
