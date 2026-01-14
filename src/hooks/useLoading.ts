import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import EventEmitter from '../utils/EventEmitter';
import { useRef } from 'react';

type LoadingEvents = {
    change: { isLoading: boolean, isOverrideState: boolean } | null;
    start: null;
    stop: null;
};

export const loadingEventTarget = new EventEmitter<LoadingEvents>();

interface Store {
    loadingCount: number;
    overrideState: boolean | null;
    isLoading: () => boolean;
    actions: {
        startLoading: () => void;
        stopLoading: () => void;
        overrideLoading: (state: boolean | null) => void;
    }
}

const useLoadingStore = create<Store>()(devtools((set, get) => ({
    loadingCount: 0,
    overrideState: null,
    isLoading() {
        return get().overrideState ?? (get().loadingCount > 0);
    },
    actions: {
        startLoading: () => {
            const prevIsLoading = get().isLoading;
            set((state) => ({ loadingCount: state.loadingCount + 1 }));
            const newIsLoading = get().isLoading();
            if (newIsLoading && !prevIsLoading) {
                loadingEventTarget.emit('start', null);
            }
            loadingEventTarget.emit('change', { isLoading: newIsLoading, isOverrideState: get().overrideState !== null });
        },
        stopLoading: () => {
            const prevIsLoading = get().isLoading();
            set((state) => ({ loadingCount: Math.max(0, state.loadingCount - 1) }));
            const newIsLoading = get().isLoading();
            if (!newIsLoading && prevIsLoading) {
                loadingEventTarget.emit('stop', null);
            }
            loadingEventTarget.emit('change', { isLoading: newIsLoading, isOverrideState: get().overrideState !== null });
        },
        overrideLoading: (state: boolean | null) => {
            const prevIsLoading = get().isLoading();
            set({ overrideState: state });
            const newIsLoading = get().isLoading();
            if (newIsLoading && !prevIsLoading) {
                loadingEventTarget.emit('start', null);
            } else if (!newIsLoading && prevIsLoading) {
                loadingEventTarget.emit('stop', null);
            }
            loadingEventTarget.emit('change', { isLoading: newIsLoading, isOverrideState: state !== null });
        },
    }
})));

export default function useLoading() {
    const { actions, isLoading } = useLoadingStore((state) => state);
    const localCounter = useRef(0);

    const localStartLoading = () => {
        actions.startLoading();
        localCounter.current += 1;
    }

    const localStopLoading = () => {
        if (localCounter.current > 0) {
            actions.stopLoading();
            localCounter.current -= 1;
        }
    }

    const asyncUseLoading = async <R, _ extends any[]>(
        asyncFunction: Promise<R>
    ): Promise<R> => {
        localStartLoading();
        try {
            return await asyncFunction;
        } finally {
            localStopLoading();
        }
    }

    return {
        overrideLoading: actions.overrideLoading, startLoading: localStartLoading, stopLoading: localStopLoading, get isLocalLoading() { return localCounter.current > 0; }, asyncUseLoading, get isLoading() { return isLoading(); }
    };
};