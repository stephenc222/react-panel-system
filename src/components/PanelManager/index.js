import React, { useEffect, useState } from 'react'
import Panel from '../Panel'

// for vertically related nodes
const VerticalContainer = ({ children }) => {
  return (
    <div style={{ border: '1px solid blue', margin: -1, display: 'flex', flexDirection: 'column'}}>
      {children}
    </div>
  )
}

// for horizontally related nodes
const HorizontalContainer = ({ children }) => {
  return (
    <div style={{ border: '1px solid green', margin: -1, display: 'flex', flexDirection: 'row'}}>
      {children}
    </div>
  )
}

// called once in correct container

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
  // TODO: now, there's a rendering problem, here's the first thought to solve it:
  // horizontally related nodes belong in the same horizontal container, and vertically related 
  // nodes belong in the same vertical container
  // naturally, these containers will contain other containers of nodes. Ideally, if the relationship
  // between components is perserved within the corresponding vertical or horizontal container, 
  // then overlapping containers becomes a non-issue
  // NOTE: an underlying assumption, if a node width is less than 1, must have a horizontal relation to another node(s) that equal 1 in total
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', background: 'yellow', height: '100%', width: '100%'}}>
      {
        panelData.adjList.map(panelNode => {
          console.log({panelNode})
          return renderPanel(panelNode)
        })
      }
      {/* {
        panelComponents.map( ({id, PanelComponent}) => {
          const {w, h, yOffset, xOffset } = panelData[PanelComponent.name] 
          console.log({ w, h, yOffset, xOffset, width, height,x,  y})
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