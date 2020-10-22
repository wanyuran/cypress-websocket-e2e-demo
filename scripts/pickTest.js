/* 本段代码更改it和describe的行为，使之实现类似mocha中的grep功能
* 接受如下4个参数：
* 1. -i <value>，仅运行指定的it()。该it()的描述中含有<value>;
* 2. -I <value>，仅运行指定的describe()。该describe()的描述中含有<value>;
* 3. -e <value>，排除运行it()。该it()的描述中含有<value>;
* 4. -E <value>，排除运行describe()。该describe()的描述中含有<value>;
*
* 使用本代码会导致mocha中原有的功能模块.only / .skip不可用，以及 '--env grep=XX' 指定运行测试用例/测试套的命令行参数失效。
* 如使用则会报错，故如果想使用.only .skip 及 '--env grep=XX' ，需要将
* cypress/support/index.js中的以下语句注释掉：
* ```import '../../scripts/pickTest.js'```
* 同时，```node scripts/moduleRunIndex.js``` 脚本会失效.
*/

function pickIts() {
  if(global.it.itHadSet) return;

  const include = Cypress.env('i') && Cypress.env('i').split(',');
  const exclude = Cypress.env('e') && Cypress.env('e').split(',');

  const originIt = it;

  global.it = function(...rest) {
    const itDesc = rest[0];
    if(include) {
      if(include.findIndex(item => itDesc.indexOf(item) > -1) > -1) {
        originIt(...rest)
      }
    }

    if(exclude) {
      if(!(exclude.findIndex(item => itDesc.indexOf(item) > -1) > -1)) {
        originIt(...rest)
      }
    }

    if(!exclude && !include) {
      originIt(...rest)
    }

    global.it.itHadSet = true;
  }
}

function pickDescribe() {
  if(global.describe.describeHadSet) return;

  const include = Cypress.env('I') && Cypress.env('I').split(',');
  const exclude = Cypress.env('E') && Cypress.env('E').split(',');

  const originDescribe = describe;

  global.describe = function(...rest) {
    const describeDesc = rest[0];
    if(include) {
      if(include.findIndex(item => describeDesc.indexOf(item) > -1) > -1) {
        originDescribe(...rest)
      }
    }

    if(exclude) {
      if(!(exclude.findIndex(item => describeDesc.indexOf(item) > -1) > -1)) {
        originDescribe(...rest)
      }
    }

    if(!exclude && !include) {
      originDescribe(...rest)
    }

    global.describe.describeHadSet = true;

  }
}

pickIts();
pickDescribe();
