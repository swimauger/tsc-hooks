const fs = require('fs');
const path = require('path');
const hookName = process.argv[3];

fs.rmdirSync(path.resolve(__dirname, '../hooks', hookName), { recursive: true });

const dockerfile = fs.readFileSync(path.resolve(__dirname, '../Dockerfile'), { encoding: 'utf-8' });
const dockerFileLines = dockerfile.split('\n');
const finalDockerFileLines = [];

let deleteIndex = 0;
for (const line of dockerFileLines) {
  if (deleteIndex > 1) {
    deleteIndex = 0;
  } else if (deleteIndex > 0 || line === `WORKDIR /test/hooks/${hookName}/test`) {
    deleteIndex++;
  } else {
    finalDockerFileLines.push(line);
  }
}

fs.writeFileSync(path.resolve(__dirname, '../Dockerfile'), finalDockerFileLines.join('\n'));
