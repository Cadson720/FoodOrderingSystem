describe('Order Page Search Validation', () => {
  
  beforeEach(() => {
    // Navigate to the order page before each test
    cy.visit('http://localhost:3001/order');
  });

  it('Displays error message for non-integer Order ID', () => {
    // Input a non-integer value into the Order ID field
    cy.get('input[name="orderId"]').type('abc123');

    // Click the Search button
    cy.contains('button', 'Search').click();

    // Assert that the error message is displayed
    cy.get('p').contains('Error: Your input type is not an integer').should('be.visible');
  });

});
