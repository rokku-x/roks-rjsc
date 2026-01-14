import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import useLoading, { loadingEventTarget } from './hooks/useLoading'
import { AnimationType, LoadingRenderer, Loading } from './loading'
import BaseModalRenderer from './components/BaseModalRenderer'
import useDynamicModalZustand from './hooks/useDynamicModal'
import useStaticModalZustand from './hooks/useStaticModal'

function App() {
    const { startLoading, stopLoading, overrideLoading, asyncUseLoading } = useLoading();
    const [renderModalElement2, pushModal2, popModal2, focusModal2, modalId2, isForeground2] = useDynamicModalZustand();
    const [loadingComponentTest, setLoadingComponentTest] = useState(false);

    const handleLoad = async () => {
        startLoading();
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject("hello")
                }, 2000);
            });
        } catch (error) {
            console.log(error);
        } finally {
            stopLoading();
        }
    }

    const handleAsyncLoad = async () => {
        try {
            const result = await asyncUseLoading(new Promise((resolve) => {
                setTimeout(() => {
                    resolve("Async loading completed!")
                }, 3000);
            }));
            console.log(result);
        } catch (error) {
            console.log(error);
        }
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
                <button onClick={() => pushModal2()}>Show Dynamic Modal Zustand</button>
            </div>
            <div style={{ marginTop: '20px' }}>

                <button onClick={handleLoad}>Start Loading (2s)</button>
                <button onClick={handleAsyncLoad}>Async Use Loading (3s)</button>
                <button onClick={() => overrideLoading(true)}>Override Loading ON</button>
                <button onClick={() => overrideLoading(false)}>Override Loading OFF</button>
                <button onClick={() => overrideLoading(null)}>Override Loading NULL</button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>Loading Component Test:</h2>
                <button onClick={() => {
                    setLoadingComponentTest(true);
                    setTimeout(() => setLoadingComponentTest(false), 2000);
                }}>Test Loading Component (2s)</button>
                <Loading isLoading={loadingComponentTest} />
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
    const [showStatic, closeStatic, staticId] = useStaticModalZustand()
    return (
        <div >
            <button onClick={() => showStatic(<div style={{ padding: 20, backgroundColor: "#fff" }}>
                <h3>Static Modal {staticId}</h3>
                <p>This is a static modal example</p>
                <StaticExample2 />
                <button onClick={closeStatic}>Close</button>
            </div>)}>Open Static Modal</button>
        </div>
    )
}

function StaticExample2() {
    const [showStatic, closeStatic, staticId] = useStaticModalZustand()
    return (
        <div>
            <button onClick={() => showStatic(<div style={{ padding: 20, backgroundColor: "#fff" }}>
                <h3>Static Modal {staticId}</h3>
                <p>This is a static modal 2 example</p>
                <StaticExample />
                <button onClick={closeStatic}>Close</button>
            </div>)}>Open Static Modal 2</button>
        </div >
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <App />
        <BaseModalRenderer />
        <LoadingRenderer animationType={AnimationType.Spin} animationDuration={1} />
    </>
)