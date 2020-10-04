import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { maximizePanel } from '../../../src/PanelManager/PanelGraph/maximizePanel'



describe('maximizePanel', () => {
  it('returns the expected PanelGraph array data structure', () => {
    const testPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 1 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: [] }
      }]
    }]
    expect(maximizePanel('A')).toEqual(testPanelData)
  })
  it('throws if panelNodeId is null', () => {
      expect(() => maximizePanel('')).toThrow('panelNodeId is required')
  })
})