const { execSync } = require('child_process');
const path = require('path');
const crypto = require('crypto');

module.exports = function(hook) {
	if (hook.endsWith('.js')) {
		try {
			new URL(hook);
			const hashPath = path.resolve(__dirname, '../hooks', `${crypto.createHash('md5').update(hook).digest('hex')}.js`);
			if (!fs.existsSync(hashPath)) {
				execSync(`curl ${hook} -o ${hashPath} -s`);
			}
			return require(hashPath);
		} catch (error) {
			return require(path.resolve(tsconfigDir, hook));
		}
	} else {
		return require(path.resolve(__dirname, '../hooks', hook));
	}
}