import React from 'react'
import ReactDOM from 'react-dom/client'
import { LoadingProvider, Button, AnimationType } from './index'
import BaseModalProvider from './contexts/ModalContext'
import useDynamicModal, { RenderMode } from './hooks/useDynamicModal'
import useLoading from './hooks/useLoading'

function App() {
    const { asyncUseLoading, loadingEventTarget, overrideLoading } = useLoading()
    const [renderModalElement2, pushModal2, popModal2, focusModal2, modalId2, isForeground2] = useDynamicModal();
    const handleLoad = async () => {
        loadingEventTarget.addEventListener('change', (e: any) => {
            console.log('loading changed', e.detail.isLoading)
        });

        console.log(await asyncUseLoading(new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("hello")
            }, 1000);
        })))
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>roks-rjsc Dev</h1>
            <Button onClick={handleLoad}>Start Loading</Button>
            <div style={{ marginTop: '20px' }}>
                <h2>Components:</h2>
                <Button>Default Button</Button>

            </div>
            <div>
                <Button onClick={() => pushModal2()}>Show Dynamic Modal</Button>
            </div>
            <div>
                {renderModalElement2(<div style={{ backgroundColor: 'white', padding: '20px', border: '2px solid black' }}>
                    <h3>Dynamic Modal {modalId2} isForeground: {isForeground2.toString()}</h3>
                    <input type="text" placeholder="Type something..." />
                    <br />
                    <button onClick={popModal2}>Close Modal</button>
                    <button onClick={focusModal2}>Focus Modal</button>
                </div>
                )}
            </div>
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