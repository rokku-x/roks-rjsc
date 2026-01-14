import { useRef, ReactNode, useId, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import useBaseModal, { RenderMode, useBaseModalInternal } from "./useBaseModal";

export default function useDynamicModal(id: string = useId()) {
    const { pushModal, popModal, focusModal, getModalWindowRef, currentModalId } = useBaseModal();
    const [, setRerender] = useState(0);
    const isForeground = currentModalId === id;

    useEffect(() => {
        setRerender((r) => r + 1);
    }, [currentModalId]);

    const renderModalElement = (el: JSX.Element): ReactNode => {
        const modalWindowRef = getModalWindowRef(id);
        if (!modalWindowRef) return null;
        return createPortal(
            el,
            modalWindowRef
        );
    }

    const showModal = () => {
        pushModal(id, null, true);
    }

    const closeModal = () => {
        popModal(id);
    }

    const focus = () => {
        focusModal(id);
    }

    return [renderModalElement, showModal, closeModal, focus, id, isForeground] as [typeof renderModalElement, typeof showModal, typeof closeModal, typeof focus, string, boolean];
}
export { RenderMode };
