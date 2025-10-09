
import { BaseError } from '@nowarajs/error';
import { Redis, type RedisOptions } from 'ioredis';

import { KV_STORE_ERROR_KEYS } from '#/enums/kv-store-error-keys';
import type { KvStore } from '#/types/kv-store';

/**
 * Redis-based key-value store implementation using ioredis client.
 *
 * Provides a Redis-backed implementation of the KvStore interface with
 * automatic JSON serialization/deserialization and proper error handling.
 */
export class IoRedisStore implements KvStore {
	/**
	 * Redis client instance.
	 */
	private readonly _client: Redis;

	public constructor(options: RedisOptions) {
		this._client = new Redis({
			...options,
			lazyConnect: true
		});
	}

	public async connect(): Promise<void> {
		try {
			await this._client.connect();
		} catch (e) {
			throw new BaseError(KV_STORE_ERROR_KEYS.CONNECTION_FAILED, e);
		}
	}

	public async close(): Promise<void> {
		try {
			await this._client.quit();
		} catch (e) {
			throw new BaseError(KV_STORE_ERROR_KEYS.CLOSING_CONNECTION_FAILED, e);
		}
	}

	public async get<T = unknown>(key: string): Promise<T | null> {
		const value = await this._client.get(key);
		if (value === null)
			return null;

		try {
			return JSON.parse(value) as T;
		} catch {
			return value as T;
		}
	}

	public async set<T = unknown>(key: string, value: T, ttlSec?: number): Promise<void> {
		const serialized = typeof value === 'string'
			? value
			: JSON.stringify(value);

		if (ttlSec)
			await this._client.setex(key, ttlSec, serialized);
		else
			await this._client.set(key, serialized);
	}

	public async increment(key: string, amount = 1): Promise<number> {
		const current = await this._client.get(key);
		if (current !== null && isNaN(Number(current)))
			throw new BaseError(KV_STORE_ERROR_KEYS.NOT_INTEGER);

		if (amount === 1)
			return this._client.incr(key);

		return this._client.incrby(key, amount);
	}

	public async decrement(key: string, amount = 1): Promise<number> {
		const current = await this._client.get(key);
		if (current !== null && isNaN(Number(current)))
			throw new BaseError(KV_STORE_ERROR_KEYS.NOT_INTEGER);

		if (amount === 1)
			return this._client.decr(key);

		return this._client.decrby(key, amount);
	}

	public async del(key: string): Promise<boolean> {
		const result = await this._client.del(key);
		return result === 1;
	}

	public async expire(key: string, ttlSec: number): Promise<boolean> {
		const result = await this._client.expire(key, ttlSec);
		return result === 1;
	}

	public ttl(key: string): Promise<number> {
		return this._client.ttl(key);
	}

	public async clean(): Promise<number> {
		const keys = await this._client.keys('*');
		if (keys.length === 0)
			return 0;
		return this._client.del(...keys);
	}
}
