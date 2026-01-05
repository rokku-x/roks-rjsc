import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const loadingEventTarget = new EventTarget();

export enum AnimationType {
    Spin = 'spin',
    FadeInOut = 'fadeInOut',
    None = 'none',
}

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
    loadingEventTarget: EventTarget;
    getCurrentZIndex: () => number
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
    const isLoading = loadingCount > 0;
    const getCurrentZIndex = () => 1000 + loadingCount;
    const startLoading = () => setLoadingCount(prev => prev + 1);
    const stopLoading = () => setLoadingCount(prev => Math.max(0, prev - 1));

    useEffect(() => {
        loadingEventTarget.dispatchEvent(new CustomEvent('change', { detail: { isLoading } }));
        loadingEventTarget.dispatchEvent(new CustomEvent(isLoading ? 'start' : 'stop'));
    }, [isLoading]);

    return (
        <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, loadingEventTarget, getCurrentZIndex }}>
            {children}
            {isLoading && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: getCurrentZIndex(),
                        userSelect: 'none',
                        pointerEvents: 'auto',
                        ...wrapperStyle
                    }}
                    className={wrapperClassName}
                    id={wrapperId}
                >
                    <LoadingAnimationWrapper animationType={animationType} animationDuration={animationDuration} style={animationWrapperStyle} className={animationWrapperClassName} id={animationWrapperId}>
                        {React.isValidElement(loadingComponent)
                            ? loadingComponent
                            : React.createElement(loadingComponent as React.ComponentType)}
                    </LoadingAnimationWrapper>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes fadeInOut {
                            0%, 100% { opacity: 0.2; }
                            50% { opacity: 1; }
                        }
                    `}</style>
                </div>
                , document.body)}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error('useLoading must be used within a LoadingProvider');

    const asyncUseLoading = async <R, _ extends any[]>(
        asyncFunction: Promise<R>
    ): Promise<R> => {
        context.startLoading();
        try {
            return await asyncFunction;
        } finally {
            context.stopLoading();
        }
    }


    return { ...context, asyncUseLoading };
};

