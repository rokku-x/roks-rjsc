import React from 'react'
import { render, screen, act } from '@testing-library/react'
import BaseModalProvider from '../ModalContext'
import useStaticModal from '../../hooks/useStaticModal'
import useDynamicModal from '../../hooks/useDynamicModal'

function StaticTester() {
  const [show, close] = useStaticModal('static1')
  return <button onClick={() => show(<div>STATIC</div>)}>open-static</button>
}

function DynamicTester() {
  const [render, show, close] = useDynamicModal('dyn1')
  return (
    <>
      <button onClick={() => show()}>open-dyn</button>
      {render(<div>DYNDIV</div>)}
    </>
  )
}

describe('BaseModalProvider and hooks', () => {
  it('pushes and pops modals and renders content', () => {
    render(
      <BaseModalProvider>
        <StaticTester />
        <DynamicTester />
      </BaseModalProvider>
    )
    const s = screen.getByText('open-static')
    act(() => s.click())
    expect(document.querySelector('.modal-window')).toBeInTheDocument()
    expect(document.body.innerHTML).toMatch(/STATIC/)

    const d = screen.getByText('open-dyn')
    act(() => d.click())
    expect(document.body.innerHTML).toMatch(/DYNDIV/)
  })
})
