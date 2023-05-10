const os = require('os');
const fs = require('fs');
const axios = require('axios');

const createDomainProperties = async (path, filename) => {
  const BASE =
    'https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/{project_name}/tracks/main/namespaces/{domain_namespace}/PropertyDefinitions/-/actions/CreatePropertyDefinition';
  const url = makeUrl(BASE, filename);
  console.log(new Date(), 'createDomainProperties', url);

  const data = fs.readFileSync(path + filename, {
    encoding: 'utf-8',
    flag: 'r',
  });
  const dataList = data.split(os.EOL);
  console.log(dataList.entries());
  for (const [index, value] of dataList.entries()) {
    let body = new Object();
    let col = value.split(',');
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
    body.selectionElements = col[6]?.startsWith(' ') ? null || undefined : col[6];
    console.log(body.label);
    const res = await apiCall(url, body, index);
    //console.log(res,'@',index, body)
  }

  // const src = path + filename;
  // // const des = path + 'backup/' + filename+'.' + new Date().YYYYMMDDHHMMSS();
  // const des = path + 'backup/' + filename;
  // fs.rename(src, des, (error) => {
  //   if (error) console.log(`${error}`);
  // });
};

const createDbCollection = async (path, filename) => {
  const BASE =
    'https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/{project_name}/tracks/main/namespaces/{domain_namespace}/dbCollections/-/actions/CreateDbCollection';
  const url = makeUrl(BASE, filename);
  console.log(new Date(), 'createDomainDbCollection', url);

  const data = fs.readFileSync(path + filename, {
    encoding: 'utf-8',
    flag: 'r',
  });
  const dataList = data.split(os.EOL);
  console.log(dataList.entries());
  for (const [index, value] of dataList.entries()) {
    let body = new Object();
    let col = value.split(',');
    body.localIdentifier = col[0];
    body.note = col[1];
    const res = await apiCall(url, body, index);
    console.log(res, '@', index, body);
  }

  const src = path + filename;
  // const des = path + 'backup/' + filename+'.' + new Date().YYYYMMDDHHMMSS();
  const des = path + 'backup/' + filename;
  fs.rename(src, des, (error) => {
    if (error) console.log(`${error}`);
  });
};

const importPropertyInDomainEntity = async (path, filename) => {
  const URI = filename.split('_');
  const BASE =
    //`https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/${project_acronym}/tracks/main/namespaces/${domain_namespace}/entities/${root_entity}/actions/AddProperties`;
    `https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/${URI[1]}/tracks/main/namespaces/${URI[2]}/entities/${URI[0]}/actions/AddProperties`;

  const data = fs.readFileSync(path + filename, {
    encoding: 'utf-8',
    flag: 'r',
  });
  const dataList = data.split(os.EOL);

  const body = dataList.map((v, i) => {
    let col = v.split(',');
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
  // console.log(JSON.stringify(rqBody));
  await apiCall(BASE, requestBody);
};

const makeUrl = (base, filename) => {
  const project_name = filename.split('_')[1];
  const domain_namespace = filename.split('_')[2];
  return base
    .replace('{project_name}', project_name)
    .replace('{domain_namespace}', domain_namespace);
};

const apiCall = async (url, body, index) => {
  // console.log(index, body);
  const config = {
    // baseURL: 'https://jsonplaceholder.typicode.com',
    url: url,
    method: 'put', // 기본값
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
    console.log(err.response.status, 'Error ----', err.response.data);
    // console.log(err.response.status, 'Error ----', JSON.stringify(err.response.data.errors[0].context));
    return err.code;
  }
  // console.log(index, ret.status);
};

const typeConverter = (targetString) => {
  let type = targetString;
  let decimalPoint = '0';

  if (targetString.toUpperCase().includes('DECIMAL')) {
    type = 'decimal';
    decimalPoint = targetString.slice(targetString.indexOf('|')).slice(1, 2);
  }
  if (targetString.toUpperCase().includes('CHAR') || targetString.toUpperCase().includes('VARCHAR')) {
    type = 'text';
    decimalPoint = 0;
  }
  return { type, decimalPoint };
};

module.exports = {
  createDomainProperties,
  createDbCollection,
  importPropertyInDomainEntity,
  typeConverter,
};
