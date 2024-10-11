describe('Order Page Search Validation', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000/order');
  });

  it('Displays error message for non-integer Order ID', () => {
    cy.get('input[name="orderId"]').type('abc123');


    cy.contains('button', 'Search').click();
  
    cy.get('p').contains('Error: Your input type is not an integer').should('be.visible');
  });

});
