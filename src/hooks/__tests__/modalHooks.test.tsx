import React from 'react'
import { render, screen, act } from '@testing-library/react'
import BaseModalProvider from '../../contexts/ModalContext'
import useStaticModal from '../useStaticModal'
import useDynamicModal from '../useDynamicModal'

function StaticComponent() {
    const [show, close, id] = useStaticModal('static-test')
    return <button onClick={() => show(<div>STATIC_CONTENT</div>)} data-testid="open-static">open</button>
}

function DynamicComponent() {
    const [render, show, close, focus, id, isForeground] = useDynamicModal('dyn-test')
    return (
        <>
            <button onClick={() => show()} data-testid="open-dyn">open-dyn</button>
            {render(<div>DYNA_CONTENT</div>)}
        </>
    )
}

describe('modal hooks (static/dynamic)', () => {
    it('static modal shows provided content and can be closed', async () => {
        render(
            <BaseModalProvider>
                <StaticComponent />
            </BaseModalProvider>
        )
        const btn = screen.getByTestId('open-static')
        act(() => btn.click())
        expect(document.body.innerHTML).toMatch(/STATIC_CONTENT/)
    })

    it('dynamic modal renders into portal when shown', async () => {
        render(
            <BaseModalProvider>
                <DynamicComponent />
            </BaseModalProvider>
        )
        const btn = screen.getByTestId('open-dyn')
        act(() => btn.click())
        expect(document.body.innerHTML).toMatch(/DYNA_CONTENT/)
    })
})
