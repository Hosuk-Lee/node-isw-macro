const os = require('os')
const fs = require('fs');
const axios = require('axios');
const createDomainNamespace = async (path,filename) => {

    // console.log(token.access_token);
    const url = makeUrl(filename);
    console.log(url);
    
    const data = fs.readFileSync(path+filename,{encoding:'utf-8', flag:'r'});
    const dataList = data.split(os.EOL);
    console.log(dataList.entries())
    for (const [index, value] of dataList.entries()) {
        const res = await apiCall(url, value, index);
        console.log(res,'@',index, value)
    }

    fs.rename(path+filename,path+'backup/'+filename, (error)=>{
        if (error) {
        console.log(`${error}`)
        }
    });
}

const makeUrl = (filename) => {
    const BASE = 'https://k5-designer.apps.fswdomain.koreacentral.aroapp.io/api/v1/solutions/{project_name}/tracks/main/namespaces/-/actions/CreateDomainNamespace';
    const project_name = filename.split("_")[1];
    return BASE
            .replace('{project_name}', project_name)
            ;
}
const apiCall = async (url, row, index) => {
    console.log(new Date(), index);
    let body = new Object();
    col = row.split(',');
    body.prefix = col[0];
    body.label = col[1];
    body.description = col[2];

    // console.log(index, body);
    const config = {
        // baseURL: 'https://jsonplaceholder.typicode.com',
        url: url,
        method: 'put', // 기본값
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + global.token.access_token
        },
        data: JSON.stringify(body)
    }
    console.log('Config', config);
    try {
        let ret = await axios(config);
        return ret.status;
    } catch (err){
        // console.log(err.code, "Error 발생");
        return err.code;
    }
    // console.log(index, ret.status);
}

module.exports = {createDomainNamespace}