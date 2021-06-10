const glob = require('glob');
const globParent = require('glob-parent');
const path = require('path');
const fs = require('fs');

module.exports = (tsconfig, tsconfigPath) => {
  process.on('exit', () => {
    const tsconfigDir = path.dirname(tsconfigPath);
    const include = tsconfig.include?.map(file => path.resolve(tsconfigDir, file));
    const ignore = tsconfig.exclude?.map(file => path.resolve(tsconfigDir, file));
    const outDir = tsconfig.compilerOptions.outDir;

    for (let includePattern of include) {
      const files = glob.sync(includePattern, { ignore });
      const includeDir = globParent(includePattern);
      for(const file of files) {
        if ((file.endsWith('.js') && !tsconfig.allowJs) || file.endsWith('.ts')) continue;
        const relative = file.slice(includeDir.length);
        const target = path.join(outDir, relative);

        if (!fs.existsSync(path.dirname(target))) {
          fs.mkdirSync(path.dirname(target), { recursive: true });
        }
  
        if (fs.lstatSync(file).isDirectory() && !fs.existsSync(target)) {
          fs.mkdirSync(target, { recursive: true });
        }
  
        if (fs.lstatSync(file).isFile()) {
          const fileContent = fs.readFileSync(file);
          fs.writeFileSync(target, fileContent);
        }
      }
    }
  });
};