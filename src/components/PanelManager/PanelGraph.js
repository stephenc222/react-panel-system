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
    { A: { horiz: ['B'], vert: []}},
    { B : { horiz: ['A'], vert: []}}
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
// ORIGINAL GRAPH 1:
const ORIGINAL_GRAPH_1 = {
  data : {
    A: { w: 0.5, h: 0.5 },
    B: { w: 0.5, h: 1.0 },
    C: { w: 0.5, h: 0.5 }
  },
  // embedding order into list (first node is top left panel)
  adjList: [
    { A: { horiz: ['B'], vert: ['C']}},
    { B : { horiz: ['A'], vert: []}},
    { A: { horiz: ['B'], vert: ['A']}},
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
 * |    D    |    C    |
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
    { A: { horiz: ['B'], vert: ['D']}},
    { B : { horiz: ['A'], vert: ['C']}},
    { C: { horiz: ['D'], vert: ['B']}},
    { D: { horiz: ['C'], vert: ['A']}},
  ]
}

// NOTE: assumes an edge relationship (vert or horiz) is then entire vertical edge, or the entire horizontal edge (that sums to 100%)
// to enforce congruent panes, or else relationships between nodes will dynamically change beyond adding and removing a node
// CHANGE EVENT:
// (-0.2, 0)

// NOTE: update algorithm assume primarily one axis of change at a time, and in terms of % (less than one)
const CHANGE_EVENT = { nodeId: 'A', data: { w: -0.2, h: 0.0 }} 
const CHANGE_EVENT_1 = { nodeId: 'A', data: { w: 0.0, h: -0.2 }} 

// UPDATED GRAPH:
//      A----H----B
// (0.3, 1.0)  (0.7, 1)


const MINIMUM_DIMENSION = 0.10
// updateGraph does not consider the special cases of adding a node or removing a node
// it assumes the graph structure is static, and only handles updating of node relationships
// TODO: consider minimum dimensions - "width or height of panel cannot be lower than 10%"
// FIXME: consider rework of update based on relationship
export const updateGraph = ( origGraph, changeEvent) => {
  // console.log('updateGraph', JSON.stringify(origGraph, null, 2), {changeEvent })
  const { nodeId, data } = changeEvent
  // first, update the node that changed
  const nextGraph = cloneDeep(origGraph)
  const nodeData = nextGraph.data[nodeId]
  // if height or width is 100% (1) already, do not allow change (what would be beneath it? Empty space?)
  if (nextGraph.data[nodeId].w !== 1) {
    nextGraph.data[nodeId].w = nodeData.w + data.w <= 1 ? nodeData.w + data.w : nodeData.w
  }
  if (nextGraph.data[nodeId].h !== 1) {
    nextGraph.data[nodeId].h = nodeData.h + data.h <= 1 ? nodeData.h + data.h : nodeData.h
  }
  // if (nextGraph.data[nodeId].h < MINIMUM_DIMENSION)
  // next, find and update the related nodes from the changed node
  
  // horizontal means opposingly horizontal
  const horizRelatedNodes = nextGraph.adjList.find( node => 
    Object.keys(node)[0] === nodeId )[nodeId].horiz || []
  const adjHorizRelatedNodes = nextGraph.adjList.find( node => 
    Object.keys(node)[0] === nodeId )[nodeId].adjHoriz || []
  const vertRelatedNodes = nextGraph.adjList.find( node =>
    Object.keys(node)[0] === nodeId )[nodeId].vert || []
  const adjVertRelatedNodes = nextGraph.adjList.find( node =>
    Object.keys(node)[0] === nodeId )[nodeId].adjVert || []
  // console.log({horizRelatedNodes, vertRelatedNodes})
  // if the change node width did not change, then the horizontally related node widths will not change
  if (horizRelatedNodes.length ) {
    // if the change node width increased, then the horizontally related node widths will decrease
    // if the change node width decreased, then the horizontally related node widths will increase
    horizRelatedNodes.forEach(relatedNodeId => {
      nextGraph.data[relatedNodeId].w = nextGraph.data[relatedNodeId].w - data.w
      // if (vertRelatedNodes.includes(relatedNodeId)) {
      //   nextGraph.data[relatedNodeId].h = nextGraph.data[relatedNodeId].h + data.h
      // }
    })
  }
  if (adjVertRelatedNodes.length) {
    adjVertRelatedNodes.forEach(relatedNodeId => {
      nextGraph.data[relatedNodeId].h = nextGraph.data[relatedNodeId].h + data.h
    })
  }
  if (adjHorizRelatedNodes.length) {
    adjHorizRelatedNodes.forEach(relatedNodeId => {
      nextGraph.data[relatedNodeId].w = nextGraph.data[relatedNodeId].w + data.w
    })
  }
  // if the change node width did not change, then the vertically related node widths will not change
  if (vertRelatedNodes.length) {
    // if the change node width increased, then the vertically related node widths will decrease
    // if the change node width decreased, then the vertically related node widths will increase
    vertRelatedNodes.forEach(relatedNodeId => {
      nextGraph.data[relatedNodeId].h = nextGraph.data[relatedNodeId].h - data.h
      // if (vertRelatedNodes.includes(relatedNodeId)) {
      //   nextGraph.data[relatedNodeId].w = nextGraph.data[relatedNodeId].w + data.w
      // }
    })
  }
  // console.log('after update', JSON.stringify(nextGraph, null, 2))
  return nextGraph

}

// console.log('--------------------------------- EXAMPLE 0 -----------------------')
// updateGraph(ORIGINAL_GRAPH, CHANGE_EVENT)
// console.log('--------------------------------- EXAMPLE 1 -----------------------')
// updateGraph(ORIGINAL_GRAPH_1, CHANGE_EVENT_1)
// console.log('--------------------------------- EXAMPLE 2 -----------------------')
// updateGraph(ORIGINAL_GRAPH_2, CHANGE_EVENT_1)