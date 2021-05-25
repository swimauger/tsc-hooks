const fs = require('fs');

module.exports = (TSC_BIN_PATH) => {
  fs.writeFileSync(TSC_BIN_PATH, "#!/usr/bin/env node\nrequire('../lib/tsc.js')\n");
}
