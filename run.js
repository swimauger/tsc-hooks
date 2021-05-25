const path = require('path');

const PROJECT_ROOT = process.cwd();
const PACKAGE_JSON = require(path.resolve(PROJECT_ROOT, 'package.json'));
const script = require(path.resolve(__dirname, 'scripts', process.argv[2]));
const isGlobalScript = !(PACKAGE_JSON.dependencies?.typescript || PACKAGE_JSON.devDependencies?.typescript);

if (isGlobalScript) {
  throw `Must install typescript either as a dependency or devDependency of this project.
Run: npm i typescript --save-dev # or npm i typescript`;
} else {
  script(path.resolve(process.cwd(), 'node_modules/typescript/bin/tsc'));
}
