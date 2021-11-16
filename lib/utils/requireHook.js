const { execSync } = require('child_process');
const path = require('path');
const md5 = require('./md5');

module.exports = function(hook, tsconfigDir) {
	if (hook.endsWith('.js')) {
		try {
			new URL(hook);
			const hashPath = path.resolve(__dirname, '../hooks', `${md5(hook)}.js`);
			if (!fs.existsSync(hashPath)) {
				execSync(`curl ${hook} -o ${hashPath} -s`);
			}
			return require(hashPath);
		} catch (error) {
			return require(path.resolve(tsconfigDir, hook));
		}
	} else {
		return require(path.resolve(__dirname, '../../hooks', hook, `${hook}.hook`));
	}
}