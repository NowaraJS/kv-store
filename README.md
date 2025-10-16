# 🗃️ NowaraJS - kv-store

## 📌 Table of Contents

- [🗃️ KV Store](#-kv-store)
	- [📌 Table of Contents](#-table-of-contents)
	- [📝 Description](#-description)
	- [✨ Features](#-features)
	- [🔧 Installation](#-installation)
	- [⚙️ Usage](#-usage)
		- [Memory Store](#memory-store)
		- [Redis Store (Bun Redis)](#redis-store-bun-redis)
		- [Redis Store (IoRedis)](#redis-store-ioredis)
		- [Custom Store Implementation](#custom-store-implementation)
	- [📚 API Reference](#-api-reference)
		- [KvStore Interface](#kvstore-interface)
		- [MemoryStore](#memorystore)
		- [BunRedisStore](#bunredisstore)
		- [IoRedisStore](#ioredisstore)
	- [🧪 Testing](#-testing)
	- [🔧 Development](#-development)
	- [⚖️ License](#-license)
	- [📧 Contact](#-contact)

## 📝 Description

**KV Store** is a flexible key-value store interface library that provides a unified `KvStore` API allowing custom storage implementations. It comes with built-in adapters for in-memory storage (`MemoryStore`) and Redis storage (`BunRedisStore` and `IoRedisStore`). You can also create your own custom storage adapters by implementing the `KvStore` interface.

## ✨ Features

- 🔌 **Unified Interface**: Common API for different storage backends
- 💾 **Memory Store**: Built-in in-memory storage with TTL support and automatic cleanup
- 🔴 **Redis Support**: Redis adapters using Bun's native Redis client or IoRedis
- 🏗️ **Extensible**: Easy to implement custom storage adapters
- ⏰ **TTL Support**: Time-to-live functionality for keys
- 🔢 **Atomic Operations**: Increment/decrement operations
- 📦 **Type-Safe**: Full TypeScript support with generics
- 🧹 **Auto Cleanup**: Automatic expired key cleanup for memory store

## 🔧 Installation

```bash
bun add @nowarajs/kv-store @nowarajs/error
```

> For Redis support
You can use either the Bun Redis client with the `BunRedisStore` (no additional dependencies required), or IoRedis with the `IoRedisStore`. If you choose IoRedis, you'll need to install it:
```bash
bun add ioredis
```

## ⚙️ Usage

### Memory Store

```ts
import { MemoryStore } from '@nowarajs/kv-store'

// Create a memory store with default cleanup interval (5 minutes)
const store = new MemoryStore()

// Or with custom cleanup interval (in milliseconds)
const storeWithCustomCleanup = new MemoryStore(60000) // 1 minute

// Basic operations
store.set('user:123', { name: 'John', age: 30 })
const user = store.get<{ name: string; age: number }>('user:123')

// With TTL (time-to-live in seconds)
store.set('session:abc', 'session-data', 3600) // Expires in 1 hour

// Atomic operations
store.set('counter', 0)
store.increment('counter', 5) // Returns 5
store.decrement('counter', 2) // Returns 3

// Key management
store.expire('user:123', 300) // Set expiration to 5 minutes
store.del('user:123') // Delete key
```

### Redis Store (Bun Redis)

```ts
import { BunRedisStore } from '@nowarajs/kv-store'

// Create Redis store with Bun's native Redis client
const store = new BunRedisStore('redis://127.0.0.1:6379')

// Or with options
const storeWithOptions = new BunRedisStore('redis://127.0.0.1:6379', {
	// Bun Redis options
})

// Connect to Redis
await store.connect()

// Same API as memory store, but async
await store.set('user:123', { name: 'John', age: 30 })
const user = await store.get<{ name: string; age: number }>('user:123')

// With TTL
await store.set('session:abc', 'session-data', 3600)

// Atomic operations
await store.increment('counter', 5)
await store.decrement('counter', 2)

// Close connection when done
store.close()
```

### Redis Store (IoRedis)

```ts
import { IoRedisStore } from '@nowarajs/kv-store'

// Create Redis store
const store = new IoRedisStore({
	host: 'localhost',
	port: 6379,
	// ... other IoRedis options
})

// Connect to Redis
await store.connect()

// Same API as memory store, but async
await store.set('user:123', { name: 'John', age: 30 })
const user = await store.get<{ name: string; age: number }>('user:123')

// With TTL
await store.set('session:abc', 'session-data', 3600)

// Atomic operations
await store.increment('counter', 5)
await store.decrement('counter', 2)

// Close connection when done
await store.close()
```

### Custom Store Implementation

```ts
import type { KvStore } from '@nowarajs/kv-store'

class MyCustomStore implements KvStore {
	public async connect?(): Promise<void> {
		// Custom connection logic
	}

	public async close?(): Promise<void> {
		// Custom cleanup logic
	}

	public get<T = unknown>(key: string): T | null | Promise<T | null> {
		// Custom get implementation
	}

	public set<T = unknown>(key: string, value: T, ttlSec?: number): void | Promise<void> {
		// Custom set implementation
	}

	public increment(key: string, amount = 1): number | Promise<number> {
		// Custom increment implementation
	}

	public decrement(key: string, amount = 1): number | Promise<number> {
		// Custom decrement implementation
	}

	public del(key: string): boolean | Promise<boolean> {
		// Custom delete implementation
	}

	public expire(key: string, ttlSec: number): boolean | Promise<boolean> {
		// Custom expiration implementation
	}

	public exists(key: string): boolean | Promise<boolean> {
		// Custom exists check implementation
	}

	public clear(): void | Promise<void> {
		// Custom clear all implementation
	}
}
```

## 📚 API Reference

You can find the complete API reference documentation for `kv-store` at:

- [Reference Documentation](https://nowarajs.github.io/kv-store/)

## ⚖️ License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## 📧 Contact

- Mail: [nowarajs@pm.me](mailto:nowarajs@pm.me)
- Github: [Project link](https://github.com/NowaraJS/kv-store)

