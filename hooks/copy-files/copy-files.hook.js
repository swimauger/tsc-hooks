let include, exclude;

module.exports = {
  dependencies: [ 'glob' ],
  onInitCompilation: function(api) {
    // This will ensure the unsupported allowTs attribute is ignored
    api.tsconfig.ignore('compilerOptions.allowTs');

    // Save include and exclude files
    include = api.tsconfig.include ? [ ...api.tsconfig.include ] : [];
    exclude = api.tsconfig.exclude ? [ ...api.tsconfig.exclude ] : [];

    // Remove include and exclude files that aren't typescript from tsconfig for compilation
    api.tsconfig.include = api.tsconfig.include?.filter(file => file.endsWith('ts') || file.endsWith('*'));
    api.tsconfig.exclude = api.tsconfig.exclude?.filter(file => file.endsWith('ts') || file.endsWith('*'));

    // If there are no files left after filtering delete properties
    api.tsconfig.include?.length || delete api.tsconfig.include;
    api.tsconfig.exclude?.length || delete api.tsconfig.exclude;

    api.tsconfig.save();
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
    for (const includedFromConfig of include) {
      const files = glob.sync(includedFromConfig, { cwd });
      files.forEach(includedFiles.add.bind(includedFiles));
    }

    // Remove excluded files from config
    for (const excludedFromConfig of exclude) {
      const files = glob.sync(excludedFromConfig, { cwd });
      files.forEach(includedFiles.delete.bind(includedFiles));
    }

    // Copy files to outDir
    for (const file of includedFiles) {
      const outFile = outDir ? file.replace(rootRegex, outDir) : file;

      if (!fs.lstatSync(file).isFile()) continue;
      if (file.endsWith('js')) continue;
      if (file.endsWith('ts') && !api.tsconfig?.compilerOptions?.allowTs) continue;

      const dir = path.dirname(outFile);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.copyFileSync(file, outFile);
    }
  }
}
