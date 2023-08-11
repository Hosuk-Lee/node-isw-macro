const os = require('os');
const fs = require('fs');
const path = require('path');
import {
  createDomainProperties,
  importPropertyInDomainEntity,
  typeConverter,
} from '../../src/request/isw/DomainSub';
import { getIswToken } from '../token/isw_token';

global.token = null;

beforeAll(async () => {
  const id = '3160457';
  const pw = '$it2637b';
  global.token = await getIswToken(id, pw);
});

const dirPath = path.join(__dirname, '../../dat/');
const filename = 'DetailTransactionAmountHistory_NFCTK002_trnhis_Properties.dat';

describe('request/isw/DomainSub/importPropertyEntity', () => {
  it('should convert type & decimal correctly', () => {
    const testType = {
      decimalType: 'decimal',
      textType: 'text',
      CHARType: 'CHAR(20)',
      DECIMALType: 'DECIMAL(18|4)',
    };
    const testData = {
      decimal:
        'limtFeeDscntrt,DECIMAL(9|5),한도수수료할인율,한도수수료할인율,한도수수료할인율,5, ',
      char: 'debtUndtkCrtdscd,CHAR(2),채무인수신용등급구분,채무인수신용등급구분,채무인수신용등급구분,0, ',
    };
    expect(typeConverter(testType.DECIMALType).decimalPoint).toEqual('4');
    expect(typeConverter(testType.CHARType).type).toEqual('text');
    expect(typeConverter(testType.textType).type).toEqual('text');
    expect(typeConverter(testData.decimal.split(',')[1]).decimalPoint).toEqual(
      '5'
    );
  });

  it('should create BASE & JSON for request body of ImportPropertiesInDomain correctly', () => {
    const URI = filename.split('_');
    const root_entity = URI[0];
    const project_acronym = URI[1];
    const domain_namespace = URI[2];
    const BASE = `https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/${project_acronym}/tracks/main/namespaces/${domain_namespace}/entities/${root_entity}/actions/AddProperties`;
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
    expect(JSON.stringify(body)).toBeTruthy();
  });
});

describe('request/isw/DomainSub/CreatePropertyInDomainEntity', () => {
  jest.setTimeout(10000);

  it('should CreateDomainProperties works correctly', async () => {
    await createDomainProperties(dirPath, filename);
  });
});

describe('request/isw/DomainSub/importPropertyEntity', () => {
  jest.setTimeout(10000);

  it('should ImportPropertyEntity works correctly', async () => {
    await importPropertyInDomainEntity(dirPath, filename);
  });
});
