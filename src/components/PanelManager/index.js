import React, { createContext, useState, useEffect } from 'react'
import { updateGraph } from './PanelGraph'
import Panel from '../Panel'

export const PanelSystemContext = createContext()

const PanelManager = ({ panelComponents, panelData, onPanelDataChange }) => {

  const [panelDataContext, setPanelDataContext] = useState(panelData)

  useEffect(() => {
    setPanelDataContext(panelData)
  }, [panelData])

  const updatePanelDataContext = (changeEvent) => {
    const nextPanelDataContext = updateGraph(panelDataContext, changeEvent)
    setPanelDataContext(nextPanelDataContext)
    onPanelDataChange(nextPanelDataContext)
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
  const panelManagerContext = [panelDataContext, updatePanelDataContext]
  return (
    <PanelSystemContext.Provider value={panelManagerContext}>
      <div
        style={{
          display: 'flex',
          position: 'relative',
          background: 'yellow',
          height: '100%',
          width: '100%'
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