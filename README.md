
# 介绍
该demo使用cypress框架进行页面e2e测试，每个test suite为一个测试文件，覆盖一个场景。每个test suite的before hook & after hook调用api（websocket & https）进行数据准备（setup）及清理（teardown）。websocket request发送使用工具为socketio，https request发送使用工具为axios & node-fetch。
该demo使用的测试报告为mochawesome，使用相关命令可同时生成json及html格式测试报告。

# 使用
## clone 代码
```git clone git@github.com:wanyuran/cypress-websocket-e2e-test.git```
## 安装依赖
```yarn install```
## 启动Cypress Test Runner运行测试
运用框架自带的cypress open命令行执行。
```yarn start```
- 可切换测试环境：--env testEnv=XX
支持动态挑选测试/测试套件运行，以下命令行选项有效的前置条件：cypress/support/index.js中注释掉 `import '../../scripts/pickTest.js':
- 可根据it()/describe()中description内的[XX]标签挑选测试套/测试运行：--env grep=XX
- 可根据文件名中包含XXX字符挑选测试套运行：--env fgrep=XXX
## 使用Electron无头浏览器运行测试，按测试文件生成测试报告
运用框架自带的cypress run命令行执行
```yarn test```
## 使用Electron无头浏览器运行测试并生成完整测试报告
运行moduleRunIndex.js脚本运用Module API —— cypress.run()运行测试，且自定义了一系列命令行选项：
```yarn test:report```
- 此命令有效的前提条件：cypress/support/index.js中 `import '../../scripts/pickTest.js';
- 可切换测试环境：-t XXX(如QA/UAT)
- 可设置运行的测试路径：-s `cypress/integration/specs/*`
- 可根据it()中description内的[XX]标签挑选测试运行：-i '[XX]'
- 可根据describe()中description内的[XX]标签挑选测试套运行：-I '[XX]'
- 可根据it()中description内的[XX]标签跳过运行测试：-e '[XX]'
- 可根据describe()中description内的[XX]标签跳过运行测试套：-D '[XX]'
## 运行测试并使用cypress dashboard
```yarn test:project```
使用cypress dashboard录制请先按照官方文档完成注册并项目配置project Id及key。


# 其他
Cypress框架在运行时会自动录制video，并在测试fail时进行截图，下一次测试运行时会自动覆盖video、截图及测试报告。集成CI运行时可设置邮件转发或者保存至相应服务器以记录每次运行结果方便追溯。


