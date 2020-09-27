import React, { useState, useEffect, useRef } from 'react'
import { updateGraph } from './PanelGraph'
import { PanelSystemContext } from '../context'
import Panel from '../Panel'

const getPercentChange = (previous, current) => ((current - previous) / previous * 100) / 100
export const PanelManager = ({
  panelComponents,
  panelData,
  onPanelDataChange,
  leftEdgeClassName = 'panel-horizontal-edge--left',
  rightEdgeClassName = 'panel-horizontal-edge--right',
  topEdgeClassName = 'panel-vertical-edge--top',
  bottomEdgeClassName  = 'panel-vertical-edge--bottom'
}) => {
  
  const panelManagerRef = useRef(null)
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
        leftEdgeClassName={leftEdgeClassName}
        rightEdgeClassName={rightEdgeClassName}
        topEdgeClassName={topEdgeClassName}
        bottomEdgeClassName={bottomEdgeClassName}
        {...panelChildData}
      >
        <PanelComponent/>
      </Panel>
    )
  }
  const panelManagerContext = [{panelDataContext: panelData, draggingNode}, { updatePanelDataContext, setDraggingNode, setStartPos }]
  const onMouseMove = (event) => {
    event.preventDefault()
    const { width, height, x, y } = panelManagerRef.current.getBoundingClientRect()
    const nextPanelWidthPercent = Math.trunc(((event.pageX - x) / width) * 10**5) / 10**5
    const nextPanelHeightPercent = Math.trunc(((event.pageY - y) / height) * 10**5) / 10**5
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
      if (nextPanelWidthPercent === 0 || isNaN(nextPanelWidthPercent)) {
        return
      }
      const currentWidthPercent = panelData.data[nodeId].w 
      const currentXPercent = panelData.data[nodeId].x
      const xDiff = edgeType === 'RE'
        ? nextPanelWidthPercent - currentWidthPercent - currentXPercent
        : currentXPercent - nextPanelWidthPercent
      const changeEvent = {
        nodeId,
        edgeType,
        data: {
          // w: changeX * (window.innerHeight / window.innerWidth),
          // FIXME: 'LE' transformations are broken and 'RE' with 'LE' related nodes are broken
          w: xDiff,
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
      if (nextPanelHeightPercent === 0 || isNaN(nextPanelHeightPercent)) {
        return
      }
      const currentHeightPercent = panelData.data[nodeId].h
      const diffChange = nextPanelHeightPercent - currentHeightPercent
      const yDiff = edgeType === 'BV'
        ? diffChange
        : nextPanelHeightPercent
      const changeEvent = {
        nodeId,
        edgeType,
        data: {
          w: 0,
          h: edgeType === 'BV' ? yDiff : yDiff,
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
        ref={panelManagerRef}
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