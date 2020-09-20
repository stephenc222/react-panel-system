import { cloneDeep } from 'lodash'
// minimize a panel
// minimize panel is defined as removing a panel and remapping it's relationships

export const minimizePanel = (origGraph, nodeIds = []) => {
  const nextGraph = cloneDeep(origGraph)
  // if there is only one node in the graph, minimize does nothing
  // if node has a TV or BV relationship, then this node to remove will give it's whole height 
  // to the TV (or BV if no TV) and it's BV will now become a BV node of the node above it that it 
  // is giving it's entire height to, and giving it's TV to the BV node below it
  // TV means these nodes will only have a height change and no y change
  // "minimize" "one at a time"
  nodeIds.forEach (nodeId => {
    const reRelatedNodes = nextGraph.adjList.find( node => 
      Object.keys(node)[0] === nodeId )[nodeId].re || []
    // LE means these related nodes will have only a width and no x change
    const leRelatedNodes = nextGraph.adjList.find( node => 
      Object.keys(node)[0] === nodeId )[nodeId].le || []
    // TV means these nodes will only have a height change and no y change
    const tvRelatedNodes = nextGraph.adjList.find( node =>
      Object.keys(node)[0] === nodeId )[nodeId].tv || []
    // BV means these nodes will have a height change and y change
    const bvRelatedNodes = nextGraph.adjList.find( node =>
      Object.keys(node)[0] === nodeId )[nodeId].bv || []

    const currentNodeAdjListIndex = nextGraph.adjList.findIndex( adjListItem => Object.keys(adjListItem)[0] === nodeId)
    nextGraph.adjList.splice(currentNodeAdjListIndex, 1)
    nextGraph.adjList.forEach( adjListItem => {
      const adjListItemId = Object.keys(adjListItem)[0]
      const bvNodeIndexToRemove = adjListItem[adjListItemId].bv.findIndex( bvNodeIdAdjList => bvNodeIdAdjList === nodeId)
      const tvNodeIndexToRemove = adjListItem[adjListItemId].tv.findIndex( bvNodeIdAdjList => bvNodeIdAdjList === nodeId)
      const leNodeIndexToRemove = adjListItem[adjListItemId].le.findIndex( bvNodeIdAdjList => bvNodeIdAdjList === nodeId)
      const reNodeIndexToRemove = adjListItem[adjListItemId].re.findIndex( bvNodeIdAdjList => bvNodeIdAdjList === nodeId)
      if (tvNodeIndexToRemove > -1) {
        adjListItem[adjListItemId].tv.splice(tvNodeIndexToRemove, 1)
      }
      if (bvNodeIndexToRemove > -1) {
        adjListItem[adjListItemId].bv.splice(bvNodeIndexToRemove, 1)

      }
      if (leNodeIndexToRemove > -1) {
        adjListItem[adjListItemId].le.splice(leNodeIndexToRemove, 1)
      }
      if (reNodeIndexToRemove > -1) {
        adjListItem[adjListItemId].re.splice(reNodeIndexToRemove, 1)
      }
    })
    if (tvRelatedNodes.length) {
      // NOTE: assumes only 1 BV or TV directly related node
      const tvNodeId = tvRelatedNodes[0]
      const tvNodeData = nextGraph.data[tvNodeId]
      const currentNodeData = nextGraph.data[nodeId]
      const bvNodeData = nextGraph.data[tvNodeId]
      // "current" H is added to BV
      // update data, then update resulting relationships
      bvNodeData.h = tvNodeData.h + currentNodeData.h
      // bvNodeData.y = currentNodeData.y 
      delete nextGraph.data[nodeId]
      nextGraph.data[tvNodeId] = tvNodeData
      return nextGraph
    } else if (bvRelatedNodes.length) {
      // NOTE: assumes only 1 BV or TV directly related node
      const bvNodeId = bvRelatedNodes[0]
      const currentNodeData = nextGraph.data[nodeId]
      const bvNodeData = nextGraph.data[bvNodeId]
      // "current" H is added to BV
      // update data, then update resulting relationships
      bvNodeData.h = bvNodeData.h + currentNodeData.h
      bvNodeData.y = currentNodeData.y 
      delete nextGraph.data[nodeId]
      nextGraph.data[bvNodeId] = bvNodeData
      return nextGraph
    }
    // for LE nodes, add to their width 1/2 the width of this node (this node is assumed to be full height)
    // and no change to their X
    leRelatedNodes.forEach( leNodeId => {
      const leNodeData = nextGraph.data[leNodeId]
      // if none, no space to share
      if (!reRelatedNodes.length) {
        leNodeData.w = leNodeData.w + Math.floor((nextGraph.data[nodeId].w) * 1000) / 1000
      } else {
        leNodeData.w = leNodeData.w + Math.floor((nextGraph.data[nodeId].w / 2) * 1000) / 1000
      }
      // for every LE node, every RE node of the removed node is now an RE node of this LE node
      // nextGraph.adjList
      const currentLENodeAdjListIndex = nextGraph.adjList.findIndex( adjListItem => Object.keys(adjListItem)[0] === leNodeId)
      nextGraph.adjList.forEach( adjListItem => {
        const adjListItemId = Object.keys(adjListItem)[0]
        if (!nextGraph.adjList[currentLENodeAdjListIndex][leNodeId].re.includes(adjListItemId) && adjListItemId !== leNodeId) {
          nextGraph.adjList[currentLENodeAdjListIndex][leNodeId].re.push(adjListItemId)
        }
      })
    })
    // for RE nodes, add to their width 1/2 the width of this node (this node is assumed to be full height)
    // and reduce their X by 1/2
    reRelatedNodes.forEach( reNodeId => {
      const reNodeData = nextGraph.data[reNodeId]
      // if none, no space to share
      if (!leRelatedNodes.length) {
        reNodeData.w = reNodeData.w + Math.floor((nextGraph.data[nodeId].w) * 1000) / 1000
        reNodeData.x = reNodeData.x - Math.floor((nextGraph.data[nodeId].w ) * 1000) / 1000
      } else {
        reNodeData.w = reNodeData.w + Math.floor((nextGraph.data[nodeId].w / 2) * 1000) / 1000
        reNodeData.x = reNodeData.x - Math.floor((nextGraph.data[nodeId].w / 2) * 1000) / 1000
      }
      // for every RE node, every LE node of the removed node is now an LE node of this LE node
      const currentLENodeAdjListIndex = nextGraph.adjList.findIndex( adjListItem => Object.keys(adjListItem)[0] === reNodeId)
      nextGraph.adjList.forEach( adjListItem => {
        const adjListItemId = Object.keys(adjListItem)[0]
        if (!nextGraph.adjList[currentLENodeAdjListIndex][reNodeId].le.includes(adjListItemId) && adjListItemId !== reNodeId) {
          nextGraph.adjList[currentLENodeAdjListIndex][reNodeId].le.push(adjListItemId)
        }
      })
    })
    delete nextGraph.data[nodeId]
  })
  return nextGraph
}