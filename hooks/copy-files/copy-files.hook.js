module.exports = {
  dependencies: [ 'glob' ],
  config: [ 'compilerOptions.allowTs' ],
  arguments: {
    copyFiles: [ 'cf', 'copy-files' ],
    excludeFiles: [ 'ef', 'exclude-files' ]
  },
  onPostCompilation: function() {
    const path = require('path');
    const fs = require('fs');

    const include = this.tsconfig.include?.map(file => path.resolve(this.tsconfigDir, file));
    if (this.args.copyFiles) {
      include.push(...this.args.copyFiles?.split(' ')?.map(file => path.resolve(process.cwd(), file.trim())));
    }

    const ignore = this.tsconfig.exclude?.map(file => path.resolve(this.tsconfigDir, file));
    if (this.args.excludeFiles) {
      ignore.push(...this.args.excludeFiles?.split(' ')?.map(file => path.resolve(process.cwd(), file.trim())));
    }
    ignore.push(
      path.resolve(this.tsconfigDir, this.tsconfig.compilerOptions.outDir),
      path.resolve(this.tsconfigDir, `${this.tsconfig.compilerOptions.outDir}/**/*`)
    );

    const files = include?.reduce((files, file) => [ ...files, ...this.glob.sync(file, { ignore })], []) || [];
    for (const file of files) {
      if (file.endsWith('.js') || (!this.tsconfig.compilerOptions?.allowTs && file.endsWith('.ts'))) continue;

      const outFile = file.replace(this.tsconfigDir, path.resolve(this.tsconfigDir, this.tsconfig.compilerOptions.outDir));

      if (!fs.existsSync(path.dirname(outFile))) {
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
      }

      if (fs.lstatSync(file).isDirectory() && !fs.existsSync(outFile)) {
        fs.mkdirSync(outFile, { recursive: true });
      }

      if (fs.lstatSync(file).isFile()) {
        const fileContent = fs.readFileSync(file);
        fs.writeFileSync(outFile, fileContent);
      }
    }
  }
}