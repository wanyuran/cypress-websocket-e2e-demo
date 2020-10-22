const ENV_MAP = {
  qa: {
    domain: 'https://qa.xxxxxx.hello-bees.com',
    homeUrl: 'https://qa.xxxxxxx.com/#/auth/login?loginCallback=https:%2F%2Fqa.xxxxxxx.com&clientId=xxxxxxxxxxxxxxxxxx&from=xxxxxxxxxxxx',
    clientId: '0fa524dc-e9d4-xxxx-84b3-xxxxxxx'
  },

  uat: {
    domain: 'https://uat.xxxxxx.hello-bees.com',
    homeUrl: 'https://uat.xxxxxxx.com/#/auth/login?loginCallback=https:%2F%2Fqa.xxxxxxx.com&clientId=xxxxxxxxxxxxxxxxxx&from=xxxxxxxxxxxx',
    clientId: '035290cf-4b9f-xxxx-a5cf-xxxxxxxx'
  }
};

// const envName = process.env['NODE_ENV']|| 'UAT';   //process模块用来与当前进程互动，可以通过全局变量process访问，不必使用require命令加载； process.env属性返回一个包含用户环境信息的对象
const envName = Cypress.env('testEnv')|| Cypress.config('defaultEnv');
const EnvConfig = ENV_MAP[envName.toLowerCase()];

export const getEnv = () => envName;

console.log('--------------------------------------------');
console.log('现在测试的是 ' + envName + ' 环境');
console.log('--------------------------------------------');

export default EnvConfig;

