const fs = require('fs');
const JSON5 = require('json5');
const path = require('path');

const requireHook = require('./utils/requireHook');
const installDependencies = require('./utils/installDependencies');

const tsconfigDir = process.cwd();
const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');

if (fs.existsSync(tsconfigPath)) {
	const tsconfigStr = fs.readFileSync(tsconfigPath);
	const tsconfig = JSON5.parse(tsconfigStr);
	const hookModules = [], dependencies = [], config = [], arguments = {};

	for (const hook of tsconfig.hooks || []) {
		const hookModule = requireHook(hook, tsconfigDir);
		// Add dependencies
		dependencies.push(...hookModule.dependencies);

		// Add custom config properties
		config.push(...hookModule.config);

		// Handle arguments
		for (const argVariable in hookModule.arguments) {
			const resolvedArgs = hookModule.arguments[argVariable].map(arg => arg.length > 3 ? `--${arg}` : `-${arg}`);
			const argIndex = process.argv.findIndex(arg => resolvedArgs.includes(arg));
			if (argIndex >= 0) {
				arguments[argVariable] = process.argv[argIndex+1];
				process.argv.splice(argVariable, 2);
			}
		}

		// Add hookModule
		hookModules.push(hookModule);
	}

	// Install dependencies
	installDependencies(dependencies);

	if (config.length) {
		const copyTSConfig = JSON5.parse(tsconfigStr);
		for (const prop of config) {
			eval(`delete copyTSConfig?.${prop.replace(/\./g, '?.')}`);
		}
		fs.writeFileSync(tsconfigPath, JSON.stringify(copyTSConfig));
		process.on('exit', () => fs.writeFileSync(tsconfigPath, tsconfigStr));
	}

	const hookBinding = {
		...dependencies.reduce((deps, dep) => {
			deps[dep] = require(dep);
			return deps;
		}, {}),
		tsconfig,
		tsconfigDir,
		tsconfigPath,
		args: arguments
	};

	for (const hookModule of hookModules || []) {
		hookModule?.onInitCompilation?.bind(hookBinding)();
		process.on('exit', hookModule?.onPostCompilation?.bind(hookBinding));
	}
}
