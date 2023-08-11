const os = require('os');
const fs = require('fs');
const path = require('path');
import {
  AddPropertiesToCommandInRootEntity
} from '../request/isw/DomainSub';
import { getIswToken } from '../token/isw_token';

global.token = null;

beforeAll(async () => {
  const id = '3160457';
  const pw = '$it2637b';
  global.token = await getIswToken(id, pw);
});

const dirPath = path.join(__dirname, '../../dat/');
const filename =
  'DetailTransactionAmountHistory_NFCTK002_trnhis_CreateDtalsTranAmtHist_Properties.dat';

describe('request/isw/DomainSub/AddPropertiesToCommandRootEntity', () => {
  it('should contain name of command in filename', () => {
    const URI = filename.split('_');
    expect(URI[3]).not.toBeNull();
    expect(URI[3]).not.toContain('Properties');
  });

  it('should create BASE & JSON for request body of AddPropertiesToCommandRootEntity correctly', () => {
    const URI = filename.split('_');
    const root_entity = URI[0];
    const project_acronym = URI[1];
    const domain_namespace = URI[2];
    const factoryMethod_name = URI[3];
    const BASE = `https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/${project_acronym}/tracks/main/namespaces/${domain_namespace}/entities/${factoryMethod_name}_Input/actions/AddProperties`;
    console.log(BASE);
    const data = fs.readFileSync(path.join(dirPath, filename), {
      encoding: 'utf-8',
      flag: 'r',
    });
    const dataList = data.split(os.EOL);

    const body = dataList.map((v, i) => {
      let col = v.split(',');
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
    //console.log(JSON.stringify(body));
    expect(JSON.stringify(body)).toBeTruthy();
  });
});

describe('request/isw/DomainSub/AddPropertiesToCommandInRootEntity', () => {
  jest.setTimeout(10000);

  it('should AddPropertiesToCommandInRootEntity works correctly', async () => {
    await AddPropertiesToCommandInRootEntity(dirPath, filename);
  });
});
