const path = require('path');
const script = require(path.resolve(__dirname, 'scripts', process.argv[2]));

const fs = require('fs');


const tscPath = path.resolve(process.cwd(), '..')
console.log('process.cwd():', tscPath)
fs.readdirSync(tscPath).forEach(file => {
  console.log('found:',file);
});
script(path.resolve(process.cwd(), '../typescript/bin/tsc'));
