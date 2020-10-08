import '@testing-library/jest-dom/extend-expect'
import { updateGraph } from '../../../src/PanelManager/PanelGraph/updateGraph'

describe('updateGraph', () => {
  it('should return the same graph if edgeType isn\'t recognized', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }
    const testChangeEvent = {
      nodeId: 'A',
      edgeType: '',
      data: { w: null, h: null }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(originalPanelGraph)
  })
  it('should return the same graph if changeEvent doesn\'t have found node', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }
    const testChangeEvent = {
      nodeId: '',
      edgeType: '',
      data: { w: null, h: null }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(originalPanelGraph)
  })
  it('should return an expected new graph with 1% width decrease from left edge of panel B', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }
    const testUpdatedPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 0.49, h: 1 },
        B: { x: 0.49, y: 0, w: 0.51, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }
    const testChangeEvent = {
      nodeId: 'B',
      edgeType: 'LE',
      data: { w: 0.01, h: null }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(testUpdatedPanelGraph)
  })
  it('should return an expected new graph with 1% width increase from right edge of panel A', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }
    const testUpdatedPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 0.51, h: 1 },
        B: { x: 0.51, y: 0, w: 0.49, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }
    const testChangeEvent = {
      nodeId: 'A',
      edgeType: 'RE',
      data: { w: 0.01, h: null }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(testUpdatedPanelGraph)
  })
  it('should return an expected new graph with 1% height increase from top edge of panel B with panel A above and panel C below', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, h: 0.25, w: 1 },
        B: { x: 0, y: 0.25, h: 0.50, w: 1 },
        C: { x: 0, y: 0.75, h: 0.25, w: 1 }
      },
      adjList: [
        {A: { re: [], le: [], tv: [], bv: ['B'] }},
        {B: { re: [], le: [], tv: ['A'], bv: ['C'] }},
        {C: { re: [], le: [], tv: ['B'], bv: [] }}
      ]
    }
    const testUpdatedPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 1.0, h: 0.51 },
        B: { x: 0, y: 0.51, w: 1.0, h: 0.24 },
        C: { x: 0, y: 0.75, w: 1.0, h: 0.25 }
      },
      adjList: [
        {A: { re: [], le: [], tv: [], bv: ['B'] }},
        {B: { re: [], le: [], tv: ['A'], bv: ['C'] }},
        {C: { re: [], le: [], tv: ['B'], bv: [] }}
      ]
    }
    /**
     * TODO: consider refactor of height change from top edge-based events
     * to the same basis as other edge-based events.
     * NOTE: Non-issue for consumers because the event system employed by
     * react-panel-system is closed externally
     */ 
    const testChangeEvent = {
      nodeId: 'B',
      edgeType: 'TV',
      data: { w: null, h: 0.51 }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(testUpdatedPanelGraph)
  })
  it('should return an expected new graph with 1% height increase from top edge of panel B', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 1, h: 0.5 },
        B: { x: 0, y: 0.5, w: 1, h: 0.5 }
      },
      adjList: [
        {A: { re: [], le: [], tv: [], bv: ['B'] }},
        {B: { re: [], le: [], tv: ['A'], bv: [] }}
      ]
    }
    const testUpdatedPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 1.0, h: 0.49 },
        B: { x: 0, y: 0.49, w: 1.0, h: 0.51 }
      },
      adjList: [
        {A: { re: [], le: [], tv: [], bv: ['B'] }},
        {B: { re: [], le: [], tv: ['A'], bv: [] }}
      ]
    }
    /**
     * TODO: consider refactor of height change from top edge-based events
     * to the same basis as other edge-based events.
     * NOTE: Non-issue for consumers because the event system employed by
     * react-panel-system is closed externally
     */ 
    const testChangeEvent = {
      nodeId: 'B',
      edgeType: 'TV',
      data: { w: null, h: 0.49 }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(testUpdatedPanelGraph)
  })
  it('should return an expected new graph with 1% height decrease from bottom edge of panel A', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 1, h: 0.5 },
        B: { x: 0, y: 0.5, w: 1, h: 0.5 }
      },
      adjList: [
        {A: { re: [], le: [], tv: [], bv: ['B'] }},
        {B: { re: [], le: [], tv: ['A'], bv: [] }}
      ]
    }
    const testUpdatedPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 1.0, h: 0.51 },
        B: { x: 0, y: 0.51, w: 1.0, h: 0.49  }
      },
      adjList: [
        {A: { re: [], le: [], tv: [], bv: ['B'] }},
        {B: { re: [], le: [], tv: ['A'], bv: [] }}
      ]
    }
    const testChangeEvent = {
      nodeId: 'A',
      edgeType: 'BV',
      data: { w: null, h: 0.51 }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(testUpdatedPanelGraph)
  })
  it('should return the same graph due to a top edge-based change that would violate the minimum threshold for a panel size', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 0.5 },
        B: { x: 0, y: 0.5, w: 0.5, h: 0.5 },
        C: { x: 0.5, y: 0.5, w: 0.5, h: 1.0 }
      },
      adjList: [
        {A: { re: ['C'], le: [], tv: [], bv: ['B'] }},
        {B: { re: ['C'], le: [], tv: ['A'], bv: [] }},
        {C: { re: [], le: ['A', 'B'], tv: [], bv: [] }}
      ]
    }
    const testChangeEvent = {
      nodeId: 'B',
      edgeType: 'TV',
      data: { w: null, h: -0.97 }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(originalPanelGraph)
  })
  it('should return the same graph due to a bottom edge-based change that would violate the minimum threshold for a panel size', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 1, h: 0.5 },
        B: { x: 0.5, y: 0, w: 1, h: 0.5 }
      },
      adjList: [
        {A: { re: [], le: [], tv: [], bv: ['B'] }},
        {B: { re: [], le: [], tv: ['A'], bv: [] }}
      ]
    }
    const testChangeEvent = {
      nodeId: 'A',
      edgeType: 'BV',
      data: { w: null, h: -0.97 }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(originalPanelGraph)
  })
  it('should return the same graph due to a left edge-based change that would violate the minimum threshold for a panel size', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }
    const testChangeEvent = {
      nodeId: 'B',
      edgeType: 'LE',
      data: { w: -0.97, h: null }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(originalPanelGraph)
  })
  it('should return the same graph due to a right edge-based change that would violate the minimum threshold for a panel size', () => {
    const originalPanelGraph = {
      data: {
        A: { x: 0, y: 0, w: 0.5, h: 1 },
        B: { x: 0.5, y: 0, w: 0.5, h: 1 }
      },
      adjList: [
        {A: { re: ['B'], le: [], tv: [], bv: [] }},
        {B: { re: [], le: ['A'], tv: [], bv: [] }}
      ]
    }
    const testChangeEvent = {
      nodeId: 'A',
      edgeType: 'RE',
      data: { w: -0.97, h: null }
    }
    expect(updateGraph(originalPanelGraph, testChangeEvent)).toEqual(originalPanelGraph)
  })

})
