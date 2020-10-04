import '@testing-library/jest-dom/extend-expect'
import { minimizePanel } from '../../../src/PanelManager/PanelGraph/minimizePanel'

describe('minimizePanel', () => {
  it('returns the expected PanelGraph array data structure removing A with right edge relationship to B', () => {
    const originalPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }]
    const resultPanelData = [{
      data: {
        B: { x: 0, y: 0, w: 1, h: 1 }
      },
      adjList: [{
        B: { re: [], le: [], tv: [], bv: [] }
      }]
    }]
    expect(minimizePanel(originalPanelData, ['A'])).toEqual(resultPanelData)
  })
  it('returns the expected PanelGraph array data structure removing B with left edge relationship to A', () => {
    const originalPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }]
    const resultPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 1 }
      },
      adjList: [{
        A: { re: [], le: [], tv: [], bv: [] }
      }]
    }]
    expect(minimizePanel(originalPanelData, ['B'])).toEqual(resultPanelData)
  })
  it('returns the original panel data if nodeIds is empty', () => {
    const originalPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }]
    expect(minimizePanel(originalPanelData, [])).toEqual(originalPanelData)
  })
})