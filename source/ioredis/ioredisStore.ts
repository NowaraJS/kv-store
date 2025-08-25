
import { BaseError } from '@nowarajs/error';
import { Redis, type RedisOptions } from 'ioredis';

import { KV_STORE_ERROR_KEYS } from '#/enums/kvStoreErrorKeys';
import type { KvStore } from '#/types/store';

export class IoRedisStore implements KvStore {
	/**
	 * Redis client instance.
	 */
	private readonly _client: Redis;

	/**
	 * Creates an IoRedis store instance.
	 *
	 * @param client - The ioredis client instance
	 */
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
			throw new BaseError({
				message: KV_STORE_ERROR_KEYS.CONNECTION_FAILED,
				cause: e
			});
		}
	}

	public async close(): Promise<void> {
		try {
			await this._client.quit();
		} catch (e) {
			throw new BaseError({
				message: KV_STORE_ERROR_KEYS.CLOSING_CONNECTION_FAILED,
				cause: e
			});
		}
	}

	public async get<T = unknown>(key: string): Promise<T | null> {
		const value = await this._client.get(key);
		if (value === null)
			return null;

		try {
			return JSON.parse(value) as T;
		} catch {
			// If it's not JSON, return as string (Redis behavior)
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
		// Check if key exists and validate it's a number
		const current = await this._client.get(key);
		if (current !== null) {
			const parsed = Number(current);
			if (Number.isNaN(parsed))
				throw new BaseError({
					message: KV_STORE_ERROR_KEYS.NOT_INTEGER
				});
		}

		if (amount === 1)
			return await this._client.incr(key);

		return await this._client.incrby(key, amount);
	}

	public async decrement(key: string, amount = 1): Promise<number> {
		// Check if key exists and validate it's a number
		const current = await this._client.get(key);
		if (current !== null) {
			const parsed = Number(current);
			if (Number.isNaN(parsed))
				throw new BaseError({
					message: KV_STORE_ERROR_KEYS.NOT_INTEGER
				});
		}

		if (amount === 1)
			return await this._client.decr(key);

		return await this._client.decrby(key, amount);
	}

	public async del(key: string): Promise<boolean> {
		const result = await this._client.del(key);
		return result === 1;
	}

	public async expire(key: string, ttlSec: number): Promise<boolean> {
		const result = await this._client.expire(key, ttlSec);
		return result === 1;
	}

	public async ttl(key: string): Promise<number> {
		return await this._client.ttl(key);
	}

	public async clean(): Promise<number> {
		const keys = await this._client.keys('*');
		if (keys.length === 0)
			return 0;

		const result = await this._client.del(...keys);
		return result;
	}
}
