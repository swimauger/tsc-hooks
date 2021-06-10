const path = require('path');
const fs = require('fs');

module.exports = (TSC_BIN_PATH) => {
  const INJECTION_PATH = path.resolve(__dirname, '../lib/injection');

  const script = [
    '#!/usr/bin/env node',
    `require('${JSON.stringify(path.relative(path.dirname(TSC_BIN_PATH), INJECTION_PATH))}')`,
    "require('../lib/tsc.js')"
  ];

  fs.writeFileSync(TSC_BIN_PATH, script.join('\n'));
}
