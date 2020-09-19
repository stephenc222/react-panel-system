import { cloneDeep } from 'lodash'
// maximize a panel
// maximize a panel is defined as removing all other panels and remapping it's relationships
// Mazimizing prevents any drag and drop


export const maximizePanel = (origGraph, panelNodeId) => {
  console.log('maximizePanel', { origGraph, panelNodeId })
  let panelNodeIdStr = ''
  if (Array.isArray(panelNodeId) && panelNodeId.length === 1) {
    panelNodeIdStr = panelNodeId[0]
  }
  const nextGraph = cloneDeep(origGraph)
  console.log({panelNodeIdStr})
  
  const newGraph = {
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
  }
  // remove all edge relationships
  // set x and y to (0,0) w and h to 1 each
  return newGraph
}