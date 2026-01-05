import { useEffect, useState, useCallback, useRef, useMemo } from "react";

export type useAsyncLocalStorageStateOptions<T> = {
    defaultValue?: T | (() => T | Promise<T>),
    storageSync?: boolean,
    resetStorage?: boolean,
    resetIfError?: boolean,
    serializer?: {
        stringify: (value: unknown) => Promise<string>
        parse: (value: string) => Promise<unknown>
    }
}

export type useAsyncLocalStorageStateReturnType<T> = [
    T,
    (value: T | ((prevState: T) => T)) => Promise<void>,
    () => void
];

export function useAsyncLocalStorageState<T>(
    key: string,
    options: useAsyncLocalStorageStateOptions<T> = {} as useAsyncLocalStorageStateOptions<T>
): useAsyncLocalStorageStateReturnType<T> {

    const { defaultValue, serializer, storageSync, resetStorage, resetIfError } = useMemo(() => ({ storageSync: true, defaultValue: null, ...options }), [options]);

    const { serialize, parse } = useMemo(() => {
        const serialize = serializer?.stringify || JSON.stringify;
        const parse = serializer?.parse || JSON.parse;
        return { serialize, parse };
    }, [serializer]);

    let isLoaded = useRef<boolean>(false);
    const [state, setState] = useState<T>(null as T);

    const eventHandler = useCallback(async (event: StorageEvent) => {
        if (event.key === key) {
            if (event.newValue !== null) {
                setState(await parse(event.newValue) as T);
            } else if (defaultValue !== undefined) {
                setState(await getDefaultValue(defaultValue as T));
            } else {
                setState(null as unknown as T);
            }
        }
    }, []);

    const getDefaultValue = useCallback(async (defaultValue: T | Promise<T>) => {
        let val: T;
        if (defaultValue !== undefined) {
            val = defaultValue instanceof Function ? await defaultValue() : defaultValue;
        } else {
            val = null as unknown as T;
        }
        localStorage.setItem(key, await serialize(val));
        return val
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            let val: T = null as unknown as T;
            if (!isLoaded.current) {
                const item = localStorage.getItem(key);
                try {
                    if (!resetStorage && item !== null) {
                        val = await parse(item) as T;
                    } else {
                        val = await getDefaultValue(defaultValue as T);
                    }
                } catch (error) {
                    if (resetIfError) {
                        localStorage.removeItem(key);
                        await getDefaultValue(defaultValue as T);
                    } else {
                        console.error(`Error parsing localStorage item [${key}]\n`, error);
                    }
                } finally {
                    isLoaded.current = true;
                }
            }

            if (!cancelled) setState(val);

            if (storageSync) {
                window.addEventListener('storage', eventHandler);
            } else {
                window.removeEventListener('storage', eventHandler);
            }
        })();

        return () => {
            window.removeEventListener('storage', eventHandler);
            cancelled = true;
        };
    }, [key, defaultValue, serializer, storageSync]);

    const setValue = useCallback(async (newValue: T | ((prevState: T) => T)) => {
        if (!isLoaded.current) await new Promise(resolve => setTimeout(resolve, 0));
        const valueToStore =
            newValue instanceof Function ? await newValue(state) : newValue;
        setState(valueToStore);
        localStorage.setItem(key, await serialize(valueToStore));
    }, [key, state]);

    const removeState = useCallback((useDefault: boolean = false) => {
        if (useDefault && defaultValue !== undefined) {
            getDefaultValue(defaultValue as T);
            return;
        }
        setState(null as unknown as T);
        localStorage.removeItem(key);
    }, [key, state]);

    return [state, setValue, removeState];
}

export default useAsyncLocalStorageState;