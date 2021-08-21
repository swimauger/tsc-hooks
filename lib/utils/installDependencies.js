const path = require('path');
const { execSync } = require('child_process');

module.exports = function(dependencies) {
  if (dependencies.length) {
		execSync(`npm i ${Array.from(new Set(dependencies)).join(' ')}`, { cwd: path.resolve(__dirname, '..') });
	}
}