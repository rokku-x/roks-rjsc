import React from 'react'
import ReactDOM from 'react-dom/client'
import { LoadingProvider, useLoading, Button, AnimationType } from './index'
import BaseModalProvider, { usePinModal } from './components/BaseModal'

function App() {
    const { asyncUseLoading, loadingEventTarget, overrideLoading } = useLoading()
    const { requestPin } = usePinModal();
    const handleLoad = async () => {
        loadingEventTarget.addEventListener('change', (e: any) => {
            console.log('loading changed', e.detail.isLoading)
        });

        console.log(await asyncUseLoading(new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("hello")
            }, 6000);
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
                <Button onClick={() => requestPin()}>Show Pinned Modal</Button>
            </div>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LoadingProvider animationType={AnimationType.Spin} animationDuration={1} >
            <BaseModalProvider>
                <App />
            </BaseModalProvider>
        </LoadingProvider>
    </React.StrictMode>,
)