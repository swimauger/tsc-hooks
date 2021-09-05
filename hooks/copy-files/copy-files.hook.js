module.exports = {
  dependencies: [ 'glob' ],
  onInitCompilation: function(api) {
    // This will ensure the unsupported allowTs attribute is ignored
    api.tsconfig.ignore('compilerOptions.allowTs');
  },
  onPostCompilation: function(api) {
    const path = require('path');
    const fs = require('fs');
    const glob = require('glob');
    const cwd = api.tsconfig?.compilerOptions?.rootDir || api.tsconfig.directory;
    const rootRegex = /^([^\/|\\])+/;
    const outDir = api.tsconfig?.compilerOptions?.outDir;

    // Add included files from config
    const includedFiles = new Set();
    for (const includedFromConfig of api.tsconfig.include) {
      const files = glob.sync(includedFromConfig, { cwd });
      for (const file of files) {
        includedFiles.add(file);
      }
    }

    // Remove excluded files from config
    for (const excludedFromConfig of api.tsconfig.exclude) {
      const files = glob.sync(excludedFromConfig, { cwd });
      for (const file of files) {
        includedFiles.delete(file);
      }
    }

    // Copy files to outDir
    for (const file of includedFiles) {
      const outFile = outDir ? file.replace(rootRegex, outDir) : file;
      if (fs.lstatSync(file).isDirectory()) {
        fs.mkdirSync(outFile, { recursive: true });
      } else if (!file.endsWith('js') || !(file.endsWith('ts') && !api.tsconfig?.compilerOptions?.allowTs)) {
        fs.copyFileSync(file, outFile);
      }
    }
  }
}
