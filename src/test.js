const os = require('os');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const parseXlsx = require('excel');

const main = async () => {
  const dirPath = path.join(__dirname, '../dat/');
  const filePath = dirPath + 'nodetest_ISWNODE_nodejs_Properties.xlsx';

  const fileList = fs
    .readdirSync(dirPath)
    .filter((file) => fs.statSync(`${dirPath}/${file}`).isFile())
    .filter((file) => path.extname(file).includes('.xlsx'));
  console.log(fileList);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.error('None of sheet found.');
    return;
  }
  //const data = XLSX.utils.sheet_to_json(sheet);
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const dataArray = [];

    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      const row = [];
      for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
        const cell = sheet[cellAddress];
        const cellValue = cell ? cell.v : null;
        row.push(cellValue);
      }
      dataArray.push(row);
    }
    console.log(dataArray);
}

main();