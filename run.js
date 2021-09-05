const path = require('path');
const script = require(path.resolve(__dirname, 'scripts', process.argv[2]));

if (script instanceof Function) {
  script(path.resolve(process.cwd(), '../typescript/bin/tsc'));
}
