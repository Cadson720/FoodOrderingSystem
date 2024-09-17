describe('Payment Page Functional Test', () => {
    beforeEach(() => {
        // 忽略来自应用的未捕获异常
        cy.on('uncaught:exception', (err, runnable) => {
            // 返回 false 以防止 Cypress 失败测试
            return false;
        });

        // 访问支付页面
        cy.visit('http://localhost:3000/payment');  // 修改为你的实际前端URL
    });

    it('should display validation errors for incorrect input', () => {
        // 输入无效的信用卡号
        cy.get('#cardNumber').type('1234');
        cy.get('.submit-button').should('be.disabled');  // 按钮应该是禁用的
        cy.contains('Credit card number must be 16 digits.').should('be.visible'); // 验证错误消息是否显示

        // 输入无效的到期日期
        cy.get('#expiryDate').type('13/99');
        cy.get('.submit-button').should('be.disabled');  // 按钮应该是禁用的
        cy.contains('Expiry date must be in MM/YY format.').should('be.visible'); // 验证错误消息是否显示

        // 输入无效的CVV
        cy.get('#cvv').type('12');
        cy.get('.submit-button').should('be.disabled');  // 按钮应该是禁用的
        cy.contains('CVV must be 3 digits.').should('be.visible'); // 验证错误消息是否显示
    });

    it('should enable the submit button when all inputs are valid and show "Payment submitted!" message on submit', () => {
        // 输入有效的信用卡号
        cy.get('#cardNumber').clear().type('1234567812345678');
        cy.get('.submit-button').should('be.disabled');  // 按钮依然禁用


        // 输入有效的到期日期
        cy.get('#expiryDate').clear().type('12/24');
        cy.get('.submit-button').should('be.disabled');  // 按钮依然禁用

        // 输入有效的CVV
        cy.get('#cvv').clear().type('123');
        cy.get('.submit-button').should('not.be.disabled');  // 按钮应该被启用

        // 点击提交按钮
        cy.get('.submit-button').click();

        // 模拟提交成功后的弹窗消息
        cy.on('window:alert', (text) => {
            expect(text).to.contains('Payment submitted!');
        });
    });
});
