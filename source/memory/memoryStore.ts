import { BaseError } from '@nowarajs/error';

import { KV_STORE_ERROR_KEYS } from '#/enums/kvStoreErrorKeys';
import type { KvStore } from '#/types/store';
import type { MemoryStoreEntry } from './types/memoryStoreEntry';

export class MemoryStore implements KvStore {
	/**
	 * In-memory key-value store.
	 */
	private readonly _store = new Map<string, MemoryStoreEntry>();

	/**
	 * Cleanup interval (5 minutes by default).
	 */
	private readonly _cleanupInterval: number;

	/**
	 * Timer for cleanup operations.
	 */
	private _cleanupTimer: Timer | null = null;

	/**
	 * Creates instance and starts cleanup process.
	 */
	public constructor(cleanupIntervalMs?: number) {
		this._cleanupInterval = cleanupIntervalMs ?? 300000;
		this._startCleanup();
	}

	public get<T = unknown>(key: string): T | null {
		const entry = this._store.get(key);

		if (!entry)
			return null;

		const now = Date.now();
		if (now > entry.expiresAt && entry.expiresAt !== -1) {
			this._store.delete(key);
			return null;
		}

		return entry.value as T;
	}

	public set<T = unknown>(key: string, value: T, ttlSec?: number): void {
		const expiresAt = ttlSec
			? Date.now() + (ttlSec * 1000)
			: -1;
		this._store.set(key, { value, expiresAt });
	}

	public increment(key: string, amount = 1): number {
		// Use get() to handle expiration automatically
		const current = this.get<number>(key);
		const entry = this._store.get(key);

		// If key exists, validate it's a number (like Redis behavior)
		if (current !== null && typeof current !== 'number')
			throw new BaseError({
				message: KV_STORE_ERROR_KEYS.NOT_INTEGER
			});

		const currentValue = current ?? 0;
		const newValue = currentValue + amount;

		// Preserve existing TTL or set no expiration for new keys
		const expiresAt = entry ? entry.expiresAt : -1;
		this._store.set(key, { value: newValue, expiresAt });

		return newValue;
	}

	public decrement(key: string, amount = 1): number {
		// Use get() to handle expiration automatically
		const current = this.get<number>(key);
		const entry = this._store.get(key);

		// If key exists, validate it's a number (like Redis behavior)
		if (current !== null && typeof current !== 'number')
			throw new BaseError({
				message: KV_STORE_ERROR_KEYS.NOT_INTEGER
			});

		const currentValue = current ?? 0;
		const newValue = currentValue - amount;

		// Preserve existing TTL or set no expiration for new keys
		const expiresAt = entry ? entry.expiresAt : -1;
		this._store.set(key, { value: newValue, expiresAt });

		return newValue;
	}

	public del(key: string): boolean {
		return this._store.delete(key);
	}

	public expire(key: string, ttlSec: number): boolean {
		const entry = this._store.get(key);
		if (!entry)
			return false;

		entry.expiresAt = Date.now() + (ttlSec * 1000);
		return true;
	}

	public ttl(key: string): number {
		const entry = this._store.get(key);
		if (!entry)
			return -1;

		if (entry.expiresAt === -1)
			return -1;

		const remaining = entry.expiresAt - Date.now();
		return remaining > 0 ? Math.ceil(remaining / 1000) : -1;
	}

	public clean(): number {
		const sizeBefore = this._store.size;
		this._store.clear();
		return sizeBefore;
	}

	/**
	 * Starts the cleanup process for expired entries.
	 */
	private _startCleanup(): void {
		if (this._cleanupTimer)
			return;

		this._cleanupTimer = setInterval(() => {
			this._removeExpiredEntries();
		}, this._cleanupInterval);
	}

	/**
	 * Removes expired entries from the store.
	 */
	private _removeExpiredEntries(): void {
		const now = Date.now();

		for (const [key, entry] of this._store.entries())
			if (entry.expiresAt !== -1 && now > entry.expiresAt)
				this._store.delete(key);
	}

	/**
	 * Stops the cleanup process and clears resources.
	 */
	public destroy(): void {
		if (this._cleanupTimer) {
			clearInterval(this._cleanupTimer);
			this._cleanupTimer = null;
		}
		this._store.clear();
	}
}