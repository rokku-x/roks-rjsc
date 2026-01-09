import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import BaseModalProvider from './contexts/ModalContext'
import useDynamicModal, { RenderMode } from './hooks/useDynamicModal'
import useLoading from './hooks/useLoading'
import { AnimationType, LoadingProvider } from './loading'
import useStaticModal from './hooks/useStaticModal'

function App() {
    const { asyncUseLoading, loadingEventTarget, overrideLoading } = useLoading()
    const [renderModalElement2, pushModal2, popModal2, focusModal2, modalId2, isForeground2] = useDynamicModal();
    const handleLoad = async () => {
        console.log(await asyncUseLoading(new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("hello")
            }, 2000);
        })))
    }

    useEffect(() => {
        loadingEventTarget.addEventListener('change', (e: any) => {
            console.log('loading changed', e.detail.isLoading, e.detail.isOverrideState)
        });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>roks-rjsc Dev</h1>
            <div style={{ marginTop: '20px' }}>
                <h2>Static Modal Example:</h2>
                <StaticExample />
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2>Functions:</h2>
            </div>
            <div>
                <button onClick={() => pushModal2()}>Show Dynamic Modal</button>
            </div>
            <div style={{ marginTop: '20px' }}>

                <button onClick={handleLoad}>Start Loading (2s)</button>
                <button onClick={() => overrideLoading(true)}>Override Loading ON</button>
                <button onClick={() => overrideLoading(false)}>Override Loading OFF</button>
                <button onClick={() => overrideLoading(null)}>Override Loading NULL</button>
            </div>

            <div>
                {renderModalElement2(<div style={{ backgroundColor: 'white', padding: '20px', border: '2px solid black' }}>
                    <h3>Dynamic Modal {modalId2} isForeground: {isForeground2.toString()}</h3>
                    <input type="text" placeholder="Type something..." />
                    <br />
                    <button onClick={popModal2}>Close Modal</button>
                    <button onClick={focusModal2}>Focus Modal</button>
                    <StaticExample />
                </div>
                )}
            </div>
        </div>
    )
}

function StaticExample() {
    const [showStatic, closeStatic, staticId] = useStaticModal()
    return (
        <div>
            <button onClick={() => showStatic(<div style={{ padding: 20 }}>
                <h3>Static Modal</h3>
                <p>This is a static modal example</p>
                <button onClick={closeStatic}>Close</button>
            </div>)}>Open Static Modal</button>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LoadingProvider animationType={AnimationType.Spin} animationDuration={1} >
            <BaseModalProvider renderMode={RenderMode.CURRENT_HIDDEN_STACK}>
                <App />
            </BaseModalProvider>
        </LoadingProvider>
    </React.StrictMode>,
)