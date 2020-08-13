export class CampDetailPo {
  getPageTitle() {
    return cy.get('.title-wrap > .title');
  }

  getButtonByText(text) {
    return cy.contains('button[type="button"]', text).scrollIntoView();
  }

  getInviteTrainers() {
    return cy.contains('app-camp-trainer-invite > button', '邀请讲师');
  }

  getTrainersManagement() {
    return cy.get('div.icon-members');
  }

  getCampTrainers() {
    return cy.get('app-camp-members > div').children();
  }

  getTaskByName(task) {
    cy.wait(1000);
    return cy.contains('.task-list-item-title', task).scrollIntoView();
  }

  getStageByName(stage) {
    return cy.contains('span.stage-name.text-ellipsis', stage).scrollIntoView();
  }

  // 任务栏左侧栏
  addStage() {
    cy.contains('div.add-task', '新建').click({force: true});
    return cy.contains('ul.bd-combobox-menu > li', '阶段').click({force: true});
  }

  // 无任务库模板情况下，新增任务
  addTask(stageName) {
    cy.contains('span.stage-name', stageName).scrollIntoView().click({force: true});
    cy.contains('div.add-task', '新建').scrollIntoView().click({force: true});
    return cy.contains('ul.bd-combobox-menu > li', '任务').click({force: true});
  }

  getTaskInList() {
    return cy.get('.task-list .task-list-item-title');
  }

  getStageInList() {
    return cy.get('.stage-list-item .stage-name');
  }

  // 任务右侧栏-详情态
  getTaskDetailTabs() {
    cy.wait(1000);
    return cy.get('div.task-detail-box ul.tab');
  }

  // 任务右侧栏-Tab页：讲师-作业点评、任务详情；学员-任务详情、任务入口
  selectTabByName(tabName) {
    return this
      .getTaskDetailTabs()
      .scrollIntoView()
      .contains('li.tab-item', tabName)
      .click({force: true})
      .wait(1000);
  }

  getNameInDisplay() {
    return cy.get('div.detail-name');
  }

  getDescriptionInDisplay() {
    return cy.get('div.detail-item');

  }

  // 任务详情态各个字段的title元素，name取值为任务时间、任务描述、附件、答题工具
  getTitleByFieldName(name) {
    return cy.contains('div.detail-item-title', name);
  }

  // 修改任务或阶段的名称,type值为'阶段'或'任务'
  // 编辑状态下任务详情，使用getNameInEdit()拿不到任务名称
  getNameInEdit(type) {
    return cy.get(`input[placeholder="请输入${type}名称（1~20字）"]`);
  }

  getDescriptionInEdit() {
    return cy.get('div[data-placeholder="请输入任务描述，支持本地图片粘贴"] > p');
  }

  inputName(name, type) {
    return this.getNameInEdit(type)
      .scrollIntoView()
      .click({force: true})
      .wait(1000)
      .clear()
      .type(name);
  }

  getTaskCalendarInput() {
    return cy.get('[placeholder="开始时间 - 结束时间"]');
  }

  selectTaskPeriod() {
    cy
      .get('.owl-dt-calendar-cell-today')
      .click({force: true})
      .wait(1000);

    cy
      .get('tbody > tr')
      .last()
      .children()
      .last()
      .click({force: true});
  }

  inputDescription(description) {
    return this.getDescriptionInEdit()
      .scrollIntoView()
      .click({force: true})
      .wait(1000)
      .clear()
      .type(description);
  }

  getFilesUpload() {
    cy.wait(1000);
    return cy.get('bd-uploader input[type="file"]').eq(1).scrollIntoView();
  }

  deleteFile(file) {
    return cy.contains('span.annex-file-name', file)
      .siblings('div.annex-down')
      .scrollIntoView()
      .click({force: true});
  }

  addTaskTool() {
    cy.wait(1000);
    return cy.get('bd-icon.bd-icon-add').eq(1).scrollIntoView().click({force: true});
  }

  getAddedToolsField() {
    return cy.get('.form-outlined-group').last().children().last();
  }

  getDashIconOfAddedTool(tool) {
    return this.getAddedToolsField()
      .scrollIntoView()
      .wait(1000)
      .contains('app-tool-item div.text-ellipsis.title', tool)
      .siblings('bd-icon[type = "dash"]')
      .should('be.exist');
  }

  // operation取值可以为 删除、复制、修改名称
  operateTaskTools(tool, operation, count) {
    for (let i = 0; i < count; i++) {
      this.getDashIconOfAddedTool(tool).trigger('mouseenter', {force: true});
      cy.wait(500);
      cy.contains('div.menu > div.menu-item', operation).click({force: true});
      this.getDashIconOfAddedTool(tool).trigger('mouseleave', {force: true});
      cy.wait(1000);
    }
  }

  // 修改任务或阶段的名称及描述,type取值为任务或阶段
  editNameAndDescription(name, description, type) {
    this.inputName(name, type);
    this.inputDescription(description);
    if (type === '阶段') {
      this.getStageInList().should('contain', name);
    } else if (type === '任务') {
      this.getTaskInList().should('contain', name);
    }
    cy.wait(1000);
  }


  getToast() {
    return cy.get('span.message-text');
  }


}
