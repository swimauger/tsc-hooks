const path = require('path');
const script = require(path.resolve(__dirname, 'scripts', process.argv[2]));

const fs = require('fs');


console.log('process.cwd():', process.cwd())
fs.readdirSync(process.cwd()).forEach(file => {
  console.log('found:',file);
});
script(path.resolve(process.cwd(), './typescript/bin/tsc'));
