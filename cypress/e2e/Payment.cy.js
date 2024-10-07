describe('Payment Page Functional Test', () => {
    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        cy.session('login', () => {
            // 访问登录页面并输入 email 和 phone 进行登录
            cy.visit('http://localhost:3000/signin');
            cy.get('input[placeholder="Enter your email"]').type('test@example.com');
            cy.get('input[placeholder="Enter your phone number"]').type('1234567890');
            cy.get('.signin-button').click();

            // 确保登录成功后跳转到首页或其他页面
            cy.url().should('not.include', '/signin');
        });

        // 登录成功后访问支付页面
        cy.visit('http://localhost:3000/payment');
    });

    it('should display validation errors for incorrect input', () => {
        // 测试无效输入的表单验证
        cy.get('#cardNumber').type('1234');  // 输入无效的卡号
        cy.get('.submit-button').should('be.disabled');  // 确保提交按钮禁用
        cy.contains('Credit card number must be 16 digits.').should('be.visible');  // 验证错误消息

        cy.get('#cardNumber').clear().type('1234123412341234');  // 输入有效的卡号
        cy.get('.submit-button').should('be.disabled');  // 按钮依然禁用
        cy.contains('✓').should('be.visible');  // 验证卡号正确标记

        cy.get('#expiryDate').type('13/99');  // 输入无效的到期日期
        cy.get('.submit-button').should('be.disabled');
        cy.contains('Expiry date must be in MM/YY format.').should('be.visible');  // 验证错误消息

        cy.get('#cvv').type('12');  // 输入无效的 CVV
        cy.get('.submit-button').should('be.disabled');
        cy.contains('CVV must be 3 digits.').should('be.visible');  // 验证错误消息
    });

    it('should enable the submit button when all inputs are valid and show "Payment submitted!" message on submit', () => {
        // 测试有效输入并提交表单
        cy.get('#cardNumber').clear().type('1234567812345678');  // 输入有效的卡号
        cy.get('.submit-button').should('be.disabled');  // 按钮依然禁用

        cy.get('#expiryDate').clear().type('12/24');  // 输入有效的到期日期
        cy.get('.submit-button').should('be.disabled');

        cy.get('#cvv').clear().type('123');  // 输入有效的 CVV
        cy.get('.submit-button').should('not.be.disabled');  // 按钮启用

        cy.get('.submit-button').click();  // 点击提交按钮

        cy.on('window:alert', (text) => {
            expect(text).to.contains('Payment submitted!');  // 验证成功提示信息
        });
    });
});
