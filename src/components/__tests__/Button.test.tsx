import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Button from '../Button'

describe('Button', () => {
    it('renders children and responds to click', () => {
        const handle = vi.fn()
        render(<Button onClick={handle}>Hello</Button>)
        expect(screen.getByText('Hello')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Hello'))
        expect(handle).toHaveBeenCalled()
    })
})
