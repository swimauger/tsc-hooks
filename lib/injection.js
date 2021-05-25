const path = require('path');

try {
	const tsconfig = require(path.resolve(process.cwd(), 'tsconfig.json'));
	
	for (const hook of tsconfig.hooks) {
		try {
			require(path.resolve(__dirname, '../hooks', `${hook}.js`))(tsconfig);
		} catch (error) {
			if (error.code === 'MODULE_NOT_FOUND') {
				console.error([
					`Hook named "${hook}" does not exist in tsc-hooks repository. If you are looking to create your own hook or`, 
					'want to see what hooks are available visit https://github.com/swimauger/tsc-hooks'
				].join('\n'));
			} else {
				console.error(`Module "${hook}" threw an error, more information bellow:`);
				console.error(error);
			}
		}
	}
} catch (error) {
	console.warn('tsc-hooks: Warning tsconfig.json not found, tsc-hooks needs this file to work');
}
