import USER from '../../user.config';
import {HomePo} from '../page-objects/home.po';
import {LoginPo} from '../page-objects/login.po';
import {CampDetailPo} from '../page-objects/campDetail.po';
import {ToolModalPo} from '../page-objects/toolModal.po';
import {ConfirmModalPo} from '../page-objects/confirmModal.po';
import {tearDown} from '../helper/tearDown';
import {setup} from '../helper/setup';
import EnvConfig from '../../env.config';

describe('讲师创建、编辑、删除训练营阶段及任务', () => {
  let homePage;
  let loginPage;
  let campDetailPage;
  let toolModal;
  let confirmModal;

  const random = Math.floor(Math.random() * 100000).toString();
  const campName = `auto_camp${random}`;
  const stageName = `auto_stage${random}`;
  const newStageName = `new_stage${random}`;
  const taskName = `auto_task${random}`;
  const newTaskName = `new_task${random}`;
  const client = 'TW';
  const description = `这是一段很专业描述。`;
  const newDescription = `这是一段新的很专业的描述。`;
  const filesArray = [
    '4upload.doc',
    '4upload.pptx',
    '4upload.key',
    '4upload.numbers',
    '4upload.pages',
    '4upload.pdf',
    '4upload.png',
    '4upload.rar',
    '4upload.txt',
    '4upload.xls',
  ];

  const toolArray = [
    '自定义工具',
    '同理心地图',
    '用户画像',
    '用户旅程地图',
    '痛点归因',
    '电梯演讲',
    '象限分析',
    '精益画布'
  ];

  const count = 2;

  before(() => {
    homePage = new HomePo();
    loginPage = new LoginPo();
    campDetailPage = new CampDetailPo();
    toolModal = new ToolModalPo();
    confirmModal = new ConfirmModalPo();

    //发请求
    cy.visit(EnvConfig.domain);
    setup.prepareCamp(campName, client);
  });

  after(() => {
    tearDown.clearCreatedActiveCamps(USER.trainer.email, USER.trainer.password, USER.trainer.userId);
  });

  it('讲师创建训练营阶段', () => {
    loginPage.login(USER.trainer.email, USER.trainer.password);
    confirmModal.removeReminder('发现新功能');
    homePage.getPageTitle().should('contain', '讲师中心');
    cy.wait(2000);

    homePage.getCampButtonByText(campName, '查看训练营详情').scrollIntoView().click({force: true});
    campDetailPage
      .getPageTitle()
      .should('contain', campName);

    cy.wait(1000);
    campDetailPage.addStage();
    campDetailPage.editNameAndDescription(stageName, description, '阶段');

    campDetailPage.getButtonByText('确认').click({force: true});
    campDetailPage.getNameInDisplay().should('contain', stageName);
    campDetailPage.getDescriptionInDisplay().should('contain', description);
    cy.saveLocalStorage();
  });

  it('讲师编辑训练营阶段名称及阶段描述', () => {
    cy.restoreLocalStorage();
    campDetailPage.getButtonByText('编辑').click({force: true});
    campDetailPage.editNameAndDescription(newStageName, newDescription, '阶段');

    campDetailPage.getButtonByText('确认').click({force: true});
    campDetailPage.getNameInDisplay().should('contain', newStageName);
    campDetailPage.getDescriptionInDisplay().should('contain', newDescription);
    cy.saveLocalStorage();
  });

  it('讲师创建任务、上传附件、添加工具', () => {
    cy.restoreLocalStorage();
    campDetailPage.addTask(newStageName);
    confirmModal.removeReminder('任务库使用教程');
    campDetailPage.editNameAndDescription(taskName, description, '任务');
    campDetailPage.getTaskCalendarInput().click({force: true});
    campDetailPage.selectTaskPeriod();

    // attachFile方法由引入的cypress-file-upload包提供，仅针对input元素有效，默认根目录为cypress/fixture
    filesArray.forEach(file => {
      campDetailPage.getFilesUpload().attachFile(`./files/${file}`);
    });

    campDetailPage.addTaskTool();
    toolModal.selectTaskTools(toolArray, 'plus', count);
    toolArray.forEach((tool) => {
      campDetailPage.getAddedToolsField().should('contain', tool);
      campDetailPage.getAddedToolsField().children().should('have.length', count * toolArray.length);
    });

    campDetailPage.getButtonByText('确认').click({force: true});
    campDetailPage.getNameInDisplay().should('contain', taskName);
    campDetailPage.getTaskDetailTabs().should('contain', '作业点评').and('contain', '任务详情');
  });

  it('讲师编辑任务名称、描述、删除已上传附件、删除工具', () => {
    loginPage.login(USER.trainer.email, USER.trainer.password);
    confirmModal.removeReminder('发现新功能');
    cy.wait(2000);
    homePage.getCampButtonByText(campName, '查看训练营详情').scrollIntoView().click({force: true});
    campDetailPage.getTaskByName(taskName).click({force: true});
    campDetailPage.selectTabByName('任务详情');

    campDetailPage.getButtonByText('编辑').click({force: true});
    confirmModal.removeReminder('任务库使用教程');
    campDetailPage.editNameAndDescription(newTaskName, newDescription, '任务');

    filesArray.forEach(file => {
      campDetailPage.deleteFile(file);
    });

    toolArray.forEach(tool => {
      campDetailPage.operateTaskTools(tool, '删除', count - 1);
    });

    campDetailPage.getButtonByText('确认').click({force: true});
    cy.reload();
    campDetailPage.getNameInDisplay().should('contain', newTaskName);
    campDetailPage.getDescriptionInDisplay().should('contain', newDescription);
    campDetailPage.getTitleByFieldName('附件').should('not.exist');
    campDetailPage.getTitleByFieldName('答题工具').siblings().children().should('have.length', (count - 1) * toolArray.length);
  });

  it('讲师删除任务', () => {
    const modalTitle = '确认删除此任务？';
    const modalBody = '删除后不可撤销，任务中已编辑的内容将同时被删除。';

    campDetailPage.getTaskByName(newTaskName).click({force: true});
    campDetailPage.selectTabByName('任务详情');

    campDetailPage.getButtonByText('删除').click({force: true});
    confirmModal.confirmOperation(modalTitle, modalBody, '删除');
    campDetailPage.getTaskInList().should('not.contain', newTaskName);
  });

  it('讲师删除阶段', () => {
    const modalTitle = '确认删除此阶段？';
    const modalBody = '删除后不可撤销，阶段中已编辑的内容将同时被删除。但是此阶段下的任务将会被保留。';

    campDetailPage.getStageByName(newStageName).click({force: true});
    campDetailPage.getButtonByText('删除').click({force: true});
    confirmModal.confirmOperation(modalTitle, modalBody, '删除');
    campDetailPage.getStageInList().should('not.contain', newStageName);
  });

});
