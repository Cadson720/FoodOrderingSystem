describe('Payment Page Functional Test', () => {
    beforeEach(() => {
        // 访问支付页面
        cy.visit('http://localhost:3000/Payment');
    });

    it('should validate credit card form and submit payment', () => {
        // 输入信用卡号码
        cy.get('#cardNumber').type('1234567812345678');
        // 输入到期日期
        cy.get('#expiryDate').type('12/24');
        // 输入CVV
        cy.get('#cvv').type('123');

        // 点击提交按钮
        cy.get('.submit-button').click();

        // 确保订单创建成功的提示出现
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Order has been successfully created from cart!');
        });

        // 可以在这里添加进一步的断言来验证后端数据状态
        // 比如使用 Cypress Task 或其他 API 检查数据库状态（这需要后端支持或另行配置）
    });
});
