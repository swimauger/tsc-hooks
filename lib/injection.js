const fs = require('fs');
const JSON5 = require('json5');
const path = require('path');

const requireHook = require('./utils/requireHook');
const installDependencies = require('./utils/installDependencies');
const watchDispatcher = require('./utils/watchDispatcher');

const tsconfigDir = process.cwd();
const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');

if (fs.existsSync(tsconfigPath)) {
	const tsconfigStr = fs.readFileSync(tsconfigPath);
	const tsconfig = JSON5.parse(tsconfigStr);
	const hookModules = [], dependencies = [];

	for (const hook of tsconfig.hooks || []) {
		// Get Hook by URL, by Official ID, or by Path
		const hookModule = requireHook(hook, tsconfigDir);

		// Add dependencies
		dependencies.push(...hookModule.dependencies);

		// Add hookModule
		hookModules.push(hookModule);
	}

	// Install dependencies
	installDependencies(dependencies);

	// Call each hook
	for (const hookModule of hookModules || []) {
		// Create TSC Hook API
		const ignoredConfigOptions = [ 'save', 'ignore', 'path', 'directory' ];
		const watchedFiles = [];
		const api = {
			tsconfig: {
				...tsconfig,
				save() {
					const tsconfigCopy = JSON.parse(JSON.stringify(api.tsconfig));
					for (const ignoredConfigOption of ignoredConfigOptions) {
						eval(`delete tsconfigCopy.${ignoredConfigOption}`);
					}
					fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfigCopy, null, 2));
				},
				ignore(configOption) {
					ignoredConfigOptions.push(configOption);
					api.tsconfig.save();
				},
				path: tsconfigPath,
				directory: tsconfigDir
			},
			watch(...files) {
				watchedFiles.push.apply(watchedFiles, files);
			}
		};

		hookModule.onInitCompilation?.(api);
		watchDispatcher.add(watchedFiles);

		if (hookModule.onWatchCompilation) {
			watchDispatcher.on('all', (event, path) => hookModule.onWatchCompilation(event, path, api));
		}

		if (hookModule.onPostCompilation) {
			process.on('exit', () => hookModule.onPostCompilation(api));
		}
	}

	// Hooks may mutate the config, so write the original config back
	process.on('exit', () => fs.writeFileSync(tsconfigPath, tsconfigStr));
}
