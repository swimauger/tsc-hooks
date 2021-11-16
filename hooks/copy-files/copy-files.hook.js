const fs = require('fs');
const path = require('path');
const rootRegex = /^([^\/|\\])+/;

module.exports = {
  dependencies: [ 'glob' ],
  onInitCompilation(api) {
    const glob = require('glob');
    const cwd = api.tsconfig.compilerOptions?.rootDir || api.tsconfig.directory;

    // This will ensure the unsupported allowTs attribute is ignored
    api.tsconfig.ignore('compilerOptions.allowTs');

    // Add included files from config
    const includedFiles = new Set();
    for (const includedFromConfig of api.tsconfig.include || []) {
      const files = glob.sync(includedFromConfig, { cwd });
      files.forEach(includedFiles.add.bind(includedFiles));
    }

    // Remove excluded files from config
    for (const excludedFromConfig of api.tsconfig.exclude || []) {
      const files = glob.sync(excludedFromConfig, { cwd });
      files.forEach(includedFiles.delete.bind(includedFiles));
    }

    // Register files to watch on change
    api.watch.apply(api, Array.from(includedFiles));

    // Remove include and exclude files that aren't typescript from tsconfig for compilation
    api.tsconfig.include = api.tsconfig.include?.filter(file => file.endsWith('ts') || file.endsWith('*'));
    api.tsconfig.exclude = api.tsconfig.exclude?.filter(file => file.endsWith('ts') || file.endsWith('*'));

    // If there are no files left after filtering delete properties
    api.tsconfig.include?.length || delete api.tsconfig.include;
    api.tsconfig.exclude?.length || delete api.tsconfig.exclude;

    api.tsconfig.save();
  },
  onWatchCompilation(event, file, api) {
    if (file.endsWith('js')) return;
    if (file.endsWith('ts') && !api.tsconfig?.compilerOptions?.allowTs) return;

    const outDir = api.tsconfig?.compilerOptions?.outDir;
    const outFile = outDir ? file.replace(rootRegex, outDir) : file;

    switch(event) {
      case 'add':
      case 'change':
        fs.copyFileSync(file, outFile);
        break;
      case 'addDir':
        fs.mkdirSync(outFile, { recursive: true });
        break;
      case 'unlink':
      case 'unklinkDir':
        fs.unlinkSync(outFile);
        break;
    }
  },
  onPostCompilation(api) {
    const outDir = api.tsconfig?.compilerOptions?.outDir;

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
