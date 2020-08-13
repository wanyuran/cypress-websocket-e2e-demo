export class ConfirmModalPo {
  getModalTitle() {
    return cy.get('div.modal-header');
  }

  getModalBody() {
    return cy.get('div.modal-body.confirm-content');
  }

  getButtonByText(text) {
    return cy.contains('.modal-footer.confirm-footer > button', text);
  }

  confirmOperation(modalTitle, modalBody, operation) {
    this.getModalTitle().should('contain', modalTitle)
    this.getModalBody().should('contain', modalBody);
    this.getButtonByText(`确认${operation}`).click({force: true});
    cy.wait(1000);
  }

  /* 点掉各处的使用教程，modalTitle包含:
  * 1、首页：发现新功能
  * 2、任务详情页：任务库使用教程
  * 3、
  * */
  removeReminder(modalTitle) {
    this.getModalTitle().should('contain', modalTitle);
    cy.contains('div.footer', '我知道了').click({force: true});
    cy.wait(1000);
  }


}
