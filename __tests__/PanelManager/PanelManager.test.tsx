import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import PanelManager from '../../src/PanelManager'



describe('PanelManager', () => {
  it('renders a panel layout of one panel, full height and width', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 1 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: [] }
      }]
    }]
    render(<PanelManager onPanelDataChange={() => null} panelData={testPanelData} />)
  })
})