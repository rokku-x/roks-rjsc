import { useContext, useRef } from "react";
import { LoadingContext } from "../contexts/LoadingContext";

const useLoading = () => {
    const rawContext = useContext(LoadingContext);
    if (!rawContext) throw new Error('useLoading must be used within a LoadingProvider');
    const localCounter = useRef(0);

    const { startLoading, stopLoading, isLoading, ...context } = rawContext;

    const localStartLoading = () => {
        startLoading();
        localCounter.current += 1;
    }

    const localStopLoading = () => {
        if (localCounter.current > 0) {
            stopLoading();
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
        startLoading: localStartLoading, stopLoading: localStopLoading, get isLocalLoading() { return localCounter.current > 0; }, ...context, asyncUseLoading, isLoading
    };
};

export default useLoading;