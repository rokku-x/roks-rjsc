import React from 'react'
import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import useBaseModal from '../useBaseModal'

describe('useBaseModal', () => {
    it('can be used without provider', () => {
        expect(() => renderHook(() => useBaseModal())).not.toThrow()
    })

    it('has actions object with modal functions', () => {
        const { result } = renderHook(() => useBaseModal())
        expect(typeof result.current.pushModal).toBe('function')
        expect(typeof result.current.popModal).toBe('function')
        expect(typeof result.current.focusModal).toBe('function')
    })
})
