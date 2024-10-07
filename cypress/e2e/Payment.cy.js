describe('Payment Page Functional Test', () => {
    beforeEach(() => {

        cy.on('uncaught:exception', (err, runnable) => {

            return false;
        });

        cy.visit('http://localhost:3000/payment');
    });

    it('should display validation errors for incorrect input', () => {

        cy.get('#cardNumber').type('1234');
        cy.get('.submit-button').should('be.disabled');
        cy.contains('Credit card number must be 16 digits.').should('be.visible');

        cy.get('#cardNumber').clear().type('1234123412341234');
        cy.get('.submit-button').should('be.disabled');
        cy.contains('✓').should('be.visible');

        cy.get('#expiryDate').type('13/99');
        cy.get('.submit-button').should('be.disabled');
        cy.contains('Expiry date must be in MM/YY format.').should('be.visible');

        cy.get('#cvv').type('12');
        cy.get('.submit-button').should('be.disabled');
        cy.contains('CVV must be 3 digits.').should('be.visible');
    });

    it('should enable the submit button when all inputs are valid and show "Payment submitted!" message on submit', () => {

        cy.get('#cardNumber').clear().type('1234567812345678');
        cy.get('.submit-button').should('be.disabled');

        cy.get('#expiryDate').clear().type('12/24');
        cy.get('.submit-button').should('be.disabled');

        cy.get('#cvv').clear().type('123');
        cy.get('.submit-button').should('not.be.disabled');

        cy.get('.submit-button').click();

        cy.on('window:alert', (text) => {
            expect(text).to.contains('Payment submitted!');
        });
    });
});
