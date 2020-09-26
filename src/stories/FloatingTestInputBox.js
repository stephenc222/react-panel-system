import React, { useState, useRef } from 'react'
import Select from './Select'

const FloatingTestInputBox = ({ panelIds, setPanelIds, onMaximize, onMinimize, onRestore, panelIdOptions = [] }) => {
  const [posVal, setPos] = useState({ top: 200, left: 900});
  const [initialOffset, setInitialOffset] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [hide, setHide] = useState(false);
  const floatingBoxRef = useRef(null)
  if (hide) {
    return null
  }
  return (
      <div
        ref={floatingBoxRef}
        draggable="true"
        onDragStart={ event => {
          const { left, top } = floatingBoxRef.current.getBoundingClientRect()
          const offset = {
            top: (event.pageY || event.screenY) - top,
            left: (event.pageX || event.screenX) - left
          }
          setInitialOffset({...offset})
          setIsDragging({...true})
        }}
        onDragOver={event => event.preventDefault()}
        onDrag={ event => {
          setPos({ top: (posVal.top - (event.pageY || event.screenY)) + (event.pageY || event.screenY), left: (posVal.left - (event.pageX || event.screenX)) + (event.pageX || event.screenX)})
        }}
        onDragEnd={ event => {
          setIsDragging(false)
          setPos({ top: (event.pageY || event.screenY) - initialOffset.top , left: (event.pageX || event.screenX)  - initialOffset.left})
        }}
        style={{
          pointerEvents: 'move',
          cursor: isDragging ? 'grabbing' : 'move',
          position: 'absolute',
          top: posVal.top,
          left: posVal.left,
          backgroundColor: 'white',
          boxShadow: '2px 2px 5px black',
          borderRadius: '10px',
          paddingLeft: '3em',
          paddingTop: '0.5em',
          paddingRight: '3em',
          paddingBottom: '3em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
            <div
              onClick={() => setHide(true)}
              style={{
                cursor: 'pointer',
                backgroundColor: '#ff342b',
                color: 'pink',
                fontWeight: 'bold',
                paddingLeft: '0.75em',
                paddingRight: '0.75em',
                borderRadius: '5px',
                marginRight: '-1.5em'
              }}
            >X
          </div>
          </div>
        <Select
          label="Panel Select"
          placeholder="Pick some panels!"
          onValuesChange={ values => setPanelIds(values)}
          options={panelIdOptions}
          multiple
        />
        <div style={{paddingTop: '1.5em', display: 'flex', height: '100%', flexGrow: 1}}>
          <button disabled={panelIds.length !== 1} onClick={onMaximize} style={{marginLeft: '1em', marginRight: '1em'}}>Maximize</button>
          <button onClick={onMinimize} style={{marginLeft: '1em', marginRight: '1em'}}>Minimize</button>
          <button onClick={onRestore} style={{marginLeft: '1em', marginRight: '1em'}}>Restore</button>
        </div>
      </div>
  )
}

export default FloatingTestInputBox