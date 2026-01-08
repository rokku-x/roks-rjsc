import { useContext } from "react";
import { BaseModalContext, BaseModalContextType, RenderMode } from "../contexts/ModalContext";

export default function useBaseModal(): BaseModalContextType {
    const context = useContext(BaseModalContext);
    if (!context) throw new Error('useBaseModal must be used within a BaseModalProvider');
    return context;
}

export { RenderMode };
