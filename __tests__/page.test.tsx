import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '../app/page'

describe('Home Page', () => {
  it('renders without crashing', () => {
    const { container } = render(<Home />)
    expect(container.firstChild).toBeTruthy()
  })

  it('displays welcome message and navigation options', () => {
    const { container } = render(<Home />)
    const content = container.textContent || ''
    
    expect(content).toContain('Get started by editing')
    expect(content).toContain('Save and see your changes instantly.')
    expect(content).toContain('Deploy now')
    expect(content).toContain('Read our docs')
  })
})