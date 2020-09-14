import React from 'react'
import Panel from '../Panel'


const PanelManager = ({ panelComponents, panelData}) => {

  const renderPanel = (panelNode) => {
    const nodeId = Object.keys(panelNode)[0]
    const panelChildData = panelData.data[nodeId]
    const { PanelComponent } = panelComponents.find( ({id}) => nodeId === id )
    return (
      <Panel {...panelChildData} nodeId={nodeId} key={nodeId}>
        <PanelComponent/>
      </Panel>
    )
  }
  return (
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
        panelData.adjList.map(panelNode => {
          return renderPanel(panelNode)
        })
      }
    </div>
  )
}

export default PanelManager