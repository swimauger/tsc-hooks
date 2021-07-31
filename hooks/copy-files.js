module.exports = {
  dependencies: [ 'glob' ],
  config: [ 'compilerOptions.allowTS' ],
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

    const files = include?.reduce((files, file) => this.glob.sync(file, { ignore }), []) || [];
    for (const file of files) {
      if (file.endsWith('.js') || (!this.tsconfig.compilerOptions?.allowTS && file.endsWith('.ts'))) continue;

      const relative = file.replace(path.resolve(file, path.relative(file, tsconfigDir)), '').split('/').splice(2).join('/');
      const target = path.resolve(this.tsconfigDir, this.tsconfig.compilerOptions.outDir, relative);

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
}
