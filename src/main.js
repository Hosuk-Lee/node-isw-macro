const iswToken = require('./token/isw_token');
const iswApiService = require('./request/isw/DomainSub');
const jobFile = require('./file/job_file');
global.token = null;
const DAT_PATH = '../dat/';
const process = async () => {

  global.token = await iswToken.getAccessToken();
  // console.log('token', token);
  const fileList = jobFile.checkFiles();

  for (const filename of fileList) {
    console.log("#",filename);

    if ( filename.includes("CreateDomainNamespace") ) {
      await require('./request/isw/domain').createDomainNamespace(DAT_PATH,filename);
    }

    if ( filename.includes("CreateDomainProperties") ) {
      await iswApiService.createDomainProperties(DAT_PATH,filename);
    }
    if ( filename.includes("CreateDbCollection") ) {
      await iswApiService.createDbCollection(DAT_PATH,filename);
    }
  }

  // 프로젝트 생성
  // API 매크로
  // Path
  // Schema

  // Domain 매크로

  // Properties
  // RootEntity
  // Entity

  
}

global.util = require('./util');
// console.log(util.pad(123,3))
// console.log('##', new Date().YYYYMMDDHHMMSS());
process();
console.log('END OF PROCESS')
