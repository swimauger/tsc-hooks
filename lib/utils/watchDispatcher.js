const chokidar = require('chokidar');

module.exports = chokidar.watch(process.cwd(), {
  ignored: /(^|[\/\\])\.ts./, // ignore ts files
  persistent: true
});
