export interface PanelNodeEdges {
  [nodeId: string]: { re: string[]; le: string[]; tv: string[]; bv: string[] }
}

export interface PanelGraph {
  data: {
    [nodeId: string]: {
      x: number
      y: number
      w: number
      h: number
    }
  }
  adjList: PanelNodeEdges[]
}

export interface PanelChangeEvent {
  nodeId: string
  edgeType: string
  data: { w: number; h: number }
}

export interface PanelDraggingNode {
  edge: string
  nodeId: string
}
