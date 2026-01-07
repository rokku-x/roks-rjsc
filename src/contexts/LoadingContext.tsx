import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import EventEmitter from '../utils/EventEmitter';

type LoadingEvents = {
    change: { isLoading: boolean } | null;
    start: null;
    stop: null;
};

export const loadingEventTarget = new EventEmitter<LoadingEvents>();

export const AnimationType = {
    Spin: 'spin',
    FadeInOut: 'fadeInOut',
    None: 'none',
} as const;

export type AnimationType = (typeof AnimationType)[keyof typeof AnimationType];

const LoadingAnimationWrapper: React.FC<{ animationType?: AnimationType, animationDuration?: number, children: React.ReactNode, style?: React.CSSProperties, className?: string, id?: string }> = ({ animationType = AnimationType.Spin, animationDuration, children, style, className, id }) => {
    const animationName = animationType;
    const defaultDuration = animationType === AnimationType.Spin ? 1 : animationType === AnimationType.FadeInOut ? 2 : 0;
    const duration = animationDuration || defaultDuration;
    const animationTiming = animationType === AnimationType.Spin ? 'linear' : animationType === AnimationType.FadeInOut ? 'ease-in-out' : 'linear';
    const animation = animationType === AnimationType.None ? 'none' : `${animationName} ${duration}s ${animationTiming} infinite`;
    return <div style={{ animation, ...style }} className={className} id={id} children={children} />
};

const LoadingCircle: React.FC = () => (
    <div id="loading-circle" style={{ width: '60px', height: '60px', border: '10px solid #f3f3f3', borderTop: '10px solid #009b4bff', borderRadius: '50%' }} />
);

const LoadingPleaseWait: React.FC = () => (
    <div style={{ padding: '20px', fontSize: '25px', color: '#333', fontFamily: 'system-ui, sans-serif' }} children={"Please wait..."} />
);

interface LoadingContextType {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
    loadingEventTarget: EventEmitter<LoadingEvents>;
    overrideLoading: (state: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{
    children: ReactNode;
    loadingComponent?: React.ComponentType | React.ReactElement;
    animationType?: AnimationType;
    animationDuration?: number;
    wrapperStyle?: React.CSSProperties;
    wrapperClassName?: string;
    wrapperId?: string;
    animationWrapperStyle?: React.CSSProperties;
    animationWrapperClassName?: string;
    animationWrapperId?: string;
}> = ({ children, loadingComponent, animationType = AnimationType.FadeInOut, animationDuration, wrapperStyle, wrapperClassName, wrapperId, animationWrapperStyle, animationWrapperClassName, animationWrapperId }) => {
    loadingComponent = loadingComponent ? loadingComponent : animationType === AnimationType.Spin ? LoadingCircle : LoadingPleaseWait;
    const [loadingCount, setLoadingCount] = useState(0);
    const [overrideState, setOverrideState] = useState<null | boolean>(null);
    const isLoading = overrideState ?? (loadingCount > 0);

    const overrideLoading = (state: boolean) => setOverrideState(state);
    const startLoading = () => setLoadingCount(prev => prev + 1);
    const stopLoading = () => setLoadingCount(prev => Math.max(0, prev - 1));

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        loadingEventTarget.emit('change', { isLoading });
        loadingEventTarget.emit(isLoading ? 'start' : 'stop', null);
        if (isLoading && dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
            document.body.setAttribute('inert', '');
        } else if (!isLoading && dialogRef.current && dialogRef.current.open) {
            dialogRef.current.close();
            document.body.removeAttribute('inert');
        }
        return () => {
            if (dialogRef.current && dialogRef.current.open) {
                setLoadingCount(0);
            }
            loadingEventTarget.removeAllListeners();
        };
    }, [isLoading]);

    const wrapperIdFinal = wrapperId || 'loading-dialog';

    return (
        <LoadingContext.Provider value={{ get isLoading() { return isLoading; }, startLoading, stopLoading, loadingEventTarget, overrideLoading }}>
            {children}
            {isLoading && <style>{`
                        dialog#${wrapperIdFinal}[open] {
                            display: flex !important;
                            justify-content: center;
                            align-items: center;
                            width: 100vw;
                            height: 100vh;
                            max-width: 100%;
                            max-height: 100%;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes fadeInOut {
                            0%, 100% { opacity: 0.2; }
                            50% { opacity: 1; }
                        }
                        body:has(dialog#${wrapperIdFinal}[open]) {
                            overflow: hidden;
                        }
                        body {
                            scrollbar-gutter: stable;
                        }
                    `}
            </style>}
            {isLoading && createPortal(
                <dialog
                    ref={dialogRef}
                    style={{
                        border: 'none',
                        padding: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(2px)',
                        ...wrapperStyle,
                    }}
                    className={wrapperClassName}
                    id={wrapperIdFinal}
                >
                    <LoadingAnimationWrapper animationType={animationType} animationDuration={animationDuration} style={animationWrapperStyle} className={animationWrapperClassName} id={animationWrapperId}>
                        {React.isValidElement(loadingComponent)
                            ? loadingComponent
                            : React.createElement(loadingComponent as React.ComponentType)}
                    </LoadingAnimationWrapper>
                </dialog>
                ,
                document.body
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
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

