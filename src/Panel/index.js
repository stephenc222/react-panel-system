import React, { useContext } from 'react'
import { PanelSystemContext } from '../context'
import './Panel.css'

const showEdge = (isTrue, classname) => isTrue ? classname : ''

// NOTE: the Drag API cannot be used if I want to set a cursor while "dragging"
// must use mouse move, down and up to simulate drag
const Panel = ({
  w,
  h,
  x,
  y,
  children,
  nodeId,
  leftEdgeClassName,
  rightEdgeClassName,
  topEdgeClassName,
  bottomEdgeClassName
}) => {

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
        className={`${showEdge(x > 0.01, leftEdgeClassName )} panel-horizontal-edge`}
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
            className={`${showEdge(y > 0.01, topEdgeClassName )} panel-vertical-edge`}
          />
          {children}
          <div
            onMouseDown={event => onMouseDown(event, 'BV')}
            className={`${showEdge(y === 0 && y + h <= 0.99, bottomEdgeClassName )} panel-vertical-edge`}
          />
        </div>
      <div
        onMouseDown={event => onMouseDown(event, 'RE')}
        className={`${showEdge(x + w <= 0.99, rightEdgeClassName )} panel-horizontal-edge`}
      />
    </div>
  )
}

export default Panel
