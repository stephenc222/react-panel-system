import React from 'react'
import Panel from '../Panel'

const PanelManager = ({ panelComponents, panelData}) => {
  const onPanelSizeChange = (data, name) => {
    console.warn('onPanelSizeChange called', { data, name})
  }
  return (
    <div style={{position: 'relative'}}>
      {
        panelComponents.map( PanelComponent => {
          const panelProps = panelData[PanelComponent.name] 
          console.log({ panelProps })
          return (
            <Panel
              onPanelSizeChange={data => onPanelSizeChange(data, PanelComponent.name)}
              key={PanelComponent.name}
              {...panelProps}
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