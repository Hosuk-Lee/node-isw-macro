const os = require('os');
const fs = require('fs');
const axios = require('axios');
const XLSX = require('xlsx');
const { error } = require('console');

const createDomainProperties = async (path, filename) => {
  const BASE =
    'https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/{project_name}/tracks/main/namespaces/{domain_namespace}/PropertyDefinitions/-/actions/CreatePropertyDefinition';
  const url = makeUrl(BASE, filename);
  console.log(new Date(), 'createDomainProperties', url);

  const dataList = await readExcelAndConvertIntoArray(path, filename);
  //console.log(dataList);

  dataList.map(async (col) => {
    let body = new Object();

    body.localIdentifier = col[0];
    if (col[1].includes('text') || col[1].includes('decimal')) {
      body.type = col[1];
      body.decimalPlaces = col[5];
    } else {
      let convertedType = typeConverter(col[1]);
      body.type = convertedType.type;
      body.decimalPlaces = convertedType.decimalPoint;
    }
    body.label = col[2];
    body.shortLabel = col[3];
    body.notes = col[4];
    body.selectionElements = col[6]?.startsWith(' ')
      ? null || undefined
      : col[6];
    //console.log(body);
    const res = await apiCall(url, body);
  }) 
};

const importPropertyInDomainEntity = async (path, filename) => {
  console.log(filename , typeof filename);
  const URI = filename.split('_');
  const BASE =
    `https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/${URI[1]}/tracks/main/namespaces/${URI[2]}/entities/${URI[0]}/actions/AddProperties`;

  const dataList = await readExcelAndConvertIntoArray(path, filename);

  const body = dataList.map((col) => {
    let domain_namespace = URI[2];
    let propertyName = col[0];
    let localIdentifier = col[0];
    return {
      propertyName: propertyName,
      propertyDefinition: {
        identifier: domain_namespace + ':' + localIdentifier,
        localIdentifier: localIdentifier,
        namespacePrefix: domain_namespace,
        namespaceType: 'domain',
      },
      association: 'optional',
    };
  });

  const requestBody = { properties: body };
  //console.log(JSON.stringify(requestBody));
  await apiCall(BASE, requestBody);
};

const AddPropertiesToCommandInRootEntity = async (path, filename) => {
  const URI = filename.split('_');
  if (URI[3]?.undefined || null || URI[3]?.startsWith('Properties'))
    throw error('파일명에 커맨드이름이 없습니다.');
  const BASE =
    `https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/${URI[1]}/tracks/main/namespaces/${URI[2]}/entities/${URI[3]}_Input/actions/AddProperties`;

  const dataList = await readExcelAndConvertIntoArray(path, filename);

  const body = dataList.map((col) => {
    let domain_namespace = URI[2];
    let propertyName = col[0];
    let localIdentifier = col[0];
    return {
      propertyName: propertyName,
      propertyDefinition: {
        identifier: domain_namespace + ':' + localIdentifier,
        localIdentifier: localIdentifier,
        namespacePrefix: domain_namespace,
        namespaceType: 'domain',
      },
      association: 'optional',
    };
  });
  const requestBody = { properties: body };
  // console.log(JSON.stringify(requestBody));
  await apiCall(BASE, requestBody);
};

const makeUrl = (base, filename) => {
  const project_name = filename.split('_')[1];
  const domain_namespace = filename.split('_')[2];
  return base
    .replace('{project_name}', project_name)
    .replace('{domain_namespace}', domain_namespace);
};

const apiCall = async (url, body) => {
  const config = {
    url: url,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + global.token.access_token,
    },
    data: JSON.stringify(body),
  };
  try {
    let ret = await axios(config);
    return ret.status;
  } catch (err) {
    if (err.response.status != '409') {
      //console.log(err.response.status, 'Error ----', err.response.data);
      console.log(
        err.response.status,
        'Error ----',
        JSON.stringify(err.response.data.errors[0].context)
      );
    }
    return err.code;
  }
};

const typeConverter = (targetString) => {
  let type = targetString;
  let decimalPoint = '0';

  if (targetString.toUpperCase().includes('DECIMAL')) {
    type = 'decimal';
    decimalPoint = targetString.slice(targetString.indexOf(',')).slice(1, 2);
  }
  if (
    targetString.toUpperCase().includes('CHAR') ||
    targetString.toUpperCase().includes('VARCHAR')
  ) {
    type = 'text';
    decimalPoint = 0;
  }
  return { type, decimalPoint };
};

const readExcelAndConvertIntoArray = async (path, filename) => {
  console.log(filename);
  const workbook = XLSX.readFile(path + filename);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.error('None of sheet found.');
    return;
  }
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
  return dataArray;
}

module.exports = {
  createDomainProperties,
  importPropertyInDomainEntity,
  AddPropertiesToCommandInRootEntity,
  typeConverter,
};
