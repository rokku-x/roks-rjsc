import { createContext, useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const BaseModalContext = createContext<BaseModalContextType | undefined>(undefined);

const RenderMode = {
    All: 'all',
    CurrentOnly: 'currentOnly',
    CurrentOnlyOthersHidden: 'currentOnlyOthersHidden',
}

type RenderMode = (typeof RenderMode)[keyof typeof RenderMode];

interface BaseModalContextType {
    modalCount: number;
    renderMode?: RenderMode;
    pushModal: (el: React.ReactNode) => string;
    popModal: (idEl: string | React.ReactNode) => void;
}

export default function BaseModalProvider({ children, wrapperId, renderMode = RenderMode.All, wrapperStyle }: { children: React.ReactNode, wrapperId?: string, renderMode?: RenderMode, wrapperStyle?: React.CSSProperties }) {

    const dialogRef = useRef<HTMLDialogElement>(null);

    const modalStackMap = useRef<Map<string, React.ReactNode>>(new Map());
    const modalStack = useRef<React.ReactNode[]>([]);
    const [counter, setCounter] = useState(0);
    let willRender = counter > 0;

    const pushModal = (el: React.ReactNode) => {
        const modalId = Math.random().toString(36).substring(2, 9);
        modalStack.current.push(el);
        modalStackMap.current.set(modalId, el);
        setCounter(prev => prev + 1);
        return modalId;
    }

    const popModal = (idEl: string | React.ReactNode) => {
        let id = '';
        if (typeof idEl !== 'string') {
            for (let [key, value] of modalStackMap.current.entries()) {
                if (value === idEl) {
                    id = key;
                    break;
                }
            }
        } else if (typeof idEl === 'string') {
            id = idEl;
        }
        if (modalStackMap.current.has(id)) {
            modalStack.current = modalStack.current.filter(modal => modal !== modalStackMap.current.get(id));
            modalStackMap.current.delete(id);
            setCounter(prev => Math.max(0, prev - 1));
        }
    }

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (willRender && !dialog.open) {
            dialog.showModal();
            document.body.setAttribute('inert', '');
        } else if (!willRender && dialog.open) {
            dialog.close();
            document.body.removeAttribute('inert');
        }
    }, [willRender]);

    const wrapperIdFinal = wrapperId || 'base-modal-wrapper';


    const render = () => {
        switch (renderMode) {
            case RenderMode.All:
                return modalStack.current.map((modal, index) => (
                    <div key={index}>
                        {modal}
                    </div>
                ));
            case RenderMode.CurrentOnly:
                return modalStack.current.length > 0 ? modalStack.current[modalStack.current.length - 1] : null;
            case RenderMode.CurrentOnlyOthersHidden:
                return modalStack.current.length > 0 ? (
                    <div style={{ position: 'relative' }}>
                        {modalStack.current.map((modal, index) => (
                            <div
                                key={index}
                                style={{
                                    display: index === modalStack.current.length - 1 ? 'block' : 'none',
                                    position: index === modalStack.current.length - 1 ? 'relative' : 'absolute',
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                {modal}
                            </div>
                        ))}
                    </div>
                ) : null;
        }
    }
    return (
        <BaseModalContext.Provider value={{ modalCount: 0, get renderMode() { return renderMode }, pushModal, popModal }}>
            {children}
            {willRender && <style>{`
                        dialog[open] {
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
                    `}
            </style>}
            {willRender && createPortal(
                <dialog
                    ref={dialogRef}
                    id={wrapperIdFinal}
                    style={{
                        border: 'none',
                        padding: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(2px)',
                        ...wrapperStyle,
                    }}

                >
                    {render()}
                </dialog>,
                document.body
            )
            }
        </BaseModalContext.Provider>
    )
}

function useBaseModal(id = 'r'): BaseModalContextType {
    const context = useContext(BaseModalContext);
    if (!context) {
        throw new Error('useBaseModal must be used within a BaseModalProvider');
    }
    return context;
}

export function usePinModal() {
    const context = useBaseModal();

    let modalId: string;

    const closePin = () => {
        alert(modalId);
        context.popModal(modalId);
    }

    const el = <div>Pin Modal <button onClick={closePin}>Click me</button></div>

    const requestPin = () => {
        modalId = context.pushModal(el);
        alert(modalId);
    }

    return { requestPin }
}

//create ng component gamit ito then i call programmatically;
//convert to map yung stack para maka create ng id para ma call if need close