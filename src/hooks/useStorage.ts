/**
 * useStorage — a unified storage hook for React (TypeScript)
 *
 * Two storage backends:
 *  • localStorage  — simple key/value with TTL, namespacing, and JSON serialization
 *  • IndexedDB     — mini ORM with typed collections, querying, transactions, and migrations
 *
 * Industry-standard features included:
 *  - TTL (time-to-live) expiry for localStorage entries
 *  - Namespacing to prevent key collisions
 *  - Cross-tab sync via StorageEvent for localStorage
 *  - Optimistic React state — reads are instant, writes are async
 *  - Versioned IndexedDB schema with upgrade/migration hooks
 *  - Full CRUD + filtering/sorting on IndexedDB collections
 *  - Graceful error handling — no throws, errors surface via result objects
 *  - TypeScript generics throughout
 */

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    type Dispatch,
    type SetStateAction,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Shared result type
// ─────────────────────────────────────────────────────────────────────────────

export type StorageResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: string };

// ─────────────────────────────────────────────────────────────────────────────
// 1. localStorage backend
// ─────────────────────────────────────────────────────────────────────────────

export interface LocalStorageOptions {
    /** Optional namespace prefix — avoids key collisions across apps. Default: "" */
    namespace?: string;
    /** TTL in milliseconds. After this duration the value is treated as absent. */
    ttl?: number;
}

interface StoredEntry<T> {
    value: T;
    expiresAt: number | null; // epoch ms, or null = never expires
}

function lsKey(namespace: string, key: string): string {
    return namespace ? `${namespace}::${key}` : key;
}

function lsRead<T>(rawKey: string): StorageResult<T | null> {
    try {
        const raw = window.localStorage.getItem(rawKey);
        if (raw === null) return { ok: true, data: null };

        const entry: StoredEntry<T> = JSON.parse(raw);

        if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
            // Expired — silently purge
            window.localStorage.removeItem(rawKey);
            return { ok: true, data: null };
        }

        return { ok: true, data: entry.value };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

function lsWrite<T>(
    rawKey: string,
    value: T,
    ttl?: number
): StorageResult<void> {
    try {
        const entry: StoredEntry<T> = {
            value,
            expiresAt: ttl != null ? Date.now() + ttl : null,
        };
        window.localStorage.setItem(rawKey, JSON.stringify(entry));
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

function lsRemove(rawKey: string): StorageResult<void> {
    try {
        window.localStorage.removeItem(rawKey);
        return { ok: true, data: undefined };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

// ─── useLocalStorage ───────────────────────────────────────────────────────

export interface UseLocalStorageReturn<T> {
    /** Current value (undefined while SSR / not yet read) */
    value: T | null | undefined;
    /** Last error message, if any */
    error: string | null;
    /** Persist a new value */
    set: (value: T) => StorageResult<void>;
    /** Remove the key */
    remove: () => StorageResult<void>;
    /** Force a re-read from storage */
    refresh: () => void;
}

export function useLocalStorage<T>(
    key: string,
    defaultValue?: T,
    options: LocalStorageOptions = {}
): UseLocalStorageReturn<T> {
    const { namespace = "", ttl } = options;
    const rawKey = lsKey(namespace, key);

    const [value, setValue] = useState<T | null | undefined>(() => {
        if (typeof window === "undefined") return undefined;
        const result = lsRead<T>(rawKey);
        if (!result.ok) return defaultValue ?? null;
        return result.data ?? defaultValue ?? null;
    });

    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(() => {
        const result = lsRead<T>(rawKey);
        if (result.ok) {
            setValue(result.data ?? defaultValue ?? null);
            setError(null);
        } else {
            setError(result.error);
        }
    }, [rawKey, defaultValue]);

    // Cross-tab sync
    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === rawKey) refresh();
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, [rawKey, refresh]);

    const set = useCallback(
        (newValue: T): StorageResult<void> => {
            const result = lsWrite(rawKey, newValue, ttl);
            if (result.ok) {
                setValue(newValue);
                setError(null);
            } else {
                setError(result.error);
            }
            return result;
        },
        [rawKey, ttl]
    );

    const remove = useCallback((): StorageResult<void> => {
        const result = lsRemove(rawKey);
        if (result.ok) {
            setValue(defaultValue ?? null);
            setError(null);
        } else {
            setError(result.error);
        }
        return result;
    }, [rawKey, defaultValue]);

    return { value, error, set, remove, refresh };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. IndexedDB backend — mini ORM
// ─────────────────────────────────────────────────────────────────────────────

/** Base shape every document must satisfy */
export type DocBase = { id: string | number };

/** A migration function receives the database at a specific version */
export type MigrationFn = (db: IDBDatabase, tx: IDBTransaction) => void;

export interface CollectionSchema {
    name: string;
    keyPath?: string; // default: "id"
    autoIncrement?: boolean;
    indexes?: Array<{
        name: string;
        keyPath: string | string[];
        options?: IDBIndexParameters;
    }>;
}

export interface IDBConfig {
    dbName: string;
    version: number;
    collections: CollectionSchema[];
    /** Optional per-version migration hooks. Key = version number (1, 2, 3 …) */
    migrations?: Record<number, MigrationFn>;
}

// ─── DB singleton ──────────────────────────────────────────────────────────

const dbCache = new Map<string, Promise<IDBDatabase>>();

function openDB(config: IDBConfig): Promise<IDBDatabase> {
    const cacheKey = `${config.dbName}@${config.version}`;
    if (dbCache.has(cacheKey)) return dbCache.get(cacheKey)!;

    const promise = new Promise<IDBDatabase>((resolve, reject) => {
        if (typeof indexedDB === "undefined") {
            reject(new Error("IndexedDB is not available in this environment."));
            return;
        }

        const request = indexedDB.open(config.dbName, config.version);

        request.onupgradeneeded = (event) => {
            const db = request.result;
            const tx = request.transaction!;

            // Ensure all declared collections exist
            for (const col of config.collections) {
                if (!db.objectStoreNames.contains(col.name)) {
                    const store = db.createObjectStore(col.name, {
                        keyPath: col.keyPath ?? "id",
                        autoIncrement: col.autoIncrement ?? false,
                    });
                    for (const idx of col.indexes ?? []) {
                        store.createIndex(idx.name, idx.keyPath, idx.options);
                    }
                }
            }

            // Run version-specific migrations
            const targetVersion = event.newVersion ?? config.version;
            const oldVersion = event.oldVersion;
            for (let v = oldVersion + 1; v <= targetVersion; v++) {
                config.migrations?.[v]?.(db, tx);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
            reject(request.error ?? new Error("IDB open failed"));
        request.onblocked = () =>
            reject(new Error("IDB upgrade blocked by another tab"));
    });

    dbCache.set(cacheKey, promise);
    return promise;
}

// ─── Query helpers ─────────────────────────────────────────────────────────

export type WhereClause<T> = Partial<{
    [K in keyof T]: T[K] | ((val: T[K]) => boolean);
}>;

export type OrderByClause<T> = {
    field: keyof T;
    direction?: "asc" | "desc";
};

export interface QueryOptions<T> {
    where?: WhereClause<T>;
    orderBy?: OrderByClause<T>;
    limit?: number;
    offset?: number;
}

function matchesWhere<T>(doc: T, where: WhereClause<T>): boolean {
    for (const [k, condition] of Object.entries(where as Record<string, unknown>)) {
        const docVal = (doc as Record<string, unknown>)[k];
        if (typeof condition === "function") {
            if (!(condition as (v: unknown) => boolean)(docVal)) return false;
        } else {
            if (docVal !== condition) return false;
        }
    }
    return true;
}

function sortDocs<T>(docs: T[], orderBy: OrderByClause<T>): T[] {
    const { field, direction = "asc" } = orderBy;
    return [...docs].sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return direction === "asc" ? cmp : -cmp;
    });
}

// ─── Collection ORM ────────────────────────────────────────────────────────

export class Collection<T extends DocBase> {
    constructor(
        private readonly dbPromise: Promise<IDBDatabase>,
        private readonly storeName: string
    ) { }

    private async tx(
        mode: IDBTransactionMode,
        fn: (store: IDBObjectStore) => IDBRequest | void
    ): Promise<StorageResult<unknown>> {
        try {
            const db = await this.dbPromise;
            return await new Promise((resolve) => {
                const tx = db.transaction(this.storeName, mode);
                const store = tx.objectStore(this.storeName);
                const req = fn(store);

                if (!req) {
                    tx.oncomplete = () => resolve({ ok: true, data: undefined });
                    tx.onerror = () =>
                        resolve({ ok: false, error: String(tx.error) });
                    return;
                }

                req.onsuccess = () => resolve({ ok: true, data: req.result });
                req.onerror = () =>
                    resolve({ ok: false, error: String(req.error) });
            });
        } catch (e) {
            return { ok: false, error: String(e) };
        }
    }

    /** Insert or fully replace a document */
    async put(doc: T): Promise<StorageResult<T>> {
        const result = await this.tx("readwrite", (store) => store.put(doc));
        if (!result.ok) return result as StorageResult<T>;
        return { ok: true, data: doc };
    }

    /** Insert multiple documents in a single transaction */
    async putMany(docs: T[]): Promise<StorageResult<T[]>> {
        try {
            const db = await this.dbPromise;
            return await new Promise((resolve) => {
                const tx = db.transaction(this.storeName, "readwrite");
                const store = tx.objectStore(this.storeName);
                for (const doc of docs) store.put(doc);
                tx.oncomplete = () => resolve({ ok: true, data: docs });
                tx.onerror = () =>
                    resolve({ ok: false, error: String(tx.error) });
            });
        } catch (e) {
            return { ok: false, error: String(e) };
        }
    }

    /** Fetch a single document by primary key */
    async get(id: string | number): Promise<StorageResult<T | null>> {
        const result = await this.tx("readonly", (store) => store.get(id));
        if (!result.ok) return result as StorageResult<T | null>;
        return { ok: true, data: (result.data as T) ?? null };
    }

    /** Fetch all documents, with optional filtering / sorting / pagination */
    async findMany(opts: QueryOptions<T> = {}): Promise<StorageResult<T[]>> {
        try {
            const db = await this.dbPromise;
            return await new Promise((resolve) => {
                const tx = db.transaction(this.storeName, "readonly");
                const store = tx.objectStore(this.storeName);
                const req = store.getAll();

                req.onsuccess = () => {
                    let docs: T[] = req.result as T[];

                    if (opts.where) {
                        docs = docs.filter((d) => matchesWhere(d, opts.where!));
                    }
                    if (opts.orderBy) {
                        docs = sortDocs(docs, opts.orderBy);
                    }
                    if (opts.offset != null) {
                        docs = docs.slice(opts.offset);
                    }
                    if (opts.limit != null) {
                        docs = docs.slice(0, opts.limit);
                    }

                    resolve({ ok: true, data: docs });
                };
                req.onerror = () =>
                    resolve({ ok: false, error: String(req.error) });
            });
        } catch (e) {
            return { ok: false, error: String(e) };
        }
    }

    /** Find the first document matching the where clause */
    async findOne(
        where: WhereClause<T>
    ): Promise<StorageResult<T | null>> {
        const result = await this.findMany({ where, limit: 1 });
        if (!result.ok) return result as StorageResult<T | null>;
        return { ok: true, data: result.data[0] ?? null };
    }

    /** Partial update — merges fields into existing document */
    async update(
        id: string | number,
        patch: Partial<Omit<T, "id">>
    ): Promise<StorageResult<T | null>> {
        const existing = await this.get(id);
        if (!existing.ok) return existing as StorageResult<T | null>;
        if (existing.data === null) return { ok: true, data: null };
        const updated = { ...existing.data, ...patch } as T;
        return this.put(updated);
    }

    /** Update all documents matching the where clause */
    async updateMany(
        where: WhereClause<T>,
        patch: Partial<Omit<T, "id">>
    ): Promise<StorageResult<T[]>> {
        const found = await this.findMany({ where });
        if (!found.ok) return found;
        const updated = found.data.map((d) => ({ ...d, ...patch }) as T);
        return this.putMany(updated);
    }

    /** Delete a document by primary key */
    async delete(id: string | number): Promise<StorageResult<void>> {
        const result = await this.tx("readwrite", (store) => store.delete(id));
        return result as StorageResult<void>;
    }

    /** Delete all documents matching the where clause */
    async deleteMany(where: WhereClause<T>): Promise<StorageResult<number>> {
        const found = await this.findMany({ where });
        if (!found.ok) return found as StorageResult<number>;
        try {
            const db = await this.dbPromise;
            return await new Promise((resolve) => {
                const tx = db.transaction(this.storeName, "readwrite");
                const store = tx.objectStore(this.storeName);
                for (const doc of found.data) store.delete(doc.id);
                tx.oncomplete = () =>
                    resolve({ ok: true, data: found.data.length });
                tx.onerror = () =>
                    resolve({ ok: false, error: String(tx.error) });
            });
        } catch (e) {
            return { ok: false, error: String(e) };
        }
    }

    /** Count documents, optionally filtered */
    async count(where?: WhereClause<T>): Promise<StorageResult<number>> {
        if (!where) {
            const result = await this.tx("readonly", (store) => store.count());
            if (!result.ok) return result as StorageResult<number>;
            return { ok: true, data: result.data as number };
        }
        const found = await this.findMany({ where });
        if (!found.ok) return found as StorageResult<number>;
        return { ok: true, data: found.data.length };
    }

    /** Clear the entire collection */
    async clear(): Promise<StorageResult<void>> {
        const result = await this.tx("readwrite", (store) => store.clear());
        return result as StorageResult<void>;
    }
}

// ─── useIndexedDB ──────────────────────────────────────────────────────────

export interface UseIndexedDBReturn {
    /** True once the DB connection is ready */
    ready: boolean;
    /** Non-null if the DB failed to open */
    error: string | null;
    /** Returns a typed Collection ORM for the given store name */
    collection: <T extends DocBase>(storeName: string) => Collection<T>;
}

export function useIndexedDB(config: IDBConfig): UseIndexedDBReturn {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dbPromiseRef = useRef<Promise<IDBDatabase> | null>(null);

    useEffect(() => {
        const promise = openDB(config);
        dbPromiseRef.current = promise;
        promise
            .then(() => setReady(true))
            .catch((e) => setError(String(e)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.dbName, config.version]);

    const collection = useCallback(
        <T extends DocBase>(storeName: string): Collection<T> => {
            if (!dbPromiseRef.current) {
                // Return a collection whose every call will reject gracefully
                const neverReady: Promise<IDBDatabase> = Promise.reject(
                    new Error("DB not initialised yet")
                );
                neverReady.catch(() => { }); // suppress unhandled rejection
                return new Collection<T>(neverReady, storeName);
            }
            return new Collection<T>(dbPromiseRef.current, storeName);
        },
        []
    );

    return { ready, error, collection };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Unified useStorage hook
// ─────────────────────────────────────────────────────────────────────────────

export interface UseStorageReturn {
    local: {
        /**
         * Returns a reactive key/value handle.
         * Equivalent to calling `useLocalStorage` directly.
         */
        use: <T>(
            key: string,
            defaultValue?: T,
            options?: LocalStorageOptions
        ) => UseLocalStorageReturn<T>;
    };
    idb: UseIndexedDBReturn;
}

/**
 * Primary entry-point.
 *
 * @example
 * ```tsx
 * const { local, idb } = useStorage({
 *   dbName: "my-app",
 *   version: 1,
 *   collections: [
 *     { name: "todos", indexes: [{ name: "by-done", keyPath: "done" }] },
 *   ],
 * });
 *
 * // localStorage
 * const theme = local.use<string>("theme", "dark");
 * theme.set("light");
 *
 * // IndexedDB
 * const todos = idb.collection<Todo>("todos");
 * await todos.put({ id: "1", text: "Buy milk", done: false });
 * const pending = await todos.findMany({ where: { done: false } });
 * ```
 */
export function useStorage(idbConfig: IDBConfig): UseStorageReturn {
    const idb = useIndexedDB(idbConfig);

    // The `local.use` function is a stable reference that calls useLocalStorage.
    // Consumers must call it at the top level of their own components.
    const localUse = useCallback(
        <T,>(key: string, defaultValue?: T, options?: LocalStorageOptions) =>
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useLocalStorage<T>(key, defaultValue, options),
        []
    );

    return {
        local: { use: localUse },
        idb,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Convenience hook — reactive IDB query
//    Keeps component state in sync after any write.
// ─────────────────────────────────────────────────────────────────────────────

export interface UseCollectionReturn<T> {
    docs: T[];
    loading: boolean;
    error: string | null;
    /** Re-fetch from DB */
    refresh: () => Promise<void>;
    /** Write then refresh */
    put: (doc: T) => Promise<StorageResult<T>>;
    /** Delete then refresh */
    remove: (id: string | number) => Promise<StorageResult<void>>;
}

/**
 * Reactive wrapper around a Collection that automatically re-queries
 * whenever you call `put` or `remove`.
 *
 * @example
 * ```tsx
 * const { docs, put, remove } = useCollection<Todo>(
 *   idb.collection("todos"),
 *   { where: { done: false }, orderBy: { field: "createdAt" } }
 * );
 * ```
 */
export function useCollection<T extends DocBase>(
    collection: Collection<T>,
    query: QueryOptions<T> = {}
): UseCollectionReturn<T> {
    const [docs, setDocs] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stable query ref so effect doesn't re-run on inline object identity change
    const queryRef = useRef(query);
    queryRef.current = query;

    const refresh = useCallback(async () => {
        setLoading(true);
        const result = await collection.findMany(queryRef.current);
        if (result.ok) {
            setDocs(result.data);
            setError(null);
        } else {
            setError(result.error);
        }
        setLoading(false);
    }, [collection]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const put = useCallback(
        async (doc: T): Promise<StorageResult<T>> => {
            const result = await collection.put(doc);
            if (result.ok) await refresh();
            return result;
        },
        [collection, refresh]
    );

    const remove = useCallback(
        async (id: string | number): Promise<StorageResult<void>> => {
            const result = await collection.delete(id);
            if (result.ok) await refresh();
            return result;
        },
        [collection, refresh]
    );

    return { docs, loading, error, refresh, put, remove };
}

export default useStorage;