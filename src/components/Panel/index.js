import React, { useContext } from 'react'
import { PanelSystemContext } from '../PanelManager'
import './Panel.css'

// NOTE: the Drag API cannot be used if I want to set a cursor while "dragging"
// must use mouse move, down and up to simulate drag
const Panel = ({ w, h, x, y, children, nodeId, }) => {

  const [, { setDraggingNode, setStartPos }] = useContext(PanelSystemContext)


  const onMouseDown = (event, edge) => {
    setDraggingNode({ nodeId, edge})
    setStartPos({ startX: event.pageX, startY: event.pageY })
  }
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        width: `${w * 100}%`,
        height: `${h * 100}%`,
        top: `${y * 100}%`,
        left: `${x * 100}%`,
      }}>
      <div
        onMouseDown={event => onMouseDown(event, 'LE')}
        className='panel-horizontal-edge'
        style={{ border: x !== 0 ? '4px solid skyblue': 'none', display: x !== 1 ? '' : 'none'}}
      />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
          }}
        >
          <div
            onMouseDown={event => onMouseDown(event, 'TV')}
            className='panel-vertical-edge'
            style={{ border: y !== 0 ? '4px solid lime': 'none', display: y !== 0 ? '' : 'none'}}
          />
          {children}
          <div
            onMouseDown={event => onMouseDown(event, 'BV')}
            className='panel-vertical-edge'
            style={{ border: y === 0 && y + h !== 1 ? '4px solid black': 'none', display: y === 0 && y + h !== 0 ? '' : 'none'}}
          />
        </div>
      <div
        onMouseDown={event => onMouseDown(event, 'RE')}
        className='panel-horizontal-edge'
        style={{ border: x + w !== 1 ? '4px solid magenta': 'none', display: x + w !== 1 ? '' : 'none'}}
      />
    </div>
  )
}

export default Panel
