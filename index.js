const jsx = require('jsx.js');
const MagicString = require('magic-string');
const createFilter = require('rollup-pluginutils').createFilter;

module.exports = function (opts) {
	opts = opts || {};

	const filter = createFilter(opts.include, opts.exclude);
	const precise = opts.precise || false;
	// const pragma = opts.pragma;

	['precise', 'include', 'exclude'].forEach(k => delete opts[k]);

	return {
		name: 'jsx',
		transform(code, id) {
			if (!filter(id)) {
				return null;
			}

			const out = jsx(code, opts);
			const str = new MagicString(code);
			str.overwrite(0, code.length, out.toString());

			return {
				code: str.toString(),
				map: str.generateMap({hires: precise})
			};
		}
	};
};
