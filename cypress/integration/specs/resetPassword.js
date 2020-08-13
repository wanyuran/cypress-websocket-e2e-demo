import {LoginPo} from '../page-objects/login.po';
import {HomePo} from '../page-objects/home.po';
import USER from '../../user.config';
import {UserInfoPo} from '../page-objects/userInfo.po';
import {resetPassword} from '../helper/httpsRequest';

describe('用户重设登录密码', () => {
  let loginPage;
  let homePage;
  let userInfoPage;
  let newPassword;
  let confirmPassword;
  let oldPassword;
  let exceptionMessage;

  before(() => {
    loginPage = new LoginPo();
    homePage = new HomePo();
    userInfoPage = new UserInfoPo();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  after(() => {
    resetPassword(USER.trainer.email, newPassword, USER.trainer.password);
  });

  it('用户重设登录密码成功', () => {
    loginPage.login(USER.trainer.email, USER.trainer.password);
    homePage.navigateToUserInfo(USER.trainer.userName);
    userInfoPage.getUserInfoTabs().should('contain', '个人中心').and('contain', '密码设置');
    userInfoPage.selectUserInfoTabsByName('密码设置');

    newPassword = 'Test' + Math.ceil(Math.random() * 100000).toString();
    confirmPassword = newPassword;
    cy.log(newPassword);
    userInfoPage.resetPassword(USER.trainer.password, newPassword, confirmPassword);
    userInfoPage.getToast().should('contain', '更新成功');
  });

  it('用户重设新密码与旧密码相同，报错', () => {
    exceptionMessage = '新密码不能与旧密码相同';
    oldPassword = newPassword;
    userInfoPage.inputOldPassword(oldPassword);
    userInfoPage.inputNewPassword(newPassword);
    userInfoPage.getNewPasswordException().should('contain', exceptionMessage);
  });

  it('用户重设新密码与确认密码不一致，报错', () => {
    exceptionMessage = '两次输入密码不一致';
    confirmPassword = 'Test1234';
    userInfoPage.inputConfirmPassword(confirmPassword);
    userInfoPage.getConfirmPasswordException().should('contain', exceptionMessage);
  });

});



