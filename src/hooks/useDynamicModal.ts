import { useContext, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { BaseModalContext, RenderMode } from "../contexts/ModalContext";

export default function useDynamicModal(id: string = Math.random().toString(36).substring(2, 6)) {
    const rawContext = useContext(BaseModalContext);
    if (!rawContext) throw new Error('useBaseModal must be used within a BaseModalProvider');
    let modalIdRef = useRef<string>(id);
    const isForeground = rawContext.currentModalId === modalIdRef.current;
    const renderModalElement = (el: JSX.Element): ReactNode => {
        if (!rawContext.getModalWindowRef(modalIdRef.current)) return null;
        return createPortal(
            el,
            rawContext.getModalWindowRef(modalIdRef.current)!
        );
    }

    const showModal = () => {
        rawContext.pushModal(null, modalIdRef.current, true)[1];
    }

    const closeModal = () => {
        rawContext.popModal(modalIdRef.current);
    }

    const focusModal = () => {
        rawContext.focusModal(modalIdRef.current);
    }

    return [renderModalElement, showModal, closeModal, focusModal, modalIdRef.current, isForeground] as [typeof renderModalElement, typeof showModal, typeof closeModal, typeof focusModal, string, boolean];
}
export { RenderMode };
