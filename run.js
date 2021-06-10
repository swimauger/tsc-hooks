const path = require('path');
const script = require(path.resolve(__dirname, 'scripts', process.argv[2]));

script(path.resolve(process.cwd(), (path.dirname(__dirname).endsWith("node_modules") ? '../' : 'node_modules/') + 'typescript/bin/tsc'));
