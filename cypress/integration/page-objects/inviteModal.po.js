export class InviteModalPo {
  getModalTitle() {
    return cy.get('h5.modal-title', {timeout: 5000}).scrollIntoView();
  }

  getSubmitButton() {
    return cy.contains('立即邀请').scrollIntoView();
  }

  inputMember(userName) {
    return cy.get('.modal-body input').scrollIntoView().click({force: true}).clear().type(userName);
  }

  getEmpty() {
    return cy.get('.member-list div.empty-text');
  }

  closeModal() {
    cy.get('bd-icon[type = "close"]').click({force: true});
  }

  getToast() {
    return cy.get('span.message-text');
  }


  addMember(userName) {
    this.inputMember(userName);
    cy.contains('.member-list app-member-item', userName).scrollIntoView().click({force: true});
    this.getSubmitButton().click({force: true});
  }

  deleteMember(userName) {
    cy.contains('app-member-item > div', userName).scrollIntoView().siblings().within(() => {
      cy.get('[type = "delete"]').click({force: true});
    });
  }



}
