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
  it('returns the expected PanelGraph array data structure removing B with left edge relationship to A and C', () => {
    /* 
     * before:
     *
     * ---------------------
     * |         |         |
     * |    A    |         |
     * |---------|    B    |
     * |    C    |         |
     * |         |         |
     * ---------------------
     * 
     */ 
    const originalPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 0.5 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1.0 },
        C: { x: 0, y: 0.5, w: 0.5, h: 0.5 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: ['C'] }},
        {B: { re: [], le: ['A', 'C'], tv: [], bv: [] }},
        {C: { re: ['B'], le: [], tv: ['A'], bv: [] }}
      ]
    }]
    const resultPanelData = [{
      data: {
        B: { x: 0.5, y: 0, w: 0.5, h: 1 },
        C: { x: 0, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {B: { re: [], le: ['C'], tv: [], bv: [] }},
        {C: { re: ['B'], le: [], tv: [], bv: [] }}
      ]
    }]
    /* 
     * expected after:
     *
     * ---------------------
     * |         |         |
     * |         |         |
     * |    C    |    B    |
     * |         |         |
     * |         |         |
     * ---------------------
     * 
     */ 
    expect(minimizePanel(originalPanelData, ['A'])).toEqual(resultPanelData)
  })
  it('returns the expected PanelGraph array data structure removing A with bottom edge relationship to B', () => {
    const originalPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 0.5 },
        B: { x: 0, y: 0.5, w: 1, h: 0.5 }
      },
      adjList: [
        {A: { re: [], le: [], tv: [], bv: ['B'] }},
        {B: { re: [], le: [], tv: ['A'], bv: [] }}
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
  it('returns the expected PanelGraph array data structure removing B with top edge relationship to A', () => {
    const originalPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 1, h: 0.5 },
        B: { x: 0, y: 0.5, w: 1, h: 0.5 }
      },
      adjList: [
        {A: { re: [], le: [], tv: [], bv: ['B'] }},
        {B: { re: [], le: [], tv: ['A'], bv: [] }}
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
  it('returns the expected PanelGraph array data structure removing B with left edge relationship to A, and has a right edge to C', () => {
    const originalPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 0.3333333, h: 1 },
        B: { x: 0.3333333, y: 0, w: 0.3333333, h: 1 },
        C: { x: 0.6666666, y: 0, w: 0.3333333, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: ['C'], le: ['A'], tv: [], bv: [] }},
        {C: { re: [], le: ['B'], tv: [], bv: [] }}
      ]
    }]
    const resultPanelData = [{
      data: {
        A: { x: 0, y: 0, w: 0.4993333, h: 1 },
        C: { x: 0.5006666, y: 0, w: 0.4993333, h: 1 }
      },
      adjList: [
        {A: { re: ['C'], le: [], tv: [], bv: [] }},
        {C: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }]
    expect(minimizePanel(originalPanelData, ['B'])).toEqual(resultPanelData)
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
  it('throws if a PanelGraph object does not contain the requested nodes to minimize', () => {
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
    const testMinimizeNodeIds = ['C', 'D']
    expect(() => minimizePanel(originalPanelData, testMinimizeNodeIds)).toThrow(`A PanelGraph object was not found with these nodeIds: ${testMinimizeNodeIds.join('')}`)
  })
})