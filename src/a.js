const fs = require('fs');
var ret;

// ret = fs.readdir("C:/Users/hosuk/app/node-isw/dat", (err, files) => {
//   if (err) throw err;
//   files.forEach((item) => {
//     console.log(item);
//   });
//   console.log("readdir");
// });
// ret = fs.readdirSync("C:/Users/hosuk/app/node-isw/dat", {withFileTypes:true});
const fileList = fs.readdirSync("C:/Users/hosuk/app/node-isw/dat");
const fl = fileList.filter(f => {
  // console.log("Condition",f,);
  return ( f.includes('CreateDomainProperties') 
        || f.includes('CreateApiProperties') 
  );
});
fl.forEach(element => {
  console.log("File Name : " + element)
  const li = element.split("_");
  console.log(li)
});
// console.log('fileList ',fileList, fl)

// ret = fs.mkdir('C:/Users/hosuk/app/node-isw/dat/backup',(err) => {
//   if (err.code !== 'EEXIST') {
//     throw err
//   };
// });
// console.log ( ret );

// copy
// const src = 'C:/Users/hosuk/app/node-isw/dat/domain_properties.dat';
// const des = 'C:/Users/hosuk/app/node-isw/dat/backup/domain_properties.dat';
// ret = fs.copyFileSync(src,des);
// console.log ( ret );


