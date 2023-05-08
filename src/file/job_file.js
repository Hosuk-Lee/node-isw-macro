const path = require('path');
const fs = require('fs');


const checkFiles = () => {
  const dataPath = path.resolve(__dirname, '../../dat');
  const fileList = fs.readdirSync(dataPath);
  const iswFileList = fileList.filter(f => {
    // console.log("Condition",f);
    return (
      f.includes('CreateDomainNamespace') ||
      f.includes('CreateDomainProperties') ||
      f.includes('CreateDbCollection') ||
      f.includes('CreateApiProperties') ||
      f.includes('ImportPropertyInDomainEntity')
    );
  });
  // console.log('fileList ',fileList, fl)
  return iswFileList;
}

module.exports = {checkFiles}