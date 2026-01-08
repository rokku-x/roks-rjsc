import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from "react";
import { createPortal } from "react-dom";

export const BaseModalContext = createContext<BaseModalContextType | undefined>(undefined);

export const RenderMode = {
    STACKED: 0,
    CURRENT_ONLY: 1,
    CURRENT_HIDDEN_STACK: 2,
}

export type RenderMode = (typeof RenderMode)[keyof typeof RenderMode];

export interface BaseModalContextType {
    modalCount: number;
    renderMode?: RenderMode;
    currentModalId?: string;
    pushModal: (el: React.ReactNode, modalId?: string, isDynamic?: boolean) => string;
    popModal: (idEl: string | React.ReactNode) => boolean;
    updateModalContent: (modalId: string, newContent: React.ReactNode) => void;
    getModalWindowRef: (modalId: string) => HTMLDivElement | undefined;
    focusModal: (modalId: string) => boolean;
    getModalOrderIndex: (modalId: string) => number;
}

export default function BaseModalProvider({ children, wrapperId, renderMode = RenderMode.STACKED, wrapperStyle }: { children: React.ReactNode, wrapperId?: string, renderMode?: RenderMode, wrapperStyle?: React.CSSProperties }) {

    const dialogRef = useRef<HTMLDialogElement>(null);
    const modalStackMapRef = useRef<Map<string, [React.ReactNode | null, boolean]>>(new Map());
    const [modalStackMap, setModalStackMap] = useState<Map<string, [React.ReactNode | null, boolean]>>(modalStackMapRef.current);
    const modalStack = Array.from(modalStackMap.values())
    const modalStackIds = Array.from(modalStackMap.keys());
    const modalWindowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [currentModalId, setCurrentModalId] = useState<string | undefined>(undefined);

    const pushModal = (el: React.ReactNode, modalId: string = Math.random().toString(36).substring(2, 6), isDynamic: boolean = false) => {
        const index = modalStackIds.indexOf(modalId);
        if (index !== -1) {
            console.warn(`Modal with id ${modalId} already exists. Choose a different id.`);
            return modalId;
        }
        let item: [React.ReactNode, boolean] = [el, isDynamic];
        modalStackMapRef.current = new Map(modalStackMapRef.current);
        modalStackMapRef.current.set(modalId, item);
        setModalStackMap(new Map(modalStackMapRef.current));
        return modalId
    }

    const popModal = (idEl: string | React.ReactNode) => {
        let id = '';
        if (typeof idEl !== 'string') {
            for (let [key, value] of modalStackMapRef.current.entries()) {
                if (value[0] === idEl) {
                    id = key;
                    break;
                }
            }
        } else if (typeof idEl === 'string') {
            id = idEl;
        }
        if (!modalStackMapRef.current.has(id)) return false;
        modalStackMapRef.current = new Map(modalStackMapRef.current);
        modalStackMapRef.current.delete(id);
        setModalStackMap(new Map(modalStackMapRef.current));
        return true
    }

    const updateModalContent = (modalId: string, newContent: React.ReactNode) => {
        if (modalStackMapRef.current.has(modalId)) {
            let item = modalStackMapRef.current.get(modalId)!;
            //throw error if not dynamic
            if (item[1] === false) {
                console.warn(`Modal with id ${modalId} is dynamic. Cannot update content.`);
                return;
            }
            item[0] = newContent;
            modalStackMapRef.current.set(modalId, item);
            setModalStackMap(new Map(modalStackMapRef.current));
        }
    }

    const focusModal = (modalId: string) => {
        if (!modalStackMap.has(modalId)) return false;
        let item = modalStackMapRef.current.get(modalId)!;
        modalStackMapRef.current.delete(modalId);
        modalStackMapRef.current.set(modalId, item);
        setModalStackMap(new Map(modalStackMapRef.current));
        return true
    }

    const getModalOrderIndex = (modalId: string) => {
        return modalStackIds.indexOf(modalId);
    }

    const getModalWindowRef = (modalId: string) => {
        return modalWindowRefs.current.get(modalId);
    }

    useEffect(() => {
        const lastModalId = modalStackIds[modalStackIds.length - 1];
        if (lastModalId !== undefined) {
            dialogRef.current?.showModal();
            document.body.setAttribute('inert', '');
        } else if (lastModalId === undefined) {
            dialogRef.current?.close();
            document.body.removeAttribute('inert');
        }
        setCurrentModalId(lastModalId);
    }, [modalStackMap]);

    const wrapperIdFinal = wrapperId || 'base-modal-wrapper';

    const refCallback = useCallback((node: HTMLDivElement | null, modalId: string) => {
        if (node) {
            modalWindowRefs.current.set(modalId, node);
        } else {
            modalWindowRefs.current.delete(modalId);
        }
    }, []);

    const render = () => {
        switch (renderMode) {
            case RenderMode.STACKED:
                return modalStack.map(([modal, isDynamic], index) => (
                    <div
                        key={modalStackIds[index]}
                        ref={node => refCallback(node, modalStackIds[index])}
                        className="modal-window"
                        id={modalStackIds[index]}
                        style={{ display: 'block', zIndex: modalStackIds[index] === currentModalId ? 1000 : 100 }}
                        {...(currentModalId! !== modalStackIds[index] ? { inert: "" } as any : {})}
                    >
                        {!isDynamic ? modal : null}
                    </div>
                ));
            case RenderMode.CURRENT_ONLY:
                return modalStack.length > 0 ?
                    <div
                        id={modalStackIds[modalStack.length - 1]}
                        ref={node => refCallback(node, modalStackIds[modalStack.length - 1])}
                        key={modalStackIds[modalStack.length - 1]}
                        className="modal-window"
                        style={{ display: 'block' }} >
                        {!modalStack[modalStack.length - 1][1] ? modalStack[modalStack.length - 1][0] : null}
                    </div>
                    : null;
            case RenderMode.CURRENT_HIDDEN_STACK:
                return modalStack.length > 0 ? (
                    modalStack.map(([modal, isDynamic], index) => (
                        <div
                            ref={node => refCallback(node, modalStackIds[index])}
                            id={modalStackIds[index]}
                            className="modal-window"
                            key={modalStackIds[index]}
                            style={{
                                display: currentModalId! === modalStackIds[index] ? 'block' : 'none',
                            }}
                            {...(currentModalId! !== modalStackIds[index] ? { inert: "" } as any : {})}
                        >
                            {!isDynamic ? modal : null}
                        </div>
                    ))
                ) : null;
        }
    }

    return (
        <BaseModalContext.Provider value={{ modalCount: 0, get renderMode() { return renderMode }, pushModal, popModal, currentModalId, updateModalContent, getModalWindowRef, focusModal, getModalOrderIndex }}>
            {children}
            {modalStackIds.length === 0 ? null : createPortal(
                <>
                    <style>{`
                        dialog#${wrapperIdFinal}[open] {
                            display: flex !important;
                            justify-content: center;
                            align-items: center;
                            width: 100vw;
                            height: 100vh;
                            max-width: 100%;
                            max-height: 100%;
                        }
                        body:has(dialog#${wrapperIdFinal}[open]) {
                            overflow: hidden;
                        }
                        body {
                            scrollbar-gutter: stable;
                        }
                        .modal-wrapper{
                            border: none;
                            padding: 0;
                            background: unset;
                        }
                        .modal-window {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            display: none;
                            background-color: rgba(0, 0, 0, 0.1);
                            backdrop-filter: blur(2px);
                        }
                    `}
                    </style>
                    <dialog
                        className="modal-wrapper"
                        ref={dialogRef}
                        id={wrapperIdFinal}
                        style={wrapperStyle}
                    >
                        {render()}
                    </dialog>
                </>, document.body
            )}
        </BaseModalContext.Provider>
    )
}




//create ng component gamit ito then i call programmatically;
//convert to map yung stack para maka create ng id para ma call if need close