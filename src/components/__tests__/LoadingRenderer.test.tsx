import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'

let LoadingRenderer: typeof import('../LoadingRenderer').default;
let useLoading: typeof import('../../hooks/useLoading').default;

function TestComponent() {
    const { startLoading, stopLoading } = useLoading();
    return (
        <div>
            <button onClick={startLoading}>start</button>
            <button onClick={stopLoading}>stop</button>
        </div>
    )
}

describe('LoadingRenderer + useLoading', () => {
    beforeEach(async () => {
        vi.resetModules();
        ({ default: useLoading } = await import('../../hooks/useLoading'));
        ({ default: LoadingRenderer } = await import('../LoadingRenderer'));
        (HTMLDialogElement.prototype as any).showModal = vi.fn();
        (HTMLDialogElement.prototype as any).close = vi.fn();
        document.body.innerHTML = '';
    });

    it('shows loading portal when loading', async () => {
        render(
            <>
                <LoadingRenderer />
                <TestComponent />
            </>
        )
        const start = screen.getByText('start')
        act(() => start.click())
        expect(document.querySelector('dialog')).toBeInTheDocument()

        const stop = screen.getByText('stop')
        act(() => stop.click())
        expect(document.querySelector('dialog')).not.toBeInTheDocument()
    })
})
