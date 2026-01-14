import { useId } from "react";
import useBaseModal, { RenderMode } from "./useBaseModal";
export { RenderMode };

export default function useStaticModal(id: string = useId()) {
    const { pushModal, popModal } = useBaseModal();

    const showModal = (el: React.ReactNode) => {
        pushModal(id, el);
        return closeModal
    }
    const closeModal = () => {
        return popModal(id);
    }

    const updateModalContent = (newContent: React.ReactNode) => {
        pushModal(id, newContent);
    }

    return [showModal, closeModal, id, updateModalContent] as [typeof showModal, typeof closeModal, string, typeof updateModalContent];
}