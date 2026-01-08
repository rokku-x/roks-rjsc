import React from 'react'
import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import useAsyncLocalStorageState from '../useAsyncLocalStorageState'

function TestComp({ keyName, defaultValue }: { keyName: string, defaultValue?: any }) {
    const [state, setValue, remove] = useAsyncLocalStorageState<any>(keyName, { defaultValue })
    return (
        <div>
            <span data-testid="state">{String(state)}</span>
            <button onClick={() => setValue('xyz')}>set</button>
            <button onClick={() => remove()}>remove</button>
        </div>
    )
}

describe('useAsyncLocalStorageState', () => {
    const KEY = 'test-key'
    beforeEach(() => {
        localStorage.clear()
    })

    it('initializes with default and persists value', async () => {
        render(<TestComp keyName={KEY} defaultValue={'abc'} />)
        await waitFor(() => expect(screen.getByTestId('state').textContent).toBe('abc'))

        await act(async () => { screen.getByText('set').click() })
        await waitFor(() => expect(localStorage.getItem(KEY)).toBe(JSON.stringify('xyz')))
        expect(screen.getByTestId('state').textContent).toBe('xyz')
    })

    it('removeState clears storage', async () => {
        render(<TestComp keyName={KEY} defaultValue={'a'} />)
        await waitFor(() => expect(screen.getByTestId('state').textContent).toBe('a'))
        await act(async () => { screen.getByText('set').click() })
        await waitFor(() => expect(localStorage.getItem(KEY)).toBe(JSON.stringify('xyz')))
        act(() => screen.getByText('remove').click())
        await waitFor(() => expect(localStorage.getItem(KEY)).toBeNull())
        expect(screen.getByTestId('state').textContent).toBe('null')
    })
})
