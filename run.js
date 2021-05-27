const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = process.cwd();
const PACKAGE_JSON = require(path.resolve(PROJECT_ROOT, 'package.json'));
const script = require(path.resolve(__dirname, 'scripts', process.argv[2]));
const isGlobalScript = !(PACKAGE_JSON.dependencies?.typescript || PACKAGE_JSON.devDependencies?.typescript);

if (isGlobalScript) {
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('In order to use tsc-hooks typescript must be installed as a devDependency. To install, type y/N:', (answer) => {
    if (!answer || answer.toLowerCase() === 'y') {
      execSync('npm i typescript --save-dev --no-package-lock');
      script(path.resolve(process.cwd(), 'node_modules/typescript/bin/tsc'));
      rl.close();
    } else {
      throw `Must install typescript either as a dependency or devDependency of this project.
Run: npm i typescript --save-dev # or npm i typescript`;
    }
  });
} else {
  script(path.resolve(process.cwd(), 'node_modules/typescript/bin/tsc'));
}
