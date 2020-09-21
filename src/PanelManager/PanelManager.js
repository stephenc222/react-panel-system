import React, { useState, useEffect } from 'react'
import { updateGraph } from './PanelGraph'
import { PanelSystemContext } from '../context'
import Panel from '../Panel'

const getPercentChange = (previous, current) => ((current - previous) / previous * 100) / 100
export const PanelManager = ({
  panelComponents,
  panelData,
  onPanelDataChange,
  leftEdgeClassname = 'panel-horizontal-edge--left',
  rightEdgeClassname = 'panel-horizontal-edge--right',
  topEdgeClassname = 'panel-vertical-edge--top',
  bottomEdgeClassname  = 'panel-vertical-edge--bottom'
}) => {

  const [draggingNode, setDraggingNode] = useState({})
  const [startPos, setStartPos] = useState({})

  const updatePanelDataContext = (changeEvent) => {
    const nextPanelDataContext = updateGraph(panelData, changeEvent)
    onPanelDataChange && onPanelDataChange(nextPanelDataContext)
  }

  const renderPanel = (panelNode) => {
    const nodeId = Object.keys(panelNode)[0]
    const panelChildData = panelData.data[nodeId]
    const { PanelComponent } = panelComponents.find( ({id}) => nodeId === id )
    return (
      <Panel
        key={nodeId}
        nodeId={nodeId}
        leftEdgeClassname={leftEdgeClassname}
        rightEdgeClassname={rightEdgeClassname}
        topEdgeClassname={topEdgeClassname}
        bottomEdgeClassname={bottomEdgeClassname}
        {...panelChildData}
      >
        <PanelComponent/>
      </Panel>
    )
  }
  const panelManagerContext = [{panelDataContext: panelData, draggingNode}, { updatePanelDataContext, setDraggingNode, setStartPos }]
  const onMouseMove = (event) => {
    event.preventDefault()
    const { nodeId, edge: edgeType } = draggingNode
    if (nodeId === undefined) {
      return
    }
    const { startX, startY } = startPos
    if (edgeType === 'LE' || edgeType === 'RE') {
      const changeX = edgeType === 'RE' ? getPercentChange(startX, event.pageX) : getPercentChange(event.pageX, startX)
      if (isNaN(changeX) || changeX === 0) {
        return
      }
      const changeEvent = {
        nodeId,
        edgeType,
        data: {
          w: changeX * (window.innerHeight / window.innerWidth),
          h: 0
        }
      }
      updatePanelDataContext(changeEvent)
      setStartPos({ startX: event.pageX, startY: event.pageY})
      return
    }
    if (edgeType === 'TV' || edgeType === 'BV') {
      const changeY = edgeType === 'BV' ? getPercentChange(startY, event.pageY) : getPercentChange(event.pageY, startY)  
      if (isNaN(changeY) || changeY === 0) {
        return
      }
      const changeEvent = {
        nodeId,
        edgeType,
        data: {
          w: 0,
          h: changeY * (window.innerHeight / window.innerWidth)
        }
      }
      updatePanelDataContext(changeEvent)
      setStartPos({ startX: event.pageX, startY: event.pageY})
      return
    }
  }
  const onMouseUp = () => {
    setDraggingNode({})
    setStartPos({})
  }
  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.addEventListener('mouseup', onMouseUp)
    }
  }, [])
  return (
    <PanelSystemContext.Provider value={panelManagerContext}>
      <div
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          display: 'flex',
          position: 'relative',
          background: 'yellow',
          height: '100%',
          width: '100%',
          cursor: draggingNode
    && draggingNode.edge 
    && (draggingNode.edge === 'LE' || draggingNode.edge === 'RE')
      ? 'col-resize' 
      : draggingNode
        && draggingNode.edge
        && (draggingNode.edge === 'TV' || draggingNode.edge === 'BV')
          ? 'row-resize'
          : ''
        }}
      >
        {
          panelData.adjList.map(panelNode => {
            return renderPanel(panelNode)
          })
        }
      </div>
    </PanelSystemContext.Provider>
  )
}