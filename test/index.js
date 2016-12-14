const join = require('path').join;
const readSync = require('fs').readFileSync;
const rollup = require('rollup').rollup;
const test = require('tape').test;

const jsx = require('../');

const read = f => readSync(f, 'utf8');

const fix = join(__dirname, 'fixtures');
const foo = read(join(fix, 'foo.js'));

test('pragma:h', t => {
	t.plan(2);
	rollup({
		entry: join(fix, 'foo.jsx'),
		plugins: [jsx()]
	}).then(bun => {
		const out = bun.generate();
		t.equal(typeof out.code, 'string', 'returns a string');
		t.equal(out.code, foo, 'generates correct output');
	});
});

test('sourcemap:normal', t => {
	t.plan(2);
	rollup({
		entry: join(fix, 'foo.jsx'),
		plugins: [jsx()]
	}).then(bun => {
		const out = bun.generate({sourceMap: true});
		t.equal(typeof out.map, 'object', 'returns an object');
		t.true('version' in out.map && 'mappings' in out.map, 'has valid `sourceMap` keys');
	});
});

test('sourcemap:precise', t => {
	t.plan(2);
	rollup({
		entry: join(fix, 'foo.jsx'),
		plugins: [jsx({precise: true})]
	}).then(bun => {
		const out = bun.generate({sourceMap: true});
		t.equal(typeof out.map, 'object', 'returns an object');
		t.true('sources' in out.map && 'sourcesContent' in out.map, 'has valid `sourceMap` keys');
	});
});
