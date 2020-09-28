import React from 'react'
import { PanelSystemContext } from '../context'
import './Panel.css'

const showEdge = (isTrue, classname) => isTrue ? classname : ''

// slight adjustment to clamp down on potential for an unsafe floating point number
const adjPercent = num => (Math.trunc(num * 10**5) / 10**5 + 2/10**5) 

// NOTE: the Drag API cannot be used if I want to set a cursor while "dragging"
// must use mouse move, down and up to simulate drag
class Panel extends React.Component {

  constructor(props) {
    super(props)
    this.onMouseDown = this.onMouseDown.bind(this)
  }
  onMouseDown (event, edge) {
    const [,actions] = this.context
    actions.setDraggingNode({ nodeId: this.props.nodeId, edge })
    actions.setStartPos({ startX: event.pageX, startY: event.pageY })
  }

  render() {
  const  {
    w,
    h,
    x,
    y,
    children,
    leftEdgeClassName,
    rightEdgeClassName,
    topEdgeClassName,
    bottomEdgeClassName,
    onMouseMove,
    onMouseUp,
  } = this.props

  const [{ draggingNode }] = this.context

  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        width: `${adjPercent(w) * 100}%`,
        height: `${adjPercent(h) * 100}%`,
        top: `${adjPercent(y) * 100}%`,
        left: `${adjPercent(x) * 100}%`,
      }}>
      <div
        onMouseDown={event => this.onMouseDown(event, 'LE')}
        className={`${showEdge(x > 0.01, leftEdgeClassName )} panel-horizontal-edge`}
      />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
          }}
        >
          {/*
            "mask" used to prevent mouse events from being blocked by drag events from children,
            while allowing those same mouse events to be utilized in "onMouseMove" and "onMouseUp"
          */}
          <div
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            style={{
              position: 'fixed',
              display: draggingNode ? '' : 'none',
              zIndex: 9999,
              opacity: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <div
            onMouseDown={event => this.onMouseDown(event, 'TV')}
            className={`${showEdge(y > 0.01, topEdgeClassName )} panel-vertical-edge`}
          />
          {
            React.Children.map(children, child => {
              return React.cloneElement(child, {
                ref: child.ref,
                ...child.props,
              })
            })
          }
          <div
            onMouseDown={event => this.onMouseDown(event, 'BV')}
            className={`${showEdge(y === 0 && y + h <= 0.99, bottomEdgeClassName )} panel-vertical-edge`}
          />
        </div>
      <div
        onMouseDown={event => this.onMouseDown(event, 'RE')}
        className={`${showEdge(x + w <= 0.99, rightEdgeClassName )} panel-horizontal-edge`}
      />
    </div>
  )
}

}


Panel.contextType = PanelSystemContext
export default Panel
