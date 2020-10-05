import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import PanelManager from '../../src/PanelManager'
import Panel from '../../src/Panel'

describe('PanelManager', () => {
  it('renders null if no children passed', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 1 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: [] }
      }]
    }]
    const { container } = render(<PanelManager onPanelDataChange={() => null} panelData={testPanelData} />)
    expect(container.firstChild).toBeEmpty()
  })
  it('renders a panel layout of one panel', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 1 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: [] }
      }]
    }]
    const internallyCreatedAndPassedPanelProps = {
      w: 1,
      h: 1,
      x: 0,
      y: 0,
      onMouseMove: () => {},
      onMouseUp: () => {},
      onMouseDown: () => {},
      draggingNode: null
    }
    render(
      <PanelManager onPanelDataChange={() => null} panelData={testPanelData}>
        <Panel panelId='A' {...internallyCreatedAndPassedPanelProps} />
      </PanelManager>
    )
  })
})