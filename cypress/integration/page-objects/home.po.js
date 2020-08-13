export class HomePo {
  getPageTitle() {
    return cy.get('.text-light.title');
  }

  getTrainerCampsField() {
    return cy.get('.row').last();
  }

  getCampCard(camp) {
    return cy
      .get('.row')
      .should('contain', camp)
      .contains('div > app-camp-card', camp)
      .scrollIntoView();
  }

  getCampTrainers(camp) {
    return this.getCampCard(camp).within(() => {
      cy.get('app-camp-members > div').children();
    });
  }

  // 训练营卡片hover上去出现的'查看训练营详情'&'邀请讲师'
  getCampButtonByText(camp, buttonText) {
    cy.wait(1000);
    return cy
      .contains('div > app-camp-card', camp)
      .scrollIntoView()
      .should('be.visible')
      .contains('button[type = "button"]', buttonText);
  }

  // 讲师中心/学习中心右上角icon：个人中心、未读信息
  getUserInfo(user) {
    return cy.contains('button.btn.dropdown-toggle', user);
  }

  navigateToUserInfo(user) {
    this.getUserInfo(user).click({force: true});
    cy.get('div.user-info-popup').should('be.visible').contains('a.link', '查看个人主页').click({force: true});
  }

  getToast() {
    return cy.get('span.message-text');
  }
}
