import { create } from 'zustand'

export const RenderMode = {
    STACKED: 0,
    CURRENT_ONLY: 1,
    CURRENT_HIDDEN_STACK: 2,
}

export type RenderMode = (typeof RenderMode)[keyof typeof RenderMode];

type ModalStackMapType = Map<string, [React.ReactNode | null, boolean]>;

interface Store {
    isMounted: boolean;
    renderMode: RenderMode;
    modalStackMap: ModalStackMapType,
    modalWindowRefs?: Map<string, HTMLDivElement>
    currentModalId?: string;
    actions: {
        getModalWindowRef: (modalId: string) => HTMLDivElement | undefined;
        pushModal: (modalId: string, el: React.ReactNode, isDynamic?: boolean) => string;
        popModal: (modalId: string) => boolean;
        getModal: (modalId: string) => [React.ReactNode | null, boolean] | undefined;
        updateModal: (modalId: string, newContent: React.ReactNode) => boolean;
        focusModal: (modalId: string) => boolean;
        getModalOrderIndex: (modalId: string) => number;
    }
    internalActions: {
        setIsMounted: (mounted: boolean) => void;
        setRenderMode: (mode: RenderMode) => void;
        setModalWindowRefRef: (map?: Map<string, HTMLDivElement>) => void;
        setCurrentModalId: (modalId: string | undefined) => void;
    }
}

const useBaseModalStore = create<Store>()((set, get) => ({
    modalStackMap: new Map(),
    isMounted: false,
    rendererId: undefined,
    renderMode: RenderMode.STACKED,
    modalWindowRefs: undefined,
    currentModalId: undefined,
    internalActions: {
        setModalWindowRefRef: (map?: Map<string, HTMLDivElement>) => set((state) => {
            return { modalWindowRefs: map };
        }),
        setCurrentModalId: (modalId: string | undefined) => set({ currentModalId: modalId }),
        setIsMounted: (mounted: boolean) => set({ isMounted: mounted }),
        setRenderMode: (mode: RenderMode) => set({ renderMode: mode }),
    },
    actions: {
        pushModal: (modalId: string = Math.random().toString(36).substring(2, 6), el: React.ReactNode, isDynamic: boolean = false) => {
            const modal = get().modalStackMap.get(modalId);
            if (modal !== undefined) {
                get().actions.focusModal(modalId);
                return modalId;
            }
            set((state) => {
                let item: [React.ReactNode, boolean] = [el, isDynamic];
                const newMap = new Map(state.modalStackMap);
                newMap.set(modalId, item);
                return { modalStackMap: newMap, currentModalId: modalId };
            });
            return modalId
        },
        popModal: (modalId: string) => {
            const modal = get().modalStackMap.get(modalId);
            if (!modal) return false;
            set((state) => {
                const newMap = new Map(state.modalStackMap);
                newMap.delete(modalId);
                const lastModalId = Array.from(newMap.keys())[newMap.size - 1];
                return { modalStackMap: newMap, currentModalId: lastModalId };
            });
            return true
        },
        getModal: (modalId: string) => {
            return get().modalStackMap.get(modalId);
        },
        updateModal: (modalId: string, newContent: React.ReactNode) => {
            const modal = get().modalStackMap.get(modalId);
            if (!modal) return false;
            set((state) => {
                const newMap = new Map(state.modalStackMap);
                //throw error if not dynamic
                if (modal[1] === false) {
                    console.warn(`Modal with id ${modalId} is not dynamic. Cannot update content.`);
                    return { modalStackMap: state.modalStackMap };
                }
                modal[0] = newContent;
                newMap.set(modalId, modal);
                return { modalStackMap: newMap };
            })
            return true
        },
        focusModal: (modalId: string) => {
            const item = get().modalStackMap.get(modalId);
            if (!item) return false;
            set((state) => {
                const newMap = new Map(state.modalStackMap);
                newMap.delete(modalId);
                newMap.set(modalId, item);
                return { modalStackMap: newMap, currentModalId: modalId };
            })
            return true;
        },
        getModalOrderIndex: (modalId: string) => {
            const keys = Array.from(get().modalStackMap.keys());
            return keys.indexOf(modalId);
        },
        getModalWindowRef: (modalId: string) => {
            return get().modalWindowRefs?.get(modalId);
        }
    }
}));

export default function useBaseModal() {
    const { actions, currentModalId, renderMode } = useBaseModalStore((state) => state)
    return { ...actions, currentModalId, renderMode };
}

export function useBaseModalInternal() {
    const { internalActions, isMounted, modalStackMap, modalWindowRefs, currentModalId, renderMode } = useBaseModalStore((state) => state)
    return { ...internalActions, isMounted, modalStackMap, modalWindowRefs, currentModalId, renderMode, store: useBaseModalStore };
}