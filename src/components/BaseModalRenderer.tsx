'use client'

import { useCallback, useEffect, useId, useRef } from "react";
import useBaseModal, { RenderMode, useBaseModalInternal, } from "../hooks/useBaseModal";
import { createPortal } from "react-dom";

export default function BaseModalRenderer({ renderMode = RenderMode.STACKED, id, style }: { renderMode?: RenderMode, id?: string, style?: React.CSSProperties }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const modalWindowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const { setIsMounted, setModalWindowRefRef, setCurrentModalId, modalStackMap, currentModalId, store } = useBaseModalInternal();
    const modalStack = Array.from(modalStackMap.values())
    const modalStackIds = Array.from(modalStackMap.keys());
    const wrapperIdFinal = id || 'base-modal-wrapper';

    useEffect(() => {
        if (store.getState().isMounted) throw new Error("Multiple BaseModalRenderer detected. Only one BaseModalRenderer is allowed at a time.");
        setModalWindowRefRef(modalWindowRefs.current);
        setIsMounted(true);
        return () => {
            setIsMounted(false);
            setModalWindowRefRef(undefined);
        }
    }, []);

    useEffect(() => {
        const lastModalId = modalStackIds[modalStackIds.length - 1];
        if (lastModalId !== undefined) {
            dialogRef.current?.showModal();
            document.body.setAttribute('inert', '');
        } else if (lastModalId === undefined) {
            dialogRef.current?.close();
            document.body.removeAttribute('inert');
        }

    }, [currentModalId]);

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


    return modalStackIds.length === 0 ? null : createPortal(
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
                style={style}
            >
                {render()}
            </dialog>
        </>, document.body
    )
}