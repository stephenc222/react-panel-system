const { cloneDeep } = require('lodash')

/* 
 * Manages panel graph data structure
 * 
 * A graph is used to implement panel dimensions and relationships between panels,
 * to allow for dynamic update between panels based off the change of one panel, into
 * an adjecency list for straightforward persistence and lookup of panels (a node on the graph) 
 * to update, and how to update that panel (based on the type of edge that connects the two panels)
*/

// EXAMPLE:

// ORIGINAL GRAPH:
//      A----H----B
// (0.5, 1.0)  (0.5, 1)
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

// CHANGE EVENT:
// (-0.2, 0)

// NOTE: update algorithm assume primarily one axis of change at a time, and in terms of % (less than one)
const CHANGE_EVENT = { nodeId: 'A', data: { w: -0.2, h: 0.0 }} 
const CHANGE_EVENT_1 = { nodeId: 'A', data: { w: 0.0, h: -0.2 }} 

// UPDATED GRAPH:
//      A----H----B
// (0.3, 1.0)  (0.7, 1)


const updateGraph = ( origGraph, changeEvent) => {
  console.log('updateGraph', JSON.stringify(origGraph, null, 2), {changeEvent })
  const { nodeId, data } = changeEvent
  // first, update the node that changed
  const nextGraph = cloneDeep(origGraph)
  const nodeData = nextGraph.data[nodeId]
  nextGraph.data[nodeId] = { w: nodeData.w + data.w, h: nodeData.h + data.h }
  // next, find and update the related nodes from the changed node
  
  const horizRelatedNodes = nextGraph.adjList.find( node => 
    Object.keys(node)[0] === nodeId )[nodeId].horiz || []
  const vertRelatedNodes = nextGraph.adjList.find( node =>
    Object.keys(node)[0] === nodeId )[nodeId].vert || []
  console.log({horizRelatedNodes, vertRelatedNodes})
  // if the change node width did not change, then the horizontally related node widths will not change
  if (horizRelatedNodes.length ) {
    // if the change node width increased, then the horizontally related node widths will decrease
    // if the change node width decreased, then the horizontally related node widths will increase
    horizRelatedNodes.forEach(relatedNodeId => {
      nextGraph.data[relatedNodeId].w = nextGraph.data[relatedNodeId].w + (data.w < 0 ? data.w * -1 : data.w)
      if (vertRelatedNodes.includes(relatedNodeId)) {
        nextGraph.data[relatedNodeId].h = nextGraph.data[relatedNodeId].h + data.h
      }
    })
  }
  // if the change node width did not change, then the vertically related node widths will not change
  if (vertRelatedNodes.length) {
    // if the change node width increased, then the vertically related node widths will decrease
    // if the change node width decreased, then the vertically related node widths will increase
    vertRelatedNodes.forEach(relatedNodeId => {
      nextGraph.data[relatedNodeId].h = nextGraph.data[relatedNodeId].h + (data.h < 0 ? data.h * -1 : data.h)
      if (vertRelatedNodes.includes(relatedNodeId)) {
        nextGraph.data[relatedNodeId].w = nextGraph.data[relatedNodeId].w + data.w
      }
    })
  }
  console.log('after update', JSON.stringify(nextGraph, null, 2))

}

updateGraph(ORIGINAL_GRAPH, CHANGE_EVENT)
console.log('--------------------------------- EXAMPLE 2 -----------------------')
updateGraph(ORIGINAL_GRAPH_1, CHANGE_EVENT_1)