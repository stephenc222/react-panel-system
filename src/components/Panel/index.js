import React, { useState, useContext } from 'react'
import { PanelSystemContext } from '../PanelManager'
import './Panel.css'

const getPercentChange = (previous, current) => ((current - previous) / previous * 100) / 100

// https://stackoverflow.com/questions/30725607/is-there-any-way-to-bind-a-click-event-to-a-divs-left-border-in-jquery
const Panel = ({ w, h, x, y, children, nodeId }) => {
  const [startPos, setStartPos] = useState({})

  const [,updatePanelDataContext] = useContext(PanelSystemContext)


  const onDragStart = event => {
    setStartPos({ startX: event.pageX, startY: event.pageY })
    let img = document.getElementById('drag-placeholder') 
    if (!document.getElementById('drag-placeholder')) {
      img = new Image()
      img.id = 'drag-placeholder'
      img.style.visibility = 'hidden'
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
      document.body.appendChild(img);
      event.dataTransfer.setDragImage(img, 0, 0);
    } else {
      event.dataTransfer.setDragImage(img, 0, 0);
    }
  }
  const onDrag = (event, nodeId, edgeType) => {
    event.preventDefault()
    const { startX, startY } = startPos
    if (edgeType === 'LE' || edgeType === 'RE') {
      const changeX = getPercentChange(startX, event.pageX)
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
      const changeY = getPercentChange(startY, event.pageY)
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
  const onDragEnd = () => setStartPos({})
  return (
    <div
      onDragOver={event => event.preventDefault()}
      style={{
        display: 'flex',
        position: 'absolute',
        minWidth: `${w * 100}%`,
        maxWidth: `${w * 100}%`,
        minHeight: `${h * 100}%`,
        maxHeight: `${h * 100}%`,
        top: `${y * 100}%`,
        left: `${x * 100}%`,
      }}>
      <div
        draggable="true"
        onDragStart={onDragStart}
        onDrag={event => onDrag(event, nodeId, 'LE')}
        className='panel-horizontal-edge'
        style={{ border: x !== 0 ? '1px solid skyblue': 'none', display: x !== 1 ? '' : 'none'}}
      />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
          }}
        >
          <div
            draggable="true"
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDrag={event => onDrag(event, nodeId, 'TV')}
            className='panel-vertical-edge'
            style={{ border: y !== 0 ? '1px solid lime': 'none', display: y !== 0 ? '' : 'none'}}
          />
          {children}
          <div
            draggable="true"
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDrag={event => onDrag(event, nodeId, 'BV')}
            className='panel-vertical-edge'
            style={{ border: y === 0 && y + h !== 1 ? '1px solid black': 'none', display: y === 0 && y + h !== 0 ? '' : 'none'}}
          />
        </div>
      <div
        draggable="true"
        onDragStart={onDragStart}
        onDrag={event => onDrag(event, nodeId, 'RE')}
        className='panel-horizontal-edge'
        style={{ border: x + w !== 1 ? '1px solid magenta': 'none', display: x + w !== 1 ? '' : 'none'}}
      />
    </div>
  )
}

export default Panel
