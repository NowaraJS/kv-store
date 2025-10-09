import pkg from './package.json';

const dependencies: string[] = 'dependencies' in pkg ? Object.keys(pkg.dependencies ?? {}) : [];
const devDependencies: string[] = 'devDependencies' in pkg ? Object.keys(pkg.devDependencies ?? {}) : [];
const peerDependencies: string[] = 'peerDependencies' in pkg ? Object.keys(pkg.peerDependencies ?? {}) : [];

await Bun.$`rm -rf dist`;
console.log('🗑️  Deleted dist folder if it existed. ✅');

await Bun.$`tsc --project tsconfig.build.json`;
await Bun.$`bunx tsc-alias -p tsconfig.build.json`;
console.log('🔍 Type analysis and generation completed. ✅');

await Bun.build({
	target: 'bun',
	external: [
		...dependencies,
		...devDependencies,
		...peerDependencies
	],
	root: './source',
	entrypoints: [

		// # ————————— BunRedisStore ————————— #
		'./source/bun-redis/index.ts',

		// # ————————— Enums ————————— #
		'./source/enums/index.ts',

		// # ————————— Types ————————— #
		'./source/types/index.ts',

		// # ————————— MemoryStore ————————— #
		'./source/memory/index.ts',

		// # ————————— IoRedisStore ————————— #
		'./source/ioredis/index.ts'
	],
	outdir: './dist',
	splitting: true,
	format: 'esm',
	minify: false,
	sourcemap: 'none'
});
console.log('🎉 Build completed successfully! 🎉');

process.exit(0);