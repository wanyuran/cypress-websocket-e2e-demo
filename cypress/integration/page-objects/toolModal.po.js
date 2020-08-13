export class ToolModalPo {
  getModalTitle() {
    return cy.get('div.modal-content div.title');
  }

  // 根据toolName添加工具，并对工具数量加（operation = 'plus'）减（operation = 'minus'）
  selectTaskToolByName(toolName, operation, count) {
    let i;
    return cy.contains('app-tool-template-card', toolName).within(() => {
      for (i = 1; i <= count; i++) {
        cy.get(`button.btn-${operation}`).click({force: true});
      }
    });
  }

  getSelectedToolsCount() {
    return cy.get('div.selected-message > span');
  }

  getSubmitButton() {
    return cy.contains('确认添加');
  }

  selectTaskTools(toolArray, operation, count) {
    cy.wait(1000);
    this.getModalTitle().should('contain', '选择工具卡片');
    toolArray.forEach(tool => {
      this.selectTaskToolByName(tool, operation, count);
    });
    this.getSelectedToolsCount().should($count => {
      expect($count.text()).to.equal(`${count * toolArray.length}`);
    });
    this.getSubmitButton().click({force: true});
  }
}
