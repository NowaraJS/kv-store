# 🗃️ NowaraJS KV Store

Switching between in-memory caching and Redis shouldn't require rewriting your entire storage layer. I built NowaraJS KV Store to provide a unified interface that lets you swap backends without touching your business logic.

## Why this package?

The goal is simple: **Write once, deploy anywhere.**

Whether you're prototyping locally with `MemoryStore` or scaling with Redis in production, the API stays the same. No vendor lock-in, no adapter headaches.

## 📌 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [License](#-license)
- [Contact](#-contact)

## ✨ Features

- 🔌 **Unified Interface**: One API, multiple backends. Swap storage without code changes.
- 💾 **Memory Store**: Fast in-memory storage with TTL and automatic cleanup.
- 🔴 **Redis Ready**: Native Bun Redis or IoRedis — your choice.
- 🏗️ **Extensible**: Implement `KvStore` and plug in your own backend.
- ⏰ **TTL Support**: Keys expire automatically when you need them to.
- 🔢 **Atomic Operations**: Built-in increment/decrement for counters.
- 📦 **Type-Safe**: Full TypeScript generics, no `any` in sight.

## 🔧 Installation

```bash
bun add @nowarajs/kv-store @nowarajs/error
```

> **Redis support:** Use Bun's native Redis with `BunRedisStore` (zero extra deps), or install IoRedis for `IoRedisStore`:
> ```bash
> bun add ioredis
> ```

## ⚙️ Usage

### MemoryStore - Local Development & Testing

Perfect for prototyping or when you don't need persistence. TTL works out of the box, and expired keys clean themselves up.

```ts
import { MemoryStore } from '@nowarajs/kv-store';

const store = new MemoryStore();

// Store a user, retrieve it later
store.set('user:123', { name: 'John', age: 30 });
const user = store.get<{ name: string; age: number }>('user:123');

// Session that expires in 1 hour
store.set('session:abc', 'session-data', 3600);

// Atomic counter operations
store.set('counter', 0);
store.increment('counter', 5); // → 5
store.decrement('counter', 2); // → 3
```

### BunRedisStore - Production with Bun

When you're ready to scale. Same API, now backed by Redis.

```ts
import { BunRedisStore } from '@nowarajs/kv-store';

const store = new BunRedisStore('redis://127.0.0.1:6379');
await store.connect();

// Exact same API, just async
await store.set('user:123', { name: 'John', age: 30 });
const user = await store.get<{ name: string; age: number }>('user:123');

await store.set('session:abc', 'session-data', 3600);
await store.increment('counter', 5);

store.close();
```

### IoRedisStore - When You Need More Control

Full IoRedis configuration for advanced Redis setups.

```ts
import { IoRedisStore } from '@nowarajs/kv-store';

const store = new IoRedisStore({
    host: 'localhost',
    port: 6379,
    // ... any IoRedis option
});

await store.connect();

// Same unified API
await store.set('user:123', { name: 'John', age: 30 });
const user = await store.get<{ name: string; age: number }>('user:123');

await store.close();
```

### Custom Store - Bring Your Own Backend

Implementing `KvStore` is straightforward. Here's the interface you need to satisfy:

```ts
import type { KvStore } from '@nowarajs/kv-store';

class MyCustomStore implements KvStore {
    public get<T = unknown>(key: string): T | null | Promise<T | null> {
        // Your logic here
    }

    public set<T = unknown>(key: string, value: T, ttlSec?: number): void | Promise<void> {
        // Your logic here
    }

    public increment(key: string, amount?: number): number | Promise<number> {
        // Your logic here
    }

    public decrement(key: string, amount?: number): number | Promise<number> {
        // Your logic here
    }

    public del(key: string): boolean | Promise<boolean> {
        // Your logic here
    }

    public expire(key: string, ttlSec: number): boolean | Promise<boolean> {
        // Your logic here
    }

    public ttl(key: string): number | Promise<number> {
        // Your logic here
    }

    public clean(): number | Promise<number> {
        // Your logic here
    }
}
```
```

## 📚 API Reference

Full docs: [nowarajs.github.io/kv-store](https://nowarajs.github.io/kv-store/)

## ⚖️ License

MIT - Feel free to use it.

## 📧 Contact

- Mail: [nowarajs@pm.me](mailto:nowarajs@pm.me)
- GitHub: [NowaraJS](https://github.com/NowaraJS)

