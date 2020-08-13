const ENV_MAP = {
  qa: {
    authorizeUrl: 'https://qa.xxxx.com/xx/xxxx',
    domain: 'https://qa.xxxx.xxxx.com',
    clientId: '0fa524dc-e9d4-xxxx-xxxx-xxxxxxxxxxxx'
  },

  uat: {
    authorizeUrl: 'https://uat.xxxx.com/xx/xxxx',
    domain: 'https://uat.xxxx.xxxx.com',
    clientId: '0fa524dc-e9d4-xxxx-xxxx-xxxxxxxxxxxx'
  },
};

const envName = process.env['NODE_ENV']|| 'QA';   //process模块用来与当前进程互动，可以通过全局变量process访问，不必使用require命令加载； process.env属性返回一个包含用户环境信息的对象
const EnvConfig = ENV_MAP[envName.toLowerCase()];

export const getEnv = () => envName;

console.log('--------------------------------------------');
console.log('现在测试的是 ' + envName + ' 环境');
console.log('--------------------------------------------');

export default EnvConfig;
