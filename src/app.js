const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const { getIswToken } = require('./token/isw_token');
const {
  createDomainProperties,
  importPropertyInDomainEntity,
  AddPropertiesToCommandInRootEntity,
} = require('./request/isw/domainExcel');

const dirPath = path.join(__dirname, '../dat/');
const jobList = [
  'createDomainProperties:               Domain에 porperty들 등록',
  'importPropertyInDomainEntity:         Entity에 property들을 import',
  'AddPropertiesToCommandInRootEntity:   Root Entity 내 command에 property들을 import',
];
const userSelect = ['다른 작업 진행 (계속)', '작업 종료 (Exit)']

const login = async () => {
  const id = readlineSync.question('ISW 접속 ID를 입력하세요 : ');
  const pwd = readlineSync.question('ISW 접속 패스워드를 입력하세요 : ');
  global.token = await getIswToken(id, pwd);
};

const processIswWorks = async () => {
  const fileList = fs
    .readdirSync(dirPath)
    .filter((file) => fs.statSync(`${dirPath}/${file}`).isFile()).filter(file => path.extname(file).includes('.xlsx'));

  const chosenJob = readlineSync.keyInSelect(
    jobList,
    '작업하실 업무의 숫자를 입력하세요'
  );
  const chosenFile = readlineSync.keyInSelect(
    fileList,
    '작업하실 파일의 번호를 입력하세요'
  );
  
  switch (jobList[chosenJob].split(':')[0]) {
    case 'createDomainProperties':
      console.log(
        `Domain에 porperty들 등록을 진행합니다 : ${fileList[chosenFile]}`
      );
      await createDomainProperties(dirPath, fileList[chosenFile]);
      break;
    case 'importPropertyInDomainEntity':
      console.log(
        `Entity에 property들의 import를 진행합니다 : ${fileList[chosenFile]}`
      );
      await importPropertyInDomainEntity(dirPath, fileList[chosenFile]);
      break;
    case 'AddPropertiesToCommandInRootEntity':
      console.log(
        `Root Entity 내 command에 property들의 import를 진행합니다 : ${fileList[chosenFile]}`
      );
      await AddPropertiesToCommandInRootEntity(dirPath, fileList[chosenFile]);
      break;
    default:
      break;
  }
};

const app = async () => {
  let loopCondition = true;
  await login();
  await processIswWorks();

  while (loopCondition) {
    const input = readlineSync.keyInSelect(
      userSelect,
      '===============================\n원하시는 작업의 번호를 입력하세요'
    );

    switch (input) {
      case 0:
        console.log('다음 작업을 진행합니다');
        await processIswWorks();
        break;
      case 1:
        console.log('작업을 종료 합니다');
        loopCondition = false;
        break;
      default:
        console.log('1 , 2 만 선택 가능합니다');
        break;
    }
  }
};

app();
