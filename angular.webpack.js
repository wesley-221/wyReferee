/**
 * Custom angular webpack configuration
 */
module.exports = (config, options) => {
	config.target = 'electron-renderer';

	config.resolve = config.resolve || {};
	config.resolve.fallback = {
		...(config.resolve.fallback || {}),
		"weak-value-map": false
	};

	if (options.fileReplacements) {
		for (let fileReplacement of options.fileReplacements) {
			if (fileReplacement.replace !== 'src/environments/environment.ts') {
				continue;
			}

			let fileReplacementParts = fileReplacement['with'].split('.');
			if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
				config.target = 'web';
			}
			break;
		}
	}

	return config;
}
