import React, { useEffect, useState } from 'react'
import Panel from '../Panel'

const PanelManager = ({ containerRef, panelComponents, panelData}) => {

  const [mounted, setMounted] = useState(false)
  const renderPanel = (panelNode) => {
    const nodeId = Object.keys(panelNode)[0]
    const panelChildData = panelData.data[nodeId]
    const { PanelComponent } = panelComponents.find( ({id}) => nodeId === id )
    return (
      <Panel {...panelChildData} key={nodeId}>
        <PanelComponent/>
      </Panel>
    )
  }
  const onPanelSizeChange = (data, name) => {
    console.warn('onPanelSizeChange called', { data, name})
  }
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  const { width, height, x, y } = containerRef.current.getBoundingClientRect() 
  return (
    <div style={{display: 'flex', position: 'relative', background: 'yellow', height: '100%', width: '100%'}}>
      {
        panelData.adjList.map(panelNode => {
          return renderPanel(panelNode)
        })
      }
      {/* {
        panelComponents.map( ({id, PanelComponent}) => {
          const {w, h, yOffset, xOffset } = panelData[PanelComponent.name] 
          return (
            <Panel
              onPanelSizeChange={data => onPanelSizeChange(data, PanelComponent.name)}
              key={PanelComponent.name}
              w={w * width}
              h={h * height}
              yOffset={yOffset * height}
              xOffset={xOffset * width}
            >
              <PanelComponent />
            </Panel>
          )
        })
      } */}
    </div>
  )
}

export default PanelManager