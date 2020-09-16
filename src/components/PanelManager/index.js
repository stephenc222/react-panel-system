import React, { createContext, useState, useEffect } from 'react'
import { updateGraph } from './PanelGraph'
import Panel from '../Panel'

export const PanelSystemContext = createContext()
const getPercentChange = (previous, current) => ((current - previous) / previous * 100) / 100
const PanelManager = ({ panelComponents, panelData, onPanelDataChange }) => {

  const [panelDataContext, setPanelDataContext] = useState(panelData)
  const [draggingNode, setDraggingNode] = useState({})
  const [startPos, setStartPos] = useState({})

  useEffect(() => {
    setPanelDataContext(panelData)
  }, [panelData])

  const updatePanelDataContext = (changeEvent) => {
    const nextPanelDataContext = updateGraph(panelDataContext, changeEvent)
    setPanelDataContext(nextPanelDataContext)
    onPanelDataChange && onPanelDataChange(nextPanelDataContext)
  }

  const renderPanel = (panelNode) => {
    const nodeId = Object.keys(panelNode)[0]
    const panelChildData = panelDataContext.data[nodeId]
    const { PanelComponent } = panelComponents.find( ({id}) => nodeId === id )
    return (
      <Panel {...panelChildData} nodeId={nodeId} key={nodeId}>
        <PanelComponent/>
      </Panel>
    )
  }
  const panelManagerContext = [{panelDataContext, draggingNode}, { updatePanelDataContext, setDraggingNode, setStartPos }]
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
          w: changeX,
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
          h: changeY
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
          cursor: draggingNode && draggingNode.edge && (draggingNode.edge === 'LE' || draggingNode.edge === 'RE')
          ? 'col-resize' 
          : draggingNode && draggingNode.edge && (draggingNode.edge === 'TV' || draggingNode.edge === 'BV') ? 'row-resize' : ''
        }}
      >
        {
          panelDataContext.adjList.map(panelNode => {
            return renderPanel(panelNode)
          })
        }
      </div>
    </PanelSystemContext.Provider>
  )
}

export default PanelManager