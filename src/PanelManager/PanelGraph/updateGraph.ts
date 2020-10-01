import cloneDeep from 'lodash.clonedeep'
import { PanelChangeEvent, PanelGraph } from '../../types'

/* 
 * Manages panel graph data structure
 * 
 * A graph is used to implement panel dimensions and relationships between panels,
 * to allow for dynamic update between panels based off the change of one panel, into
 * an adjecency list for straightforward persistence and lookup of panels (a node on the graph) 
 * to update, and how to update that panel (based on the type of edge that connects the two or more panels)
*/

// EXAMPLE:

/* 
 * ORIGINAL GRAPH:
 *     A----H----B
 * (0.5, 1.0)  (0.5, 1)
 * 
 * ---------------------
 * |         |         |
 * |         |         |
 * |    A    |    B    |
 * |         |         |
 * |         |         |
 * ---------------------
*/ 

// const ORIGINAL_GRAPH = {
//   data : {
//     A: { w: 0.5, h: 1.0 },
//     B: { w: 0.5, h: 1.0 }
//   },
//   embedding order into list (first node is top left panel)
//   adjList: [
//     { A: { re: ['B'], vert: []}},
//     { B : { re: ['A'], vert: []}}
//   ]
// }
/* 
 * ORIGINAL GRAPH 1:
 *      A----H----B
 * (0.5, 0.5)  (0.5, 1)
 *      |
 *      V
 *      |
 *      C
 * (0.5, 0.5)
 * 
 * ---------------------
 * |         |         |
 * |    A    |         |
 * |---------|    B    |
 * |    C    |         |
 * |         |         |
 * ---------------------
 */ 
// const ORIGINAL_GRAPH_1 = {
//   data : {
//     A: { w: 0.5, h: 0.5 },
//     B: { w: 0.5, h: 1.0 },
//     C: { w: 0.5, h: 0.5 }
//   },
//   embedding order into list (first node is top left panel)
//   adjList: [
//     { A: { re: ['B'], vert: ['C']}},
//     { B : { re: ['A'], vert: []}},
//     { A: { re: ['B'], vert: ['A']}},
//   ]
// }

/* 
 * ORIGINAL GRAPH 2:
 *      A------H------B
 * (0.5, 0.5)    (0.5, 0.5)
 *      |             |
 *      V             V
 *      |             |
 *      C             D
 * (0.5, 0.5)    (0.5, 0.5)
 * 
 * ---------------------
 * |         |         |
 * |    A    |    B    |
 * |---------|---------|
 * |    C    |    D    |
 * |         |         |
 * ---------------------
 */ 
// const ORIGINAL_GRAPH_2 = {
//   data : {
//     A: { w: 0.5, h: 0.5 },
//     B: { w: 0.5, h: 0.5 },
//     C: { w: 0.5, h: 0.5 },
//     D: { w: 0.5, h: 0.5 }
//   },
//   embedding order into list (first node is top left panel)
//   adjList: [
//     { A: { re: ['B'], vert: ['D']}},
//     { B : { re: ['A'], vert: ['C']}},
//     { C: { re: ['D'], vert: ['B']}},
//     { D: { re: ['C'], vert: ['A']}},
//   ]
// }

const MINIMUM_THRESHOLD = 0.05
const MAXIMUM_THRESHOLD = 0.95
// TODO: consider rework of update based on relationship to enable "docking"
export const updateGraph = ( origGraph: PanelGraph, changeEvent: PanelChangeEvent): PanelGraph => {
  const { nodeId, data, edgeType } = changeEvent
  // first, update the node that changed
  const nextGraph = cloneDeep(origGraph)
  const nodeData = nextGraph.data[nodeId]
  if (!nodeData) {
    return nextGraph
  }
  const panelIds = Object.keys(nextGraph.data) 
  // BV means these nodes will have a height change and y change
  const bvRelatedNodes = nextGraph.adjList.find( node =>
    Object.keys(node)[0] === nodeId )[nodeId].bv || []
  // if the change node width did not change, then the horizontally related node widths will not change

  if (edgeType === 'BV') {
    // the node in question has only height change and no offset change
    if (nextGraph.data[nodeId].y + nextGraph.data[nodeId].h === 1) {
      return nextGraph
    }
    if (nodeData.y + nodeData.h + data.h < MINIMUM_THRESHOLD || nodeData.y + nodeData.h + data.h > MAXIMUM_THRESHOLD) {
      return nextGraph
    }
    nextGraph.data[nodeId].h = nodeData.h + data.h
    bvRelatedNodes.forEach( relatedNodeId => {
      // it's height changes, and the offset for the related node
      const relatedNodeHeight = nextGraph.data[relatedNodeId].h
      nextGraph.data[relatedNodeId].h = relatedNodeHeight - data.h
      nextGraph.data[relatedNodeId].y = nextGraph.data[relatedNodeId].y + data.h
    })
    return nextGraph
  }
    // TV means these nodes will only have a height change and no y change
  const tvRelatedNodes = nextGraph.adjList.find( node =>
    Object.keys(node)[0] === nodeId )[nodeId].tv || []
  // if event was on the RE of a node:
  // if node also has a TV or BV relationship, only adjust it's width, else adjust it's width and x offset
  if (edgeType === 'RE') {
  // RE means these related nodes will have a width and x change
  const reRelatedNodes = nextGraph.adjList.find( node => 
    Object.keys(node)[0] === nodeId )[nodeId].re || []
    // if this is on the edge of the container, don't change anything
    if (nodeData.w + nodeData.x === 1) {
      return nextGraph
    }
    if (nodeData.x + nodeData.w + data.w < MINIMUM_THRESHOLD || nodeData.x + nodeData.w + data.w > MAXIMUM_THRESHOLD) {
      return nextGraph
    }
    if (nodeData.w + data.w < MINIMUM_THRESHOLD) {
      return nextGraph
    }
    const tooSmallREOnlySmallNodes = reRelatedNodes.filter( nodeId => {
      const relatedNode = nextGraph.data[nodeId] 
      return relatedNode.w - data.w < MINIMUM_THRESHOLD && !bvRelatedNodes.includes(nodeId) && !tvRelatedNodes.includes(nodeId)
    })
    // these are nodes that are not directly related (share a direct edge) but exist with an x greater than the current node's x + width
    for (let i = 0; i < panelIds.length; ++i) {
      const panelData= nextGraph.data[panelIds[i]]
      if (panelData.x >= nodeData.x + nodeData.w) {
        if (nodeData.x + nodeData.w + data.w > panelData.x && !reRelatedNodes.length) {
          return nextGraph
        }
      }
    }
    if ( nextGraph.data[nodeId].w + data.w < MINIMUM_THRESHOLD || tooSmallREOnlySmallNodes.length) {
      for (let i = 0; i < reRelatedNodes.length; ++i) {
        const relatedNode = nextGraph.data[reRelatedNodes[i]]
        if (relatedNode.w - data.w < MINIMUM_THRESHOLD) {
          if (data.w > 0 && nextGraph.data[reRelatedNodes[i]].w < MINIMUM_THRESHOLD) {
            nextGraph.data[reRelatedNodes[i]].w = relatedNode.w + data.w
          }
          return nextGraph
        }
      }
    }
    nextGraph.data[nodeId].w = nodeData.w + data.w
    reRelatedNodes.forEach( relatedNodeId => {
      if (bvRelatedNodes.find(nodeId => nodeId === relatedNodeId) || tvRelatedNodes.find(nodeId => nodeId === relatedNodeId)) {
        // adjust width in the same direction but not offset
        nextGraph.data[relatedNodeId].w = nextGraph.data[nodeId].w
      } else {
        // adjust width in the opposite direction and offset in same direction
        const relatedNodeWidth = nextGraph.data[relatedNodeId].w
        const relatedNodeX = nextGraph.data[relatedNodeId].x
        nextGraph.data[relatedNodeId].w = relatedNodeWidth - data.w
        nextGraph.data[relatedNodeId].x = relatedNodeX + data.w
      }
    })
    return nextGraph
  }
  if (edgeType === 'LE') {
    // LE means these related nodes will have only a width and no x change
    const leRelatedNodes = nextGraph.adjList.find( node => 
      Object.keys(node)[0] === nodeId )[nodeId].le || []
    if (nodeData.x === 0) {
      return nextGraph
    }
    if (nodeData.x + nodeData.w + data.w < MINIMUM_THRESHOLD || nodeData.w + data.w > MAXIMUM_THRESHOLD) {
      return nextGraph
    }
    if (nodeData.x > MAXIMUM_THRESHOLD) {
      return nextGraph
    }
    if (nodeData.w + data.w < MINIMUM_THRESHOLD) {
      return nextGraph
    }
    const tooSmallLEOnlySmallNodes = leRelatedNodes.filter( nodeId => {
      const relatedNode = nextGraph.data[nodeId] 
      return relatedNode.w - data.w < MINIMUM_THRESHOLD && !bvRelatedNodes.includes(nodeId) && !tvRelatedNodes.includes(nodeId)
    })
    // these are nodes that are not directly related (share a direct edge) but exist with an x less than the current node's x + width
    // or an x less than the current node's x
    for (let i = 0; i < panelIds.length; ++i) {
      const panelData= nextGraph.data[panelIds[i]]
      if (nodeData.x >= panelData.x + panelData.w) {
        if (nodeData.x - data.w < panelData.x + panelData.w && !leRelatedNodes.length) {
          return nextGraph
        }
      }
    }
    if ( nextGraph.data[nodeId].w + data.w < MINIMUM_THRESHOLD || tooSmallLEOnlySmallNodes.length) {
      for (let i = 0; i < leRelatedNodes.length; ++i) {
        const relatedNode = nextGraph.data[leRelatedNodes[i]]
        if (relatedNode.w - data.w < MINIMUM_THRESHOLD) {
          return nextGraph
        }
      }
    }
    nextGraph.data[nodeId].w = nodeData.w + data.w
    nextGraph.data[nodeId].x = nodeData.x - data.w 
    leRelatedNodes.forEach( relatedNodeId => {
      if (bvRelatedNodes.find(nodeId => nodeId === relatedNodeId) || tvRelatedNodes.find(nodeId => nodeId === relatedNodeId)) {
        // adjust width in the same direction but not offset
        const relatedNodeWidth = nextGraph.data[relatedNodeId].w
        nextGraph.data[relatedNodeId].w = relatedNodeWidth + data.w
        // FIXME: this quick fixes a % value difference issue
        nextGraph.data[relatedNodeId].x = nextGraph.data[nodeId].x
      } else {
        // adjust width in the opposite direction and offset in same direction
        const relatedNodeWidth = nextGraph.data[relatedNodeId].w
        nextGraph.data[relatedNodeId].w = relatedNodeWidth - data.w
      }
    })
    return nextGraph
  }
  // TV only impact a minimal number of other nodes (since these edges will not be container-wide like horizontal edges)
  if (edgeType === 'TV') {
    if (data.h + nodeData.y + nodeData.h < MINIMUM_THRESHOLD) {
      return nextGraph
    }
    if ( data.h > MINIMUM_THRESHOLD) {
      nextGraph.data[nodeId].y = data.h
      if (!bvRelatedNodes.length) {
        nextGraph.data[nodeId].h = 1 - nodeData.y
      } else {
        bvRelatedNodes.forEach( relatedNodeId => {
          nextGraph.data[nodeId].h = nextGraph.data[relatedNodeId].y
        })
      }
      tvRelatedNodes.forEach( relatedNodeId => {
        nextGraph.data[relatedNodeId].h = nextGraph.data[nodeId].y
      })
    }
    return nextGraph
  }
  return nextGraph
}