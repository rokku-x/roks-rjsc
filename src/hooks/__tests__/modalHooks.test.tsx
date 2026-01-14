import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import BaseModalRenderer from '../../components/BaseModalRenderer'
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
    beforeEach(async () => {
        vi.resetModules();
        (HTMLDialogElement.prototype as any).showModal = vi.fn();
        (HTMLDialogElement.prototype as any).close = vi.fn();
        document.body.innerHTML = '';
    });

    it('static modal shows provided content and can be closed', async () => {
        render(
            <>
                <BaseModalRenderer />
                <StaticComponent />
            </>
        )
        const btn = screen.getByTestId('open-static')
        act(() => btn.click())
        expect(document.body.innerHTML).toMatch(/STATIC_CONTENT/)
    })

    it('dynamic modal renders into portal when shown', async () => {
        render(
            <>
                <BaseModalRenderer />
                <DynamicComponent />
            </>
        )
        const btn = screen.getByTestId('open-dyn')
        act(() => btn.click())
        expect(document.body.innerHTML).toMatch(/DYNA_CONTENT/)
    })
})
