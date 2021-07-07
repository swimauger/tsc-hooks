const glob = require('glob')
const path = require('path')
const fs = require('fs')

module.exports = (tsconfig, tsconfigPath) => {
  process.on('exit', () => {
    const tsconfigDir = path.dirname(tsconfigPath)
    const include = tsconfig.include?.map((file) =>
      path.resolve(tsconfigDir, file)
    )
    const ignore = tsconfig.exclude?.map((file) =>
      path.resolve(tsconfigDir, file)
    )

    const files =
      include?.reduce((files, file) => glob.sync(file, { ignore }), []) || []
    for (const file of files) {
      if ((!tsconfig.hookOptions?.allowJS && file.endsWith('.js')) || (!tsconfig.hookOptions?.allowTS && file.endsWith('.ts'))) continue;

      const relative = file.replace(path.resolve(file, path.relative(file, tsconfigDir)), '').split('/').splice(2).join('/');
      const target = path.resolve(tsconfigDir, tsconfig.compilerOptions.outDir, relative);

      if (!fs.existsSync(path.dirname(target))) {
        fs.mkdirSync(path.dirname(target), { recursive: true })
      }

      if (fs.lstatSync(file).isDirectory() && !fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true })
      }

      if (fs.lstatSync(file).isFile()) {
        const fileContent = fs.readFileSync(file)
        fs.writeFileSync(target, fileContent)
      }
    }
  })
}
