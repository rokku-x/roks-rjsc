import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'

let useLoading: typeof import('../useLoading').default;

describe('useLoading (zustand store)', () => {
    beforeEach(async () => {
        vi.resetModules();
        ({ default: useLoading } = await import('../useLoading'));
    });

    it('can be used without provider', () => {
        expect(() => renderHook(() => useLoading())).not.toThrow()
    })

    it('loading actions work', () => {
        const { result } = renderHook(() => useLoading())

        expect(result.current.isLoading).toBe(false)

        act(() => result.current.startLoading())
        expect(result.current.isLoading).toBe(true)

        act(() => result.current.stopLoading())
        expect(result.current.isLoading).toBe(false)
    })

    it('override loading works', () => {
        const { result } = renderHook(() => useLoading())

        act(() => result.current.overrideLoading(true))
        expect(result.current.isLoading).toBe(true)

        act(() => result.current.overrideLoading(false))
        expect(result.current.isLoading).toBe(false)

        act(() => result.current.overrideLoading(null))
        expect(result.current.isLoading).toBe(false)
    })
})
