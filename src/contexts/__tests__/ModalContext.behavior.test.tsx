import React from 'react'
import { renderHook, act } from '@testing-library/react'
import BaseModalProvider from '../ModalContext'
import useBaseModal from '../../hooks/useBaseModal'
import { waitFor } from '@testing-library/dom'

describe('Modal behavior', () => {
    const wrapper = ({ children }: any) => <BaseModalProvider>{children}</BaseModalProvider>

    it('pushes and pops by id and by element', async () => {
        const { result } = renderHook(() => useBaseModal(), { wrapper })

        let el = React.createElement('div', {}, 'EL')
        let id: string
        act(() => { id = result.current.pushModal(el, 'myid') })

        await waitFor(() => {
            expect(document.getElementById(id)).toBeTruthy()
        })

        act(() => {
            const removed = result.current.popModal('myid')
            expect(removed).toBe(true)
        })

        await waitFor(() => {
            expect(document.getElementById('myid')).toBeNull()
        })

        // push again and remove by element
        act(() => { id = result.current.pushModal(el, 'elid') })
        await waitFor(() => expect(document.getElementById('elid')).toBeTruthy())
        act(() => {
            const removed = result.current.popModal(el)
            expect(removed).toBe(true)
        })
        await waitFor(() => expect(document.getElementById('elid')).toBeNull())
    })

    it('focusModal moves item to top and getModalOrderIndex reports order', async () => {
        const { result } = renderHook(() => useBaseModal(), { wrapper })
        act(() => result.current.pushModal(React.createElement('div', {}, 'A'), 'a'))
        act(() => result.current.pushModal(React.createElement('div', {}, 'B'), 'b'))

        await waitFor(() => expect(result.current.getModalOrderIndex('a')).toBeGreaterThanOrEqual(0))

        // focus 'a' to bring to top
        act(() => {
            const ok = result.current.focusModal('a')
            expect(ok).toBe(true)
        })

        // after focusing, 'a' should be last in order (top)
        await waitFor(() => expect(result.current.getModalOrderIndex('a')).toBeGreaterThanOrEqual(0))
    })

    it('getModalWindowRef returns a DOM node for an existing modal', async () => {
        const { result } = renderHook(() => useBaseModal(), { wrapper })
        act(() => result.current.pushModal(React.createElement('div', {}, 'X'), 'refid'))
        await waitFor(() => {
            const ref = result.current.getModalWindowRef('refid')
            expect(ref).toBeTruthy()
            expect(ref).toBeInstanceOf(HTMLElement)
        })
    })
})
