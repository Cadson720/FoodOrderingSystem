describe('Order Management - Invalid Order ID Test', () => {
  beforeEach(() => {
    // Visit the Order page
    cy.visit('http://localhost:3000/order');
  });

  it('Displays error message for non-integer Order ID input', () => {
    // Enter a non-integer value for Order ID
    cy.get('input[name="orderId"]').type('abc123');

    // Click the Search button
    cy.contains('button', 'Search').click();

    // Check if the error message appears
    cy.get('p').should('contain', 'Error: Your input type is not an integer').and('have.css', 'color', 'rgb(255, 0, 0)');
  });
});


  