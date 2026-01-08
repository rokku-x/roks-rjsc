import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { LoadingProvider } from '../LoadingContext'
import useLoading from '../../hooks/useLoading'

function TestComponent() {
    const { startLoading, stopLoading, asyncUseLoading } = useLoading()
    return (
        <div>
            <button onClick={startLoading}>start</button>
            <button onClick={stopLoading}>stop</button>
            <button onClick={() => asyncUseLoading(new Promise(res => setTimeout(res, 10)))}>async</button>
        </div>
    )
}

describe('LoadingProvider + useLoading', () => {
    it('shows loading portal when loading', async () => {
        render(
            <LoadingProvider>
                <TestComponent />
            </LoadingProvider>
        )
        const start = screen.getByText('start')
        act(() => start.click())
        // Loading portal should be created (dialog present)
        expect(document.querySelector('dialog')).toBeInTheDocument()

        const stop = screen.getByText('stop')
        act(() => stop.click())
        // dialog should be removed
        expect(document.querySelector('dialog')).not.toBeInTheDocument()
    })
})
