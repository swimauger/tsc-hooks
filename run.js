const path = require('path');
const script = require(path.resolve(__dirname, 'scripts', process.argv[2]));

console.log('process.cwd():', process.cwd())
script(path.resolve(process.cwd(), '../typescript/bin/tsc'));
