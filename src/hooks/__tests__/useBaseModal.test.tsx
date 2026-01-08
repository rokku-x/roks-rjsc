import React from 'react'
import { renderHook } from '@testing-library/react'
import useBaseModal from '../useBaseModal'
import BaseModalProvider from '../../contexts/ModalContext'

describe('useBaseModal', () => {
    it('throws when used outside provider', () => {
        expect(() => renderHook(() => useBaseModal())).toThrow()
    })

    it('works inside provider', () => {
        const wrapper = ({ children }: any) => <BaseModalProvider>{children}</BaseModalProvider>
        const { result } = renderHook(() => useBaseModal(), { wrapper })
        expect(typeof result.current.pushModal).toBe('function')
    })
})
