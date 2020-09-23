import React, { useState, useEffect, useRef } from 'react'
import { updateGraph } from './PanelGraph'
import { PanelSystemContext } from '../context'
import Panel from '../Panel'
import { isContextConsumer } from 'react-is'

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
    const { width, height, x, y } = panelManagerRef.current.getBoundingClientRect()
    const nextPanelWidthPercent = (event.pageX - x) / width
    const nextPanelHeightPercent = (event.pageY - y) / height
    // console.log({pageX: event.pageX, pageY: event.pageY, pageXPercent: (event.pageX - x) / width, pageYPercent: (event.pageY - y) / height })
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
      console.log({
        // edgeType,
        // nextPanelHeightPercent,
        xDiff,
        nextPanelWidthPercent,
        currentWidthPercent,
        currentXPercent
        // currentHeightPercent: panelData.data[nodeId].h
        })
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
      // console.log('WTF:', { height, pageY: event.pageY, y })
      const currentHeightPercent = panelData.data[nodeId].h
      const currentYPercent = panelData.data[nodeId].y
      const diffChange = nextPanelHeightPercent - currentHeightPercent
      const invertedDiffChange = currentHeightPercent - nextPanelHeightPercent
      const yDiff = edgeType === 'BV'
        ? diffChange
        : invertedDiffChange
      const changeEvent = {
        nodeId,
        edgeType,
        data: {
          w: 0,
          // FIXME: All 'TV' and 'BV' transformations are broken
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