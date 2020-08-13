export class UserInfoPo {
  getUserInfoTabs() {
    return cy.get('app-page-nav.top-nav');
  }

  selectUserInfoTabsByName(tabName) {
    cy.wait(1000);
    this.getUserInfoTabs().contains(tabName).click({force: true});
  }

  getSubmitButton() {
    return cy.contains('更新设置');
  }

  getToast() {
    return cy.get('span.message-text');
  }


  // 重置密码，getToast和getButton定位都可以复用个人主页的
  inputOldPassword(oldPassword) {
    return cy.get('input#_bee-old-password').click({force: true}).clear().type(oldPassword);
  }

  inputNewPassword(newPassword) {
    return cy.get('input#_bee-new-password').click({force: true}).clear().type(newPassword);
  }

  inputConfirmPassword(confirmPassword) {
    return cy.get('input#_bee-confirm-password').click({force: true}).clear().type(confirmPassword);
  }

  getNewPasswordException() {
    return cy.get('div.input-group div.invalid-feedback').eq(0)
  }

  getConfirmPasswordException() {
    return cy.get('div.input-group div.invalid-feedback').eq(1)
  }

  resetPassword(oldPassword, newPassword, confirmPassword) {
    this.inputOldPassword(oldPassword);
    this.inputNewPassword(newPassword);
    this.inputConfirmPassword(confirmPassword);
    this.getSubmitButton().click({force: true});
  }
}

