
# 介绍
该demo使用cypress框架进行页面e2e测试，每个test suite为一个测试文件，覆盖一个场景。每个test suite的before hook & after hook调用api（websocket & https）进行数据准备（setup）及清理（teardown）。websocket request发送使用工具为socketio，https request发送使用工具为axios & node-fetch。
该demo使用的测试报告为mochawesome，使用相关命令可同时生成json及html格式测试报告。

# 使用
## clone 代码
```git clone git@github.com:wanyuran/cypress-websocket-e2e-test.git```
## 安装依赖
```yarn install```
## 启动Cypress Test Runner运行测试
```yarn start```
## 使用Electron无头浏览器运行测试并生成测试报告
```yarn test:report```
## 运行测试并使用cypress dashboard
```yarn test:mocha```
使用cypress dashboard录制请先按照官方文档完成注册并项目配置project Id及key。

# 其他
Cypress框架在运行时会自动录制video，并在测试fail时进行截图，下一次测试运行时会自动覆盖video、截图及测试报告。集成CI运行时可设置邮件转发或者保存至相应服务器以记录每次运行结果方便追溯。


