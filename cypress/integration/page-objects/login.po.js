import EnvConfig from '../../env.config';

export class LoginPo {
  getPageTitle(){
    return cy.get('h2.card-title');
  }
  getEmailField() {
    return cy.get('input[type="email"]');
  }

  getPasswordField() {
    return cy.get('input[placeholder="密码"]');
  }

  getSubmitButton() {
    return cy.get('button[type="submit"]').eq(0);
  }

  login(email, password, url = EnvConfig.domain) {
    cy.visit(url);
    cy.contains('a.header-left-login', '登录').click({force: true});
    this.getEmailField().type(email, {force: true});
    this.getPasswordField().type(password, {force: true});
    this.getSubmitButton().click({force: true});
  };

}
