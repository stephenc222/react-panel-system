import { PanelGraph } from "../../types"

export const maximizePanel = (panelNodeId: string | string[]): PanelGraph[] => {
  let panelNodeIdStr = ''
  // assumes that only one panel could be "maximized", and that "maximized" means bring to the
  // forefront of a user's attention, with full width and height
  if (Array.isArray(panelNodeId)) {
    panelNodeIdStr = panelNodeId[0]
  } else if (typeof panelNodeId === 'string') {
    panelNodeIdStr = panelNodeId
  } else {
    throw new Error(`unknown type passed for panelNodeId: ${panelNodeId}`)
  }
  
  const newGraphArr: PanelGraph[] = [{
    adjList: [{
      [panelNodeIdStr]: { re: [], le: [], tv: [], bv: [] }
    }],
    data: {
      [panelNodeIdStr]: {
        x: 0,
        y: 0,
        w: 1,
        h: 1
      }
    }
  }]
  // remove all edge relationships
  // set x and y to (0,0) w and h to 1 each
  return newGraphArr;
}