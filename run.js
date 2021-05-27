const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = process.cwd();
const PACKAGE_JSON = require(path.resolve(PROJECT_ROOT, 'package.json'));
const script = require(path.resolve(__dirname, 'scripts', process.argv[2]));
const isGlobalScript = !(PACKAGE_JSON.dependencies?.typescript || PACKAGE_JSON.devDependencies?.typescript);

console.log(process.argv[2]);
if (isGlobalScript && process.argv[2] === 'postinstall') {
  execSync('npm i typescript --save-dev --no-package-lock');
  console.log('Downloaded TypeScript... I think?');
  script(path.resolve(process.cwd(), '../typescript/bin/tsc'));
} else {
  script(path.resolve(process.cwd(), '../typescript/bin/tsc'));
}
