import {LoginPo} from '../page-objects/login.po';
import {HomePo} from '../page-objects/home.po';
import USER from '../../user.config';
import {InviteModalPo} from '../page-objects/inviteModal.po';
import {CampDetailPo} from '../page-objects/campDetail.po';
import {ConfirmModalPo} from '../page-objects/confirmModal.po';
import EnvConfig from '../../env.config';
import {setup} from '../helper/setup';
import {tearDown} from '../helper/tearDown';

describe('讲师邀请/移除训练营讲师', () => {
  let loginPage;
  let homePage;
  let inviteModal;
  let campDetailPage;
  let confirmModal;

  const campName = 'My Camp' + Math.ceil(Math.random() * 100).toString();
  const client = 'TW';

  before(() => {
    loginPage = new LoginPo();
    homePage = new HomePo();
    inviteModal = new InviteModalPo();
    campDetailPage = new CampDetailPo();
    confirmModal = new ConfirmModalPo();

    //发请求
    cy.visit(EnvConfig.domain);
    setup.prepareCamp(campName, client);
  });

  after(() => {
    tearDown.clearCreatedActiveCamps(USER.trainer.email, USER.trainer.password, USER.trainer.userId);
  });

  it('讲师在首页邀请训练营讲师', () => {
    loginPage.login(USER.trainer.email, USER.trainer.password);
    homePage.getPageTitle().should('contain', '讲师中心');
    cy.reload();
    cy.wait(5000);
    // homePage.getCampTrainers(campName).should('have.length', 1);   // 加了此句后面所有的元素都找不到了
    homePage.getCampButtonByText(campName, '邀请讲师').click({force: true});

    inviteModal.getModalTitle().should('contain', '邀请讲师');
    inviteModal.getEmpty().should('contain', '暂无搜索结果');
    inviteModal.addMember(USER.secondTrainer.userName);
    inviteModal.getToast().should('contain', '操作成功');
    inviteModal.closeModal();

    homePage.getCampTrainers(campName).should('have.length', 2);
  });

  it('被邀请的讲师登录系统，可在首页看到已加入的训练营', () => {
    loginPage.login(USER.secondTrainer.email, USER.secondTrainer.password);
    homePage.getPageTitle().should('contain', '讲师中心');
    cy.wait(2000);
    homePage.getTrainerCampsField().should('contain', campName);
  });

  it('讲师在详情页删除添加的讲师', () => {
    const modalTitle = '确认移除讲师？';
    const modalBody = '讲师移除后，需要再次邀请才可以加入当前训练营。';
    const operation = '移除';

    loginPage.login(USER.trainer.email, USER.trainer.password);
    cy.wait(2000);
    homePage.getCampButtonByText(campName, '查看训练营详情').scrollIntoView().click({force: true});
    campDetailPage
      .getPageTitle()
      .should('contain', campName)
      .and('contain', 'TW');

    campDetailPage.getTrainersManagement().click({force: true});
    inviteModal.getModalTitle().should('contain', '成员管理');
    inviteModal.deleteMember(USER.secondTrainer.userName);
    confirmModal.confirmOperation(modalTitle, modalBody, operation);
    inviteModal.getToast().should('contain', '操作成功');
    inviteModal.closeModal();

    campDetailPage.getCampTrainers().should('have.length', 1);
  });

  it('被移除的讲师登录系统，在首页看不到该训练营', () => {
    loginPage.login(USER.secondTrainer.email, USER.secondTrainer.password);
    homePage.getPageTitle().should('contain', '讲师中心');
    cy.wait(2000);
    homePage.getTrainerCampsField().should('not.contain', campName);
  });

  it('讲师在详情页添加训练营讲师', () => {
    loginPage.login(USER.trainer.email, USER.trainer.password);
    confirmModal.removeReminder('发现新功能');
    homePage.getCampButtonByText(campName, '查看训练营详情').scrollIntoView().click({force: true});
    campDetailPage
      .getPageTitle()
      .should('contain', campName)
      .and('contain', 'TW');

    campDetailPage.getInviteTrainers().click({force: true});
    inviteModal.getModalTitle().should('contain', '邀请讲师');
    inviteModal.getEmpty().should('contain', '暂无搜索结果');
    inviteModal.addMember(USER.secondTrainer.userName);
    inviteModal.getToast().should('contain', '操作成功');
    inviteModal.closeModal();

    campDetailPage.getCampTrainers().should('have.length', 2);
  });

  it('被邀请的讲师登录系统，可在首页看到已加入的训练营', () => {
    loginPage.login(USER.secondTrainer.email, USER.secondTrainer.password);
    homePage.getPageTitle().should('contain', '讲师中心');
    cy.wait(2000);
    homePage.getTrainerCampsField().should('contain', campName);
  });
});
