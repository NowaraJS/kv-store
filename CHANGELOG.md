
## v1.1.0


### 🚀 Enhancements

- **🚀:** [add KV_STORE_ERROR_KEYS for error handling] ## Features - Introduced a new constant `KV_STORE_ERROR_KEYS` for managing error keys. ([18dc55f](https://github.com/NowaraJS/kv-store/commit/18dc55f))
- **🚀:** [add additional error keys for KV store] ([4155d5c](https://github.com/NowaraJS/kv-store/commit/4155d5c))
- **🚀:** [implement IoRedisStore adapter for key-value storage] ([eec095e](https://github.com/NowaraJS/kv-store/commit/eec095e))
- **🚀:** [implement MemoryStore class for in-memory key-value storage] ([3f6992d](https://github.com/NowaraJS/kv-store/commit/3f6992d))
- **🚀:** [remove unused error and utility exports from index.ts] ## Features - Removed exports related to error handling and utility functions. ([09ba703](https://github.com/NowaraJS/kv-store/commit/09ba703))

### 📖 Documentation

- **📖:** [add SECURITY.md for vulnerability reporting and version support] ([c5652b7](https://github.com/NowaraJS/kv-store/commit/c5652b7))
- **📖:** [add CONTRIBUTING.md for project contribution guidelines] ([0fe006d](https://github.com/NowaraJS/kv-store/commit/0fe006d))
- **📖:** [add CODE_OF_CONDUCT.md to establish community guidelines] ([b19842e](https://github.com/NowaraJS/kv-store/commit/b19842e))
- **📖)::** [enhance IoRedisStore and MemoryStore with detailed JSDoc comments] ([1b1e06d](https://github.com/NowaraJS/kv-store/commit/1b1e06d))
- **📖:** [update README.md for kv-store package details] ## Documentation Changes - Updated the README.md to reflect the new structure and features of the kv-store package. - Removed outdated package template instructions and replaced them with relevant information about the KV Store. - Enhanced the installation and usage sections with examples for MemoryStore and IoRedisStore. - Added a new section for Custom Store Implementation to guide users in creating their own storage solutions. - Updated contact information and reference links for better accessibility. ([0a2aabd](https://github.com/NowaraJS/kv-store/commit/0a2aabd))

### 📦 Build

- **📦:** [update package.json for kv-store project] ([251071f](https://github.com/NowaraJS/kv-store/commit/251071f))
- **📦:** [reorganize entrypoints in builder.ts for clarity] ## Build - Removed unused error and utility entrypoints. - Consolidated entrypoints for enums and types. ([55e1b32](https://github.com/NowaraJS/kv-store/commit/55e1b32))
- **📦:** [update ioredis dependency to latest version] ## Build Changes - Added "ioredis": "latest" to devDependencies. ([d10bc3e](https://github.com/NowaraJS/kv-store/commit/d10bc3e))

### 🌊 Types

- **🌊:** [add KvStore type definition for key-value store interface] ([0ccc3ec](https://github.com/NowaraJS/kv-store/commit/0ccc3ec))

### 🦉 Chore

- **🦉:** [rename MIT License file with explicit .md] ([d466799](https://github.com/NowaraJS/kv-store/commit/d466799))
- **🦉:** [update contact email in issue template] Update the contact email in the issue template from komiriko@pm.me to nowarajs@pm.me for better project communication. ([d8bac2d](https://github.com/NowaraJS/kv-store/commit/d8bac2d))
- **🦉:** [remove unused utility files and tests] - Deleted unused utility files: exampleKeyError.ts, foo.ts, and their corresponding index files. - Removed associated test files to clean up the codebase. ([2861d4c](https://github.com/NowaraJS/kv-store/commit/2861d4c))

### 🧪 Tests

- **🧪:** [add comprehensive tests for MemoryStore functionality] ([7917b89](https://github.com/NowaraJS/kv-store/commit/7917b89))

### ❤️ Contributors

- Komiroko <komiriko@pm.me>

