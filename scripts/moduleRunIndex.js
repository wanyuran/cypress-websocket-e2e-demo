/* 本代码使用commander完成了node命令行的自定义配置，配置的命令行选项如下:
* 1. 必需选项：-t --targetEnvironment <string>, -t为短选项名称，--targetEnvironment为长选项名称， <string>为参数，类型为string，不指定参数类型则是boolean型选项，
* 用于切换测试环境，选项默认值为'QA'（这个值要与cypress.json的defaultEnv一致）;
* 2. 必需选项：-s --specFile <string>,用于指定运行的测试用例路径，默认参数'cypress/integration/specs/*'
* 3. 可选选项：-i, --onlyRunTest <string>,用于运行it()的description中打了[]标签的测试用例，用法：-i '[smoke]'
* 4. 可选选项：-e, --excludeTest <string>,用于跳过运行it()的description中打了[]标签的测试用例，用法：-e '[smoke]'
* 5. 可选选项：-I, --onlyRunTestSuite <string>,用于运行describe()的description中打了[]标签的测试套，用法：-I '[smoke]'
* 6. 可选选项：-E, --excludeTestSuite <string>,用于跳过运行describe()的description中打了[]标签的测试套，用法：-E '[smoke]'
* 具体使用规则详见：https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md
*
* 本代码使用了mochawesome-merge、mochawesome-report-generator、fs-extra合并了mochawesome-report/下的测试报告，生成一个完整的html测试报告：
* 1. 若想要每次执行的报告都保存下来，不覆盖，则把51-70,77,87,94,96注释掉的代码恢复，并注释掉78行`await fse.remove('mochawesome-report')`;
* 2. 若仅想要最新测试报告，则注释41-61,68,84代码，恢复69行`await fse.remove('mochawesome-report')`；
* 注意集成至CI后，Jenkinsfile_test的脚本中支持的是2，若将代码改成1，则测试报告保存的路径改变，需要现有的Jenkinsfile_test需要做相应的修改，否则阿里云盘上接收不到相应的测试报告。
*
* 终端运行本脚本`node moduleRunIndex.js`，则使用了改造后的Module API方式运行测试，可以动态指定运行环境、测试用例路径及测试用例、测试套件，
* 但需要将cypress/support/index.js中的以下语句恢复应用：`import '../../scripts/pickTest.js'`，同时会导致以下功能不可用：
* 1. mocha自带的静态挑选测试用例的功能模块.skip .only不可使用，若使用会报错；
* 2. cypress open / cypress run命令的选项`--env fgrep=XX`、`--env fgrep=XX`不可用，即不能使用此参数指定使用了XX标签/XX文件名的测试用例及测试套件执行；
*
* 若想保留以上2个功能，注释掉cypress/support/index.js中的以下语句：`import '../../scripts/pickTest.js'`,注释后,本脚本不可用
* */

const cypress = require('cypress');
const fse = require('fs-extra');
const {merge} = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');
let colors = require('colors');
const program = require('commander');
const moment = require('moment');

program
  .requiredOption('-t, --targetEnvironment <string>', 'Specify the running Env', 'QA')
  .requiredOption('-s, --specFile <string>', 'Spec the running file path', 'cypress/integration/specs/*')
  .option('-i, --onlyRunTest <string>', 'Only run the test cases in it(). eg. -i smoke, only run the test cases contains smoke in description')
  .option('-e, --excludeTest <string>', 'Exclude to run the test cases in it(). eg. -e smoke, exclude to run the test cases contains smoke in description')
  .option('-I, --onlyRunTestSuite <string>', 'Only run the test suites in describe(). eg. -e smoke, only run the test suites contains smoke in description')
  .option('-E, --excludeTestSuite <string>', 'Exclude to run the test suites in describe(). eg. -e smoke, exclude to run the test cases contains smoke in description', '[skip]')
  .allowUnknownOption()
  .parse(process.argv);

let envParams;
let args = program.opts();
envParams = `testEnv=${args.targetEnvironment}`;

if (args.onlyRunTest) envParams = envParams.concat(`,i=${args.onlyRunTest}`);
if (args.excludeTest) envParams = envParams.concat(`,e=${args.excludeTest}`);
if (args.onlyRunTestSuite) envParams = envParams.concat(`,I=${args.onlyRunTestSuite}`);
if (args.excludeTestSuite) envParams = envParams.concat(`,E=${args.excludeTestSuite}`);

// function getTimeStamp() {
//   let now = new moment().format('YYYY-MM-DD--HH_mm_ss');
//   return now;
// }
//
// const currRunTimeStamp = getTimeStamp();
//
// const sourceReport = {
//   files: [`./reports/${currRunTimeStamp}/mochawesome-report/*.json `],
// };
//
// const sourceReportPath = `./reports/${currRunTimeStamp}/mochawesome-report`;
//
// const finalReport = {
//   reportDir: `./reports/${currRunTimeStamp}`,
//   saveJson: true,
//   reportFilename: `Run-Report`,
//   reportTitle: `Run-Report`,
//   reportPageTitle: `Run-Report`,
// };

async function mergeReport() {
  console.log(`The target Environment are set to: ${program.targetEnvironment}`.bold.yellow);
  console.log(`The target TestPath are set to: ${program.specFile}`.bold.yellow);
  console.log(`The running Env are : ${envParams}`.bold.yellow);

  // fse.ensureDirSync(sourceReportPath);
  await fse.remove('mochawesome-report');
  const {totalFailed} = await cypress.run({
    spec: `${args.specFile}`,
    env: envParams,
    // browser: `chrome`,   // 如果是指定无头浏览器Electron运行，则把这一行注释掉即可
    config: {
      pageLoadTimeout: 60000,
      reporter: 'mochawesome',
      reporterOptions: {
        // reportDir: sourceReportPath,
        overwrite: false,
        html: false,
        json: true,
      },
    },
  })
  // const jsonReport = await merge(sourceReport);
  const jsonReport = await merge({files: ['./mochawesome-report/*.json']});
  // await generator.create(jsonReport, finalReport);
  await generator.create(jsonReport);
  process.exit(totalFailed);
}

mergeReport();

