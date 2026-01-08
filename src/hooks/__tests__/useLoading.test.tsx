import React from 'react'
import { renderHook, act } from '@testing-library/react'
import useLoading from '../useLoading'
import { LoadingProvider } from '../../contexts/LoadingContext'

describe('useLoading', () => {
    it('throws outside provider', () => {
        expect(() => renderHook(() => useLoading())).toThrow()
    })

    it('local counter and asyncUseLoading', async () => {
        const wrapper = ({ children }: any) => <LoadingProvider>{children}</LoadingProvider>
        const { result } = renderHook(() => useLoading(), { wrapper })

        act(() => result.current.startLoading())
        expect(result.current.isLocalLoading).toBe(true)
        act(() => result.current.stopLoading())
        expect(result.current.isLocalLoading).toBe(false)

        await act(async () => {
            await result.current.asyncUseLoading(new Promise(res => setTimeout(res, 10)))
        })
        expect(result.current.isLocalLoading).toBe(false)
    })
})
