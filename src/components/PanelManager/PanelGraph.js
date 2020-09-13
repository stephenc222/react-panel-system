import { cloneDeep } from 'lodash'

/* 
 * Manages panel graph data structure
 * 
 * A graph is used to implement panel dimensions and relationships between panels,
 * to allow for dynamic update between panels based off the change of one panel, into
 * an adjecency list for straightforward persistence and lookup of panels (a node on the graph) 
 * to update, and how to update that panel (based on the type of edge that connects the two panels)
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

const ORIGINAL_GRAPH = {
  data : {
    A: { w: 0.5, h: 1.0 },
    B: { w: 0.5, h: 1.0 }
  },
  // embedding order into list (first node is top left panel)
  adjList: [
    { A: { re: ['B'], vert: []}},
    { B : { re: ['A'], vert: []}}
  ]
}
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
const ORIGINAL_GRAPH_1 = {
  data : {
    A: { w: 0.5, h: 0.5 },
    B: { w: 0.5, h: 1.0 },
    C: { w: 0.5, h: 0.5 }
  },
  // embedding order into list (first node is top left panel)
  adjList: [
    { A: { re: ['B'], vert: ['C']}},
    { B : { re: ['A'], vert: []}},
    { A: { re: ['B'], vert: ['A']}},
  ]
}

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
const ORIGINAL_GRAPH_2 = {
  data : {
    A: { w: 0.5, h: 0.5 },
    B: { w: 0.5, h: 0.5 },
    C: { w: 0.5, h: 0.5 },
    D: { w: 0.5, h: 0.5 }
  },
  // embedding order into list (first node is top left panel)
  adjList: [
    { A: { re: ['B'], vert: ['D']}},
    { B : { re: ['A'], vert: ['C']}},
    { C: { re: ['D'], vert: ['B']}},
    { D: { re: ['C'], vert: ['A']}},
  ]
}

// NOTE: assumes an edge relationship (vert or re) is then entire vertical edge, or the entire horizontal edge (that sums to 100%)
// to enforce congruent panes, or else relationships between nodes will dynamically change beyond adding and removing a node
// CHANGE EVENT:
// (-0.2, 0)

// NOTE: update algorithm assume primarily one axis of change at a time, and in terms of % (less than one)
const CHANGE_EVENT = { nodeId: 'A', data: { w: -0.2, h: 0.0, edge: 'RE' }} 
const CHANGE_EVENT_1 = { nodeId: 'A', data: { w: 0.0, h: -0.2, edge: 'BV' }} 

// UPDATED GRAPH:
//      A----H----B
// (0.3, 1.0)  (0.7, 1)


// TODO: every node needs 4 types of edges (possible) to any other node
// these changes imply how the w and h need to change, and the corresponding affect on 
// x and y (origin of node placement):
// 1. (TV) top vertical - means it's y coordinate changes in correspondence to change event (the tv-related nodes y offset do not change)
// 2. (BV) bottom vertical - means it's y coordinate does not change in correspondence to change event (but the bv-related nodes y offset changes)
// 3. (LE) left edge - means it's x coordinate changes in correspondence to change event (the le-related nodes change width but NOT x offset)
// 4. (RE) right edge - means it's x coordinate does not change in correspondence to change event (but the re-related nodes x offset changes)

const MINIMUM_DIMENSION = 0.10
// updateGraph does not consider the special cases of adding a node or removing a node
// it assumes the graph structure is static, and only handles updating of node relationships
// TODO: consider minimum dimensions - "width or height of panel cannot be lower than 10%"
// to enable "docking"
// FIXME: consider rework of update based on relationship
export const updateGraph = ( origGraph, changeEvent) => {
  const { nodeId, data, edgeType } = changeEvent
  // first, update the node that changed
  const nextGraph = cloneDeep(origGraph)
  const nodeData = nextGraph.data[nodeId]
  // RE means these related nodes will have a width and x change
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
  // if the change node width did not change, then the horizontally related node widths will not change

  // if event was on the RE of a node:
  // if node also has a TV or BV relationship, only adjust it's width, else adjust it's width and x offset
  if (edgeType === 'RE') {
    // if this is on the edge of the container, don't change anything
    if (nodeData.w + nodeData.x === 1) {
      return nextGraph
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
  }
  if (edgeType === 'LE') {
    // nextGraph.data[nodeId].x = nodeData.x + data.w
    if (nodeData.x === 0) {
      return nextGraph
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
  }
  // TV only impact a minimal number of other nodes (since these edges will not be container-wide like horizontal edges)
  // TODO: probably need more testing on vertical relationships
  if (edgeType === 'TV') {
    // the node in question has offset and height change
    if (nextGraph.data[nodeId].y === 0) {
      return nextGraph
    }
    nextGraph.data[nodeId].y = nodeData.y - data.h
    nextGraph.data[nodeId].h = nodeData.h + data.h
    tvRelatedNodes.forEach( relatedNodeId => {
      // it's height changes, but not the offset for the related node
      const relatedNodeHeight = nextGraph.data[relatedNodeId].h
      nextGraph.data[relatedNodeId].h = relatedNodeHeight - data.h
    })
  }
  if (edgeType === 'BV') {
    // the node in question has only height change and no offset change
    if (nextGraph.data[nodeId].y + nextGraph.data[nodeId].h === 1) {
      return nextGraph
    }
    nextGraph.data[nodeId].h = nodeData.h + data.h
    bvRelatedNodes.forEach( relatedNodeId => {
      // it's height changes, and the offset for the related node
      const relatedNodeHeight = nextGraph.data[relatedNodeId].h
      nextGraph.data[relatedNodeId].h = relatedNodeHeight - data.h
      nextGraph.data[relatedNodeId].y = nextGraph.data[relatedNodeId].y + data.h
    })
  }
  return nextGraph
}
