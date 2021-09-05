const path = require('path');
const glob = require('glob');
const fs = require('fs');
const hookName = process.argv[3];

const files = glob.sync('example/**/*', {
  cwd: path.resolve(__dirname, '../hooks')
});

files.unshift('example');

for (const file of files) {
  const inFile = path.resolve(__dirname, '../hooks', file);
  const outFile = path.resolve(__dirname, '../hooks', file.replace(/example/gm, hookName));
  if (fs.lstatSync(inFile).isDirectory()) {
    fs.mkdirSync(outFile, { recursive: true });
  } else {
    fs.copyFileSync(inFile, outFile);
  }
}

const dockerfile = fs.readFileSync(path.resolve(__dirname, '../Dockerfile'), { encoding: 'utf-8' });
const dockerFileLines = dockerfile.split('\n');

const dockerCMD = dockerFileLines.pop();
const dockerWD = dockerFileLines.pop();

dockerFileLines.push(
  `WORKDIR /test/hooks/${hookName}/test`,
  'RUN yarn add tsc-hooks@dev && yarn build\n',
  dockerWD,
  dockerCMD
);

fs.writeFileSync(path.resolve(__dirname, '../Dockerfile'), dockerFileLines.join('\n'));
