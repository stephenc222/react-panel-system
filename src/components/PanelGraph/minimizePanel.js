import { cloneDeep } from 'lodash'
// minimize a panel
// minimize panel is defined as removing a panel and remapping it's relationships

export const minimizePanel = (origGraph, panelNodeId) => {
  console.log('minimizePanel', { origGraph, panelNodeId })
  const nextGraph = cloneDeep(origGraph)
  // if there is only one node in the graph, minimize does nothing

  // if node has a TV or BV relationship, then this node to remove will give it's whole height 
  // to the TV (or BV if no TV) and it's BV will now become a BV node of the node above it that it 
  // is giving it's entire height to, and giving it's TV to the BV node below it

  // if node has zero TV or BV relationships, then LE nodes will receive 1/2 of it's width, 
  // and RE nodes the other 1/2 of its width
  return nextGraph
}