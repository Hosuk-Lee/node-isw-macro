const readlineSync = require('readline-sync');
const axios = require('axios');
const qs = require('qs');

const getAccessToken = async () => {
  const accountInfo = getAccountInfo(); // sync
  const token = await getIswToken(accountInfo.id, accountInfo.pwd); // async
  return token;
}

const getAccountInfo = () => {
  const answer_id = readlineSync.question('Please enter id: ');
  console.log('Password entered: ', answer_id);

  const options = {
    hideEchoBack: true,
    mask: '*'
  };
  const answer_pwd = readlineSync.question('Please enter password: ', options);
  console.log('Password entered: ', answer_pwd);

  console.clear();

  const data = {
    'id' : answer_id,
    'pwd' : answer_pwd
  }
  
  return data;
}

const getIswToken = async (id,pw) => {
  // async function getToken (id,pw) {
    
    console.log(id,pw);
    
    const bodydata = qs.stringify({
      'username': id, /* 9750069 */
      'password': pw, /* corebank1! */
      'client_id': 'isw-sample',
      'client_secret': '',
      'grant_type': 'password'
    });
  
    // console.log(data);
    const config = {
      method: 'post',
      url: 'https://keycloak-foundation.apps.fswdomain.koreacentral.aroapp.io/auth/realms/fsw/protocol/openid-connect/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data : bodydata
    };
  
    const response = await axios(config);
    const response_data = response.data;
    const data = {
      'token_type': response_data.token_type,
      'access_token': response_data.access_token,
      'refresh_token': response_data.refresh_token,
    }
    return data;
  }


module.exports = {getAccessToken}