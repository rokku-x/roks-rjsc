import { useContext, useRef } from "react";
import { BaseModalContext, RenderMode } from "../contexts/ModalContext";

export { RenderMode };

export default function useStaticModal(id: string = Math.random().toString(36).substring(2, 6)) {
    const rawContext = useContext(BaseModalContext);
    if (!rawContext) throw new Error('useBaseModal must be used within a BaseModalProvider');
    let modalIdRef = useRef<string>(id)

    const showModal = (el: React.ReactNode) => {
        rawContext.pushModal(el, modalIdRef.current);
        return closeModal
    }
    const closeModal = () => {
        return rawContext.popModal(modalIdRef.current);
    }

    const updateModalContent = (newContent: React.ReactNode) => {
        rawContext.updateModalContent(modalIdRef.current, newContent);
    }
    return [showModal, closeModal, modalIdRef.current, rawContext.currentModalId === modalIdRef.current, updateModalContent] as [typeof showModal, typeof closeModal, string, boolean, typeof updateModalContent];
}