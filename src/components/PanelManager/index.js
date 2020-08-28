import React, { useEffect, useState } from 'react'
import Panel from '../Panel'

const PanelManager = ({ containerRef, panelComponents, panelData}) => {

  const [mounted, setMounted] = useState(false)
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
    <div style={{position: 'relative'}}>
      {
        panelComponents.map( PanelComponent => {
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
      }
    </div>
  )
}

export default PanelManager