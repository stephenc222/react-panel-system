import '@testing-library/jest-dom/extend-expect'
import { updateGraph } from '../../../src/PanelManager/PanelGraph/updateGraph'

describe('updateGraph', () => {
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
})
